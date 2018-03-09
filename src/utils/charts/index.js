import _ from 'lodash';
import moment from 'moment';

const defaultConfig = {
  title: {
    text: 'Chart',
  },
  xAxis: {
    labels: {
      format: '{value:%b %e}',
    },
    title: {
      text: 'Date',
    },
    type: 'datetime',
  },
};

const defaultFormat = {
  isPercent: false,
};

const convertToPercent = data => data * 100;

const formatEdgeData = (params) => {
  const {
    startDate,
    endDate,
    result,
  } = params;

  const formattedResult = result;

  const firstEntry = formattedResult[0];
  if (firstEntry) {
    const entryDateTime = moment(firstEntry[0]);
    const startDateTime = moment(startDate);

    if (startDateTime.diff(entryDateTime, 'days') > 0) {
      formattedResult.unshift([startDate.getTime(), firstEntry[1]]);
    }
  }

  const lastEntry = formattedResult[formattedResult.length - 1];
  if (lastEntry) {
    const entryDateTime = moment(lastEntry[0]);
    const endDateTime = moment(endDate);

    if (endDateTime.diff(entryDateTime, 'days') > 0) {
      formattedResult.push([endDate.getTime(), lastEntry[1]]);
    }
  }

  return formattedResult;
};

export const convertResultToMap = (response, key) => {
  const result = response.reduce((acc, item) => {
    const {
      timestamp,
      result,
    } = item;

    const resultVal = key ? result[key] : result;

    const date = new Date(timestamp).getTime();
    acc[date] = {
      data: resultVal,
      date,
    };
    return acc;
  }, {});

  return result;
};

const formatData = (data, config) => {
  const formatConfig = {
    ...defaultFormat,
    ...config,
  };

  const {
    isPercent,
  } = formatConfig;

  let formattedData = data;

  if (isPercent) {
    formattedData = convertToPercent(formattedData);
  }

  return formattedData;
};

const executeUtility = (utilConfig, params, config) => {
  const {
    edge,
    utilFn,
  } = utilConfig;

  const {
    startDate,
    endDate,
    result,
  } = params;

  const data = utilFn(result, config);

  if (!edge) {
    return data;
  }

  return formatEdgeData({
    endDate,
    result: data,
    startDate,
  });
};

const instantaneousAverage = (result, config) =>
  Object.keys(result).sort().map((key) => {
    const {
      date,
      data,
    } = result[key];
    return [date, formatData(data, config)];
  });

const runningAverage = (result, config) => {
  let index = 0;
  const avg = Object.keys(result).sort().reduce((acc, key) => {
    const {
      data,
      date,
    } = result[key];
    let prevValue = 0;

    if (index > 0) {
      prevValue = acc[index - 1][1];
    }

    const average = (prevValue + formatData(data, config)) / (index + 1);

    acc.push([date, average]);
    index += 1;
    return acc;
  }, []);

  return avg;
};

const movingAverage = (result, config) => {
  const {
    count,
  } = config;

  let index = 0;
  const avg = Object.keys(result).sort().reduce((acc, key) => {
    const {
      date,
      data,
    } = result[key];
    let sum = 0;

    const prevIndex = index - 1;
    const limit = Math.max(-1, prevIndex - count);
    for (let i = prevIndex; i > limit; i -= 1) {
      sum += acc[i][1];
    }

    const pointCount = Math.min(count + 1, index + 1);

    const average = (sum + formatData(data, config)) / pointCount;

    acc.push([date, average]);
    index += 1;
    return acc;
  }, []);

  return avg;
};

/* eslint-disable no-param-reassign */
const deepExtend = (target, ...source) => {
  source.forEach((obj) => {
    Object.keys(obj).forEach((prop) => {
      if (typeof obj[prop] === 'object' && !_.isArray(obj[prop])) {
        target[prop] = target[prop] || {};
        deepExtend(target[prop], obj[prop]);
      } else {
        target[prop] = obj[prop];
      }
    });
  });

  return target;
};
/* eslint-enable no-param-reassign */

export const getInstantaneousAverage = (...args) =>
  executeUtility({ utilFn: instantaneousAverage }, ...args);
export const getMovingAverage = (...args) =>
  executeUtility({ edge: true, utilFn: movingAverage }, ...args);
export const getRunningAverage = (...args) =>
  executeUtility({ edge: true, utilFn: runningAverage }, ...args);

export const mergeChartConfig = (renderTo, config) =>
  deepExtend({ chart: { renderTo } }, defaultConfig, config);

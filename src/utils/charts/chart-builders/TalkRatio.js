import { defaultMemoize } from 'reselect';
import {
  convertResultToMap,
  getInstantaneousAverage,
  getMovingAverage,
  mergeChartConfig,
} from '../../charts';
import { FIELDS } from '../../types/Calls';

const patchResponse = defaultMemoize((params) => {
  const {
    endDate,
    data: response,
    startDate,
  } = params;

  const result = convertResultToMap(response, FIELDS.CUSTOMER_TALK_RATIO);

  const chartConfig = {
    endDate,
    result,
    startDate,
  };

  const instant = getInstantaneousAverage(chartConfig, { isPercent: true });
  const moving = getMovingAverage(chartConfig, { count: 5, isPercent: true });
  return {
    instant,
    moving,
  };
});

const buildChartData = (data, renderTo) => {
  const {
    instant,
    moving,
  } = data;

  const chartData = [
    {
      data: instant,
      name: 'Customer Talk Ratio',
      type: 'column',
    },
    {
      data: moving,
      name: 'Ongoing Performance',
      type: 'spline',
    },
  ];

  return mergeChartConfig(renderTo, {
    series: chartData,
    subtitle: {
      text: 'The amount of time the customer speaks relative to the conversation (> 90 sec)',
    },
    title: {
      text: 'Average Customer Talk Ratio',
    },
    tooltip: {
      headerFormat: '<b>{point.y:.1f}%</b><br>',
      pointFormat: '{point.x:%b %e}',
    },
    yAxis: {
      max: 100,
      min: 0,
      plotLines: [{
        color: 'red',
        dashStyle: 'longdash',
        value: 60,
        width: 2,
      }],
      title: {
        text: 'Customer Talk Ratio (%)',
      },
    },
  });
};

export default function builder(params) {
  const {
    data,
    endDate,
    key,
    renderTo,
    startDate,
  } = params;

  const chartData = patchResponse({ data: data.toJS(), endDate, key, startDate });
  return buildChartData(chartData, renderTo);
}

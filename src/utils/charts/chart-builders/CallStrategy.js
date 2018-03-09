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
    data,
    endDate,
    startDate,
  } = params;

  const result = convertResultToMap(data, FIELDS.DETECTION_RATIO);

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
      name: 'Daily Average',
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
      text: 'Adherence to the script on a daily basis across all conversations (> 90 sec)',
    },
    title: {
      text: 'Average Call Strategy',
    },
    tooltip: {
      headerFormat: '<b>{point.y:.1f}%</b><br>',
      pointFormat: '{point.x:%b %e}',
    },
    yAxis: {
      max: 100,
      min: 0,
      title: {
        text: 'Call Strategy (%)',
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

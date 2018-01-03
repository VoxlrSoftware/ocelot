import {
  convertResultToMap,
  getInstantaneousAverage,
  getMovingAverage,
  mergeChartConfig,
} from '../../charts';

const patchResponse = (params) => {
  const {
    endDate,
    data,
    startDate,
  } = params;

  const result = convertResultToMap(data);

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
};

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
    renderTo,
    startDate,
  } = params;

  const chartData = patchResponse({ data: data.toJS(), endDate, startDate });
  return buildChartData(chartData, renderTo);
}

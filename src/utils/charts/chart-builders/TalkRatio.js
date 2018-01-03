import {
  convertResultToMap,
  getInstantaneousAverage,
  getMovingAverage,
  mergeChartConfig,
} from '../../charts';

const patchResponse = (params) => {
  const {
    endDate,
    data: response,
    startDate,
  } = params;

  const result = convertResultToMap(response);

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
    renderTo,
    startDate,
  } = params;

  const chartData = patchResponse({ data: data.toJS(), endDate, startDate });
  return buildChartData(chartData, renderTo);
}

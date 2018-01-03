import {
  convertResultToMap,
  getInstantaneousAverage,
  getMovingAverage,
  mergeChartConfig,
} from '../../charts';

const patchResponse = (params) => {
  const {
    startDate,
    endDate,
    data: response,
  } = params;

  const calls = [];
  const conversations = [];

  response.forEach((resp) => {
    const {
      _id,
      results: data,
    } = resp;

    calls.push({ _id, results: (data.calls - data.conversations) / data.calls });
    conversations.push({ _id, results: data.conversations / data.calls });
  });

  const callsResult = convertResultToMap(calls);
  const conversationsResult = convertResultToMap(conversations);

  const chartConfig = {
    endDate,
    startDate,
  };

  const avgCalls = getInstantaneousAverage({ ...chartConfig, result: callsResult },
    { isPercent: true });
  const avgConversations = getInstantaneousAverage({ ...chartConfig, result: conversationsResult },
    { isPercent: true });
  const avgPercent = getMovingAverage({ ...chartConfig, result: conversationsResult },
    { count: 5, isPercent: true });

  return {
    avgCalls,
    avgConversations,
    avgPercent,
  };
};

const buildChartData = (data, renderTo) => {
  const {
    avgCalls,
    avgConversations,
    avgPercent,
  } = data;

  const chartData = [
    {
      color: '#f45b5b',
      data: avgCalls,
      name: 'Non-Conversations ( < 90 sec)',
      type: 'column',
    },
    {
      data: avgConversations,
      name: 'Conversations ( >= 90 sec )',
      type: 'column',
    },
    {
      data: avgPercent,
      name: 'Conversation Ratio',
      type: 'spline',
    },
  ];

  return mergeChartConfig(renderTo, {
    plotOptions: {
      column: {
        stacking: 'normal',
      },
    },
    series: chartData,
    subtitle: {
      text: 'Ratio of conversations (> 90 sec) vs Non-Conversations',
    },
    title: {
      text: 'Average Conversation Ratio',
    },
    tooltip: {
      headerFormat: '<b>{point.y:.1f}%</b><br>',
      pointFormat: '{point.x:%b %e}',
    },
    yAxis: [
      {
        max: 100,
        min: 0,
        title: {
          text: 'Call Composition (%)',
        },
      },
    ],
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

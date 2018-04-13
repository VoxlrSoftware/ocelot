import React from 'react';
import { connect } from 'react-redux';
import fetch from '../../../utils/redux/fetch';
import Summary from '../../../components/summary/Summary';
import Chart from '../../../components/chart/Chart';
import CallStrategyBuilder from '../../../utils/charts/chart-builders/CallStrategy';
import ConversationRatioBuilder from '../../../utils/charts/chart-builders/ConversationRatio';
import TalkRatioBuilder from '../../../utils/charts/chart-builders/TalkRatio';
import {
  getAverages,
  getRollups,
} from '../reducers/SummaryReducer';
import {
  fetchAverages,
  fetchRollups,
} from '../actions/SummaryActions';
import { FIELDS } from '../../../utils/types/Calls';

const FIELDS_TO_FETCH = [
  FIELDS.CONVERSATION,
  FIELDS.CUSTOMER_TALK_RATIO,
  FIELDS.DETECTION_RATIO,
  FIELDS.TOTAL_COUNT,
];

const renderPercent = (data) => {
  const parsed = (data || 0) * 100;
  return `${parsed.toFixed(1)} %`;
};

const getConversationRatio = (result) => {
  if (!result) {
    return;
  }

  const conversationCount = result.getSafe('result', FIELDS.CONVERSATION) || 0;
  const totalCount = result.getSafe('result', FIELDS.TOTAL_COUNT) || 0;

  return totalCount > 0 ? conversationCount / totalCount : totalCount;
};

const getStatistics = (state) => {
  return [
    {
      data: getAverages(state).getSafe('result', FIELDS.DETECTION_RATIO),
      isLoading: getAverages(state).isFetching,
      label: 'Call Strategy',
      name: FIELDS.DETECTION_RATIO,
      render: renderPercent,
    },
    {
      data: getAverages(state).getSafe('result', FIELDS.CUSTOMER_TALK_RATIO),
      isLoading: getAverages(state).isFetching,
      label: 'Customer Talk Ratio',
      name: FIELDS.CUSTOMER_TALK_RATIO,
      render: renderPercent,
    },
    {
      data: getConversationRatio(getAverages(state)),
      isLoading: getAverages(state).isFetching,
      label: 'Conversation Ratio',
      name: FIELDS.CONVERSATION,
      render: renderPercent,
    },
  ];
};

const getChartProps = (state, props) => {
  const {
    endDate,
    startDate,
  } = props;

  const buildParams = {
    endDate,
    startDate,
  };

  return {
    [FIELDS.DETECTION_RATIO]: {
      buildParams,
      chartBuilder: CallStrategyBuilder,
      chartKey: FIELDS.DETECTION_RATIO,
      data: getRollups(state).data,
      isLoading: getRollups(state).isFetching,
    },
    [FIELDS.CUSTOMER_TALK_RATIO]: {
      buildParams,
      chartBuilder: TalkRatioBuilder,
      chartKey: FIELDS.CUSTOMER_TALK_RATIO,
      data: getRollups(state).data,
      isLoading: getRollups(state).isFetching,
    },
    [FIELDS.CONVERSATION]: {
      buildParams,
      chartBuilder: ConversationRatioBuilder,
      chartKey: FIELDS.CONVERSATION,
      data: getRollups(state).data,
      isLoading: getRollups(state).isFetching,
    },
  };
};

const renderComponent = (props) => {
  return <Chart { ...props } />;
};

const mapStateToProps = (state, props) => {
  const statistics = getStatistics(state);
  const renderProps = getChartProps(state, props);

  return {
    renderComponent,
    renderProps,
    statistics,
  };
};

const mapDispatchToProps = {
  fetchAverages,
  fetchRollups,
};

const fetchFn = (props) => {
  const {
    employee,
    endDate,
    fetchAverages,
    fetchRollups,
    startDate,
  } = props;

  const fields = FIELDS_TO_FETCH;
  const employeeId = employee.get('id');

  const promises = [
    fetchAverages({ employeeId, endDate, fields, startDate }),
    fetchRollups({ employeeId, endDate, fields, startDate }),
  ];

  return Promise.all(promises);
};

export default connect(mapStateToProps, mapDispatchToProps)(fetch(fetchFn)(Summary));

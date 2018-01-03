import React from 'react';
import { connect } from 'react-redux';
import fetch from '../../../utils/redux/fetch';
import Summary from '../../../components/summary/Summary';
import ChartContainer from '../../../components/chart/ChartContainer';

import {
  getCallStrategy,
  getCallStrategyChart,
  getConversationRatio,
  getConversationRatioChart,
  getTalkRatio,
  getTalkRatioChart,
} from '../reducers/SummaryReducer';
import {
  fetchCallStrategy,
  fetchCallStrategyChart,
  fetchConversationRatio,
  fetchConversationRatioChart,
  fetchCustomerTalkRatio,
  fetchCustomerTalkRatioChart,
} from '../actions/SummaryActions';
import CallStrategyBuilder from '../../../utils/charts/chart-builders/CallStrategy';
import ConversationRatioBuilder from '../../../utils/charts/chart-builders/ConversationRatio';
import TalkRatioBuilder from '../../../utils/charts/chart-builders/TalkRatio';
import {
  CALL_STRATEGY_SUMMARY,
  CONVERSATION_RATIO_SUMMARY,
  CUSTOMER_TALK_RATIO_SUMMARY,
} from '../../../Constants';
import { calculateConversationRatio } from '../../../utils/types/Calls';

const renderPercent = (data) => {
  const parsed = (data || 0) * 100;
  return `${parsed.toFixed(1)} %`;
};

const getStatistics = (state) => {
  return [
    {
      data: getCallStrategy(state).data,
      isLoading: getCallStrategy(state).isFetching,
      label: 'Call Strategy',
      name: CALL_STRATEGY_SUMMARY,
      render: renderPercent,
    },
    {
      data: getTalkRatio(state).data,
      isLoading: getTalkRatio(state).isFetching,
      label: 'Customer Talk Ratio',
      name: CUSTOMER_TALK_RATIO_SUMMARY,
      render: renderPercent,
    },
    {
      data: calculateConversationRatio(getConversationRatio(state).data),
      isLoading: getConversationRatio(state).isFetching,
      label: 'Conversation Ratio',
      name: CONVERSATION_RATIO_SUMMARY,
      render: renderPercent,
    },
  ];
};

const getChartProps = (props) => {
  const {
    companyId,
    endDate,
    startDate,
  } = props;

  const buildParams = {
    endDate,
    startDate,
  };

  const fetchParams = {
    companyId,
    ...buildParams,
  };

  return {
    [CALL_STRATEGY_SUMMARY]: {
      buildParams,
      chartBuilder: CallStrategyBuilder,
      fetchChart: dispatch => dispatch(fetchCallStrategyChart(fetchParams)),
      selector: getCallStrategyChart,
    },
    [CONVERSATION_RATIO_SUMMARY]: {
      buildParams,
      chartBuilder: ConversationRatioBuilder,
      fetchChart: dispatch => dispatch(fetchConversationRatioChart(fetchParams)),
      selector: getConversationRatioChart,
    },
    [CUSTOMER_TALK_RATIO_SUMMARY]: {
      buildParams,
      chartBuilder: TalkRatioBuilder,
      fetchChart: dispatch => dispatch(fetchCustomerTalkRatioChart(fetchParams)),
      selector: getTalkRatioChart,
    },
  };
};

const renderComponent = (props) => {
  return <ChartContainer { ...props } />;
};

const mapStateToProps = (state, props) => {
  const statistics = getStatistics(state);
  const renderProps = getChartProps(props);

  return {
    renderComponent,
    renderProps,
    statistics,
  };
};

const mapDispatchToProps = {
  fetchCallStrategy,
  fetchCallStrategyChart,
  fetchConversationRatio,
  fetchConversationRatioChart,
  fetchCustomerTalkRatio,
  fetchCustomerTalkRatioChart,
};

const fetchFn = (props) => {
  const {
    companyId,
    endDate,
    fetchCallStrategy,
    fetchConversationRatio,
    fetchCustomerTalkRatio,
    startDate,
  } = props;

  const promises = [
    fetchCallStrategy({ companyId, endDate, startDate }),
    fetchConversationRatio({ companyId, endDate, startDate }),
    fetchCustomerTalkRatio({ companyId, endDate, startDate }),
  ];

  return Promise.all(promises);
};

export default connect(mapStateToProps, mapDispatchToProps)(fetch(fetchFn)(Summary));

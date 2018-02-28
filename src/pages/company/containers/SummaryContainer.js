import React from 'react';
import { connect } from 'react-redux';
import fetch from '../../../utils/redux/fetch';
import Summary from '../../../components/summary/Summary';
import {
  getAverages,
  getRollups,
} from '../reducers/SummaryReducer';
import {
  fetchAverages,
  fetchRollups,
} from '../actions/SummaryActions';
import {
  DETECTION_RATIO_SUMMARY,
  CONVERSATION_RATIO_SUMMARY,
  CUSTOMER_TALK_RATIO_SUMMARY,
} from '../../../Constants';

const FIELDS_TO_FETCH = [
  'detectionRatio',
  'customerTalkRatio',
];

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

const mapStateToProps = (state, props) => {
  return {

  };
};

const mapDispatchToProps = {
  fetchAverages,
  fetchRollups,
};

const fetchFn = (props) => {
  const {
    companyId,
    endDate,
    fetchAverages,
    fetchRollups,
    startDate,
  } = props;

  const fields = FIELDS_TO_FETCH;

  const promises = [
    fetchAverages({ companyId, endDate, fields, startDate }),
    fetchRollups({ companyId, endDate, fields, startDate }),
  ];

  return Promise.all(promises);
};

export default connect(mapStateToProps, mapDispatchToProps)(fetch(fetchFn)(Summary));

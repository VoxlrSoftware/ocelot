import {
  createMeteorCallAction,
  createMultipleActions,
} from '../../../utils/redux/actions';
import {
  EMPLOYEE_SUMMARY_CHART_FETCH_REQUESTED,
  EMPLOYEE_SUMMARY_CHART_FETCH_FAILED,
  EMPLOYEE_SUMMARY_CHART_FETCH_SUCCESS,
  EMPLOYEE_SUMMARY_FETCH_FAILED,
  EMPLOYEE_SUMMARY_FETCH_REQUESTED,
  EMPLOYEE_SUMMARY_FETCH_SUCCESS,
} from '../../../actionTypes';
import {
  CALL_OUTCOME_SUMMARY,
  CALL_STRATEGY_SUMMARY,
  CONVERSATION_RATIO_SUMMARY,
  CUSTOMER_TALK_RATIO_SUMMARY,
} from '../../../Constants';
import {
  getCallOutcome,
  getCallStrategy,
  getCallStrategyChart,
  getConversationRatio,
  getConversationRatioChart,
  getTalkRatio,
  getTalkRatioChart,
} from '../reducers/SummaryReducer';

const [
  onSummaryFetchRequested,
  onSummaryFetchFailed,
  onSummaryFetchSuccess,
] = createMultipleActions([
  EMPLOYEE_SUMMARY_FETCH_REQUESTED,
  EMPLOYEE_SUMMARY_FETCH_FAILED,
  EMPLOYEE_SUMMARY_FETCH_SUCCESS,
]);

const fetchSummary = (params) => {
  const {
    callPath,
    employeeId,
    endDate,
    shouldFetch,
    startDate,
    summaryType,
  } = params;

  return createMeteorCallAction({
    callPath,
    onFail: error => onSummaryFetchFailed({
      error,
      summaryType,
    }),
    onRequest: onSummaryFetchRequested({
      summaryType,
    }),
    onSuccess: (data) => {
      return onSummaryFetchSuccess({
        data: data.length ? data[0].results : 0,
        summaryType,
      });
    },
    params: {
      employeeId,
      endDate,
      startDate,
    },
    shouldFetch,
  });
};

export const fetchCallStrategy = (params) => {
  return fetchSummary({
    callPath: 'calls.scriptComplianceByEmployee',
    shouldFetch: state => getCallStrategy(state).shouldFetch(),
    summaryType: CALL_STRATEGY_SUMMARY,
    ...params,
  });
};

export const fetchCustomerTalkRatio = (params) => {
  return fetchSummary({
    callPath: 'calls.customerTalkRatioByEmployee',
    shouldFetch: state => getTalkRatio(state).shouldFetch(),
    summaryType: CUSTOMER_TALK_RATIO_SUMMARY,
    ...params,
  });
};

export const fetchConversationRatio = (params) => {
  return fetchSummary({
    callPath: 'calls.conversationRatioByEmployee',
    shouldFetch: state => getConversationRatio(state).shouldFetch(),
    summaryType: CONVERSATION_RATIO_SUMMARY,
    ...params,
  });
};

export const fetchCallOutcome = (params) => {
  return fetchSummary({
    callPath: 'calls.callOutcomeByEmployee',
    shouldFetch: state => getCallOutcome(state).shouldFetch(),
    summaryType: CALL_OUTCOME_SUMMARY,
    ...params,
  });
};

const [
  onSummaryChartFetchRequested,
  onSummaryChartFetchFailed,
  onSummaryChartFetchSuccess,
] = createMultipleActions([
  EMPLOYEE_SUMMARY_CHART_FETCH_REQUESTED,
  EMPLOYEE_SUMMARY_CHART_FETCH_FAILED,
  EMPLOYEE_SUMMARY_CHART_FETCH_SUCCESS,
]);

const fetchSummaryChart = (params) => {
  const {
    callPath,
    employeeId,
    endDate,
    shouldFetch,
    startDate,
    summaryType,
  } = params;

  return createMeteorCallAction({
    callPath,
    onFail: error => onSummaryChartFetchFailed({
      error,
      summaryType,
    }),
    onRequest: onSummaryChartFetchRequested({
      summaryType,
    }),
    onSuccess: (data) => {
      return onSummaryChartFetchSuccess({
        data,
        summaryType,
      });
    },
    params: {
      employeeId,
      endDate,
      startDate,
    },
    shouldFetch,
  });
};

export const fetchCallStrategyChart = (params) => {
  return fetchSummaryChart({
    callPath: 'calls.agg.scriptComplianceByEmployee',
    shouldFetch: state => getCallStrategyChart(state).shouldFetch(),
    summaryType: `${CALL_STRATEGY_SUMMARY}Chart`,
    ...params,
  });
};

export const fetchCustomerTalkRatioChart = (params) => {
  return fetchSummaryChart({
    callPath: 'calls.agg.customerTalkRatioByEmployee',
    shouldFetch: state => getTalkRatioChart(state).shouldFetch(),
    summaryType: `${CUSTOMER_TALK_RATIO_SUMMARY}Chart`,
    ...params,
  });
};

export const fetchConversationRatioChart = (params) => {
  return fetchSummaryChart({
    callPath: 'calls.agg.conversationRatioByEmployee',
    shouldFetch: state => getConversationRatioChart(state).shouldFetch(),
    summaryType: `${CONVERSATION_RATIO_SUMMARY}Chart`,
    ...params,
  });
};

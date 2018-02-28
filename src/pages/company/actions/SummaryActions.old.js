import {
  createMeteorCallAction,
  createMultipleActions,
} from '../../../utils/redux/actions';
import {
  COMPANY_SUMMARY_CHART_FETCH_REQUESTED,
  COMPANY_SUMMARY_CHART_FETCH_FAILED,
  COMPANY_SUMMARY_CHART_FETCH_SUCCESS,
  COMPANY_SUMMARY_FETCH_FAILED,
  COMPANY_SUMMARY_FETCH_REQUESTED,
  COMPANY_SUMMARY_FETCH_SUCCESS,
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
  COMPANY_SUMMARY_FETCH_REQUESTED,
  COMPANY_SUMMARY_FETCH_FAILED,
  COMPANY_SUMMARY_FETCH_SUCCESS,
]);

const fetchSummary = (params) => {
  const {
    callPath,
    companyId,
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
      companyId,
      endDate,
      startDate,
    },
    shouldFetch,
  });
};

export const fetchCallStrategy = (params) => {
  return fetchSummary({
    callPath: 'calls.scriptComplianceByCompany',
    shouldFetch: state => getCallStrategy(state).shouldFetch(),
    summaryType: CALL_STRATEGY_SUMMARY,
    ...params,
  });
};

export const fetchCustomerTalkRatio = (params) => {
  return fetchSummary({
    callPath: 'calls.customerTalkRatioByCompany',
    shouldFetch: state => getTalkRatio(state).shouldFetch(),
    summaryType: CUSTOMER_TALK_RATIO_SUMMARY,
    ...params,
  });
};

export const fetchConversationRatio = (params) => {
  return fetchSummary({
    callPath: 'calls.conversationRatioByCompany',
    shouldFetch: state => getConversationRatio(state).shouldFetch(),
    summaryType: CONVERSATION_RATIO_SUMMARY,
    ...params,
  });
};

export const fetchCallOutcome = (params) => {
  return fetchSummary({
    callPath: 'calls.callOutcomeByCompany',
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
  COMPANY_SUMMARY_CHART_FETCH_REQUESTED,
  COMPANY_SUMMARY_CHART_FETCH_FAILED,
  COMPANY_SUMMARY_CHART_FETCH_SUCCESS,
]);

const fetchSummaryChart = (params) => {
  const {
    callPath,
    companyId,
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
      companyId,
      endDate,
      startDate,
    },
    shouldFetch,
  });
};

export const fetchCallStrategyChart = (params) => {
  return fetchSummaryChart({
    callPath: 'calls.agg.scriptComplianceByCompany',
    shouldFetch: state => getCallStrategyChart(state).shouldFetch(),
    summaryType: `${CALL_STRATEGY_SUMMARY}Chart`,
    ...params,
  });
};

export const fetchCustomerTalkRatioChart = (params) => {
  return fetchSummaryChart({
    callPath: 'calls.agg.customerTalkRatioByCompany',
    shouldFetch: state => getTalkRatioChart(state).shouldFetch(),
    summaryType: `${CUSTOMER_TALK_RATIO_SUMMARY}Chart`,
    ...params,
  });
};

export const fetchConversationRatioChart = (params) => {
  return fetchSummaryChart({
    callPath: 'calls.agg.conversationRatioByCompany',
    shouldFetch: state => getConversationRatioChart(state).shouldFetch(),
    summaryType: `${CONVERSATION_RATIO_SUMMARY}Chart`,
    ...params,
  });
};

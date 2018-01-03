import Immutable from 'immutable';
import {
  createReducer,
  createStateSelector,
  createThunkReducers,
  getThunkInitialState,
} from '../../../utils/redux/reducers';
import {
  EMPLOYEE_DATE_RANGE_CHANGED,
  EMPLOYEE_SUMMARY_CHART_FETCH_REQUESTED,
  EMPLOYEE_SUMMARY_CHART_FETCH_FAILED,
  EMPLOYEE_SUMMARY_CHART_FETCH_SUCCESS,
  EMPLOYEE_SUMMARY_FETCH_FAILED,
  EMPLOYEE_SUMMARY_FETCH_REQUESTED,
  EMPLOYEE_SUMMARY_FETCH_SUCCESS,
  LOCATION_CHANGED,
} from '../../../actionTypes';
import { EMPLOYEE_PAGE_STATE_KEY } from '../Constants';
import {
  CALL_OUTCOME_SUMMARY,
  CALL_STRATEGY_SUMMARY,
  CONVERSATION_RATIO_SUMMARY,
  CUSTOMER_TALK_RATIO_SUMMARY,
} from '../../../Constants';

export const stateKey = 'summary';

const summaries = [
  CALL_OUTCOME_SUMMARY,
  CALL_STRATEGY_SUMMARY,
  CONVERSATION_RATIO_SUMMARY,
  CUSTOMER_TALK_RATIO_SUMMARY,
];

const summaryCharts = [
  `${CALL_STRATEGY_SUMMARY}Chart`,
  `${CONVERSATION_RATIO_SUMMARY}Chart`,
  `${CUSTOMER_TALK_RATIO_SUMMARY}Chart`,
];

const initialState = [...summaries, ...summaryCharts].reduce((state, summary) => {
  return state.set(summary, Immutable.fromJS(getThunkInitialState()));
}, Immutable.Map());

const [
  fetchFailed,
  fetchRequested,
  fetchSuccess,
  setStale,
] = createThunkReducers();

const summaryFetchFailed = (state, { payload }) => {
  const {
    summaryType,
  } = payload;

  const summaryState = state.get(summaryType);
  return state.set(summaryType, fetchFailed(summaryState, { payload }));
};

const summaryFetchRequested = (state, { payload }) => {
  const {
    summaryType,
  } = payload;

  const summaryState = state.get(summaryType);
  return state.set(summaryType, fetchRequested(summaryState, { payload }));
};

const summaryFetchSuccess = (state, { payload }) => {
  const {
    summaryType,
  } = payload;

  const summaryState = state.get(summaryType);
  return state.set(summaryType, fetchSuccess(summaryState, { payload }));
};

const summarySetStale = (state) => {
  return state.map(thunk => setStale(thunk));
};

export default createReducer(initialState, {
  [EMPLOYEE_DATE_RANGE_CHANGED]: summarySetStale,
  [EMPLOYEE_SUMMARY_CHART_FETCH_FAILED]: summaryFetchFailed,
  [EMPLOYEE_SUMMARY_CHART_FETCH_REQUESTED]: summaryFetchRequested,
  [EMPLOYEE_SUMMARY_CHART_FETCH_SUCCESS]: summaryFetchSuccess,
  [EMPLOYEE_SUMMARY_FETCH_FAILED]: summaryFetchFailed,
  [EMPLOYEE_SUMMARY_FETCH_REQUESTED]: summaryFetchRequested,
  [EMPLOYEE_SUMMARY_FETCH_SUCCESS]: summaryFetchSuccess,
  [LOCATION_CHANGED]: summarySetStale,
});

const summaryReducer = state => state[EMPLOYEE_PAGE_STATE_KEY][stateKey];

export const getCallStrategy = createStateSelector(summaryReducer, CALL_STRATEGY_SUMMARY);
export const getConversationRatio = createStateSelector(summaryReducer, CONVERSATION_RATIO_SUMMARY);
export const getTalkRatio = createStateSelector(summaryReducer, CUSTOMER_TALK_RATIO_SUMMARY);
export const getCallStrategyChart = createStateSelector(summaryReducer, `${CALL_STRATEGY_SUMMARY}Chart`);
export const getConversationRatioChart = createStateSelector(summaryReducer, `${CONVERSATION_RATIO_SUMMARY}Chart`);
export const getTalkRatioChart = createStateSelector(summaryReducer, `${CUSTOMER_TALK_RATIO_SUMMARY}Chart`);
export const getCallOutcome = createStateSelector(summaryReducer, CALL_OUTCOME_SUMMARY);

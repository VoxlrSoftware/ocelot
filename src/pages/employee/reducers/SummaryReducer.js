import Immutable from 'immutable';
import {
  createAndAssociateThunkReducers,
  createReducer,
  createStateSelector,
  getThunkInitialState,
} from '../../../utils/redux/reducers';
import {
  EMPLOYEE_DATE_RANGE_CHANGED,
  EMPLOYEE_SUMMARY_AVERAGES_REQUESTED,
  EMPLOYEE_SUMMARY_AVERAGES_RECEIVED,
  EMPLOYEE_SUMMARY_AVERAGES_FAILED,
  EMPLOYEE_SUMMARY_OUTCOMES_RECEIVED,
  EMPLOYEE_SUMMARY_OUTCOMES_REQUESTED,
  EMPLOYEE_SUMMARY_OUTCOMES_FAILED,
  EMPLOYEE_SUMMARY_ROLLUPS_REQUESTED,
  EMPLOYEE_SUMMARY_ROLLUPS_RECEIVED,
  EMPLOYEE_SUMMARY_ROLLUPS_FAILED,
  LOCATION_CHANGED,
} from '../../../actionTypes';
import { EMPLOYEE_PAGE_STATE_KEY } from '../Constants';

export const stateKey = 'summary';
const initialState = Immutable.fromJS({
  averages: getThunkInitialState(),
  outcomes: getThunkInitialState(),
  rollups: getThunkInitialState(),
});
const averagesReducers = createAndAssociateThunkReducers('averages', [
  EMPLOYEE_SUMMARY_AVERAGES_FAILED,
  EMPLOYEE_SUMMARY_AVERAGES_REQUESTED,
  EMPLOYEE_SUMMARY_AVERAGES_RECEIVED,
]);

const outcomeReducers = createAndAssociateThunkReducers('outcomes', [
  EMPLOYEE_SUMMARY_OUTCOMES_FAILED,
  EMPLOYEE_SUMMARY_OUTCOMES_REQUESTED,
  EMPLOYEE_SUMMARY_OUTCOMES_RECEIVED,
]);

const rollupsReducers = createAndAssociateThunkReducers('rollups', [
  EMPLOYEE_SUMMARY_ROLLUPS_FAILED,
  EMPLOYEE_SUMMARY_ROLLUPS_REQUESTED,
  EMPLOYEE_SUMMARY_ROLLUPS_RECEIVED,
]);

export default createReducer(initialState, {
  [EMPLOYEE_DATE_RANGE_CHANGED]: () => initialState,
  [LOCATION_CHANGED]: () => initialState,
  ...averagesReducers,
  ...outcomeReducers,
  ...rollupsReducers,
});

const summaryReducer = state => state[EMPLOYEE_PAGE_STATE_KEY][stateKey];

export const getAverages = createStateSelector(summaryReducer, 'averages');
export const getOutcomes = createStateSelector(summaryReducer, 'outcomes');
export const getRollups = createStateSelector(summaryReducer, 'rollups');

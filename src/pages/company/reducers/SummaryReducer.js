import Immutable from 'immutable';
import {
  createAndAssociateThunkReducers,
  createReducer,
  createStateSelector,
  getThunkInitialState,
} from '../../../utils/redux/reducers';
import {
  COMPANY_SUMMARY_AVERAGES_REQUESTED,
  COMPANY_SUMMARY_AVERAGES_RECEIVED,
  COMPANY_SUMMARY_AVERAGES_FAILED,
  COMPANY_SUMMARY_ROLLUPS_REQUESTED,
  COMPANY_SUMMARY_ROLLUPS_RECEIVED,
  COMPANY_SUMMARY_ROLLUPS_FAILED,
} from '../../../actionTypes';
import { COMPANY_PAGE_STATE_KEY } from '../Constants';

export const stateKey = 'summary';
const initialState = Immutable.fromJS({
  averages: getThunkInitialState,
  rollups: getThunkInitialState,
});

const averagesReducers = createAndAssociateThunkReducers('averages', [
  COMPANY_SUMMARY_AVERAGES_FAILED,
  COMPANY_SUMMARY_AVERAGES_REQUESTED,
  COMPANY_SUMMARY_AVERAGES_RECEIVED,
]);

const rollupsReducers = createAndAssociateThunkReducers('rollups', [
  COMPANY_SUMMARY_ROLLUPS_FAILED,
  COMPANY_SUMMARY_ROLLUPS_REQUESTED,
  COMPANY_SUMMARY_ROLLUPS_RECEIVED,
]);

export default createReducer(initialState, {
  ...averagesReducers,
  ...rollupsReducers,
});

const summaryReducer = state => state[COMPANY_PAGE_STATE_KEY][stateKey];

export const getAverages = createStateSelector(summaryReducer, 'averages');
export const getRollups = createStateSelector(summaryReducer, 'rollups');

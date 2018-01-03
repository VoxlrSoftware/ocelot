import Immutable from 'immutable';
import {
  createReducer,
  createStateSelector,
} from '../../../utils/redux/reducers';
import {
  CALL_STRATEGY_PAGE_STATE_KEY,
} from '../Constants';
import {
  COMPANY_UPDATE_FAILED,
  COMPANY_UPDATE_REQUESTED,
  COMPANY_UPDATE_SUCCESS,
} from '../../../actionTypes';

export const stateKey = 'createCall';

const initialState = Immutable.fromJS({
  isSaving: false,
});

export default createReducer(initialState, {
  [COMPANY_UPDATE_FAILED]: state => state.set('isSaving', false),
  [COMPANY_UPDATE_REQUESTED]: state => state.set('isSaving', true),
  [COMPANY_UPDATE_SUCCESS]: state => state.set('isSaving', false),
});

const callStrategyReducer = state => state[CALL_STRATEGY_PAGE_STATE_KEY][stateKey];

export const getIsSaving = createStateSelector(callStrategyReducer, 'isSaving');

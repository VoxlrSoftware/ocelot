import { combineReducers } from 'redux';
import callStrategyReducer, { stateKey as CALL_STRATEGY_STATE_KEY } from './CallStrategyReducer';

import { CALL_STRATEGY_PAGE_STATE_KEY } from '../Constants';

export const stateKey = CALL_STRATEGY_PAGE_STATE_KEY;

export default combineReducers({
  [CALL_STRATEGY_STATE_KEY]: callStrategyReducer,
});

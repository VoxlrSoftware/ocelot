import { combineReducers } from 'redux';
import callReducer, { stateKey as CALL_STATE_KEY } from './CallReducer';

import { CALL_PAGE_STATE_KEY } from '../Constants';

export const stateKey = CALL_PAGE_STATE_KEY;

export default combineReducers({
  [CALL_STATE_KEY]: callReducer,
});

import {
  createReducer,
  createThunkSelectors,
  createThunkReducers,
  getThunkInitialState,
} from '../../../utils/redux/reducers';
import {
  CALL_FETCH_FAILED,
  CALL_FETCH_REQUESTED,
  CALL_FETCH_SUCCESS,
  LOCATION_CHANGED,
} from '../../../actionTypes';
import {
  CALL_PAGE_STATE_KEY,
} from '../Constants';

export const stateKey = 'call';

const initialState = getThunkInitialState();

const [
  callFetchFailed,
  callFetchRequested,
  callFetchSuccess,
  callFetchSetStale,
] = createThunkReducers();

export default createReducer(initialState, {
  [CALL_FETCH_FAILED]: callFetchFailed,
  [CALL_FETCH_REQUESTED]: callFetchRequested,
  [CALL_FETCH_SUCCESS]: callFetchSuccess,
  [LOCATION_CHANGED]: callFetchSetStale,
});

const callReducer = state => state[CALL_PAGE_STATE_KEY][stateKey];

export const getCallThunk = callReducer;

export const [
  getCall,
  getIsFetching,
  getIsStale,
] = createThunkSelectors(callReducer);

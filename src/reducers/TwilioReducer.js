import Immutable from 'immutable';
import {
  createReducer,
  createStateSelector,
  createThunkReducers,
  getThunkInitialState,
} from '../utils/redux/reducers';
import {
  TWILIO_CALL_COMPLETE,
  TWILIO_CONNECTION_CLOSED,
  TWILIO_CONNECTION_FAILED,
  TWILIO_CONNECTION_REQUESTED,
  TWILIO_CONNECTION_STALE,
  TWILIO_CONNECTION_SUCCESS,
  TWILIO_CONNECTION_UPDATED,
  TWILIO_SETUP_REQUESTED,
  TWILIO_SETUP_SUCCESS,
} from '../actionTypes';

export const stateKey = 'twilio';

const initialState = Immutable.fromJS({
  callActive: false,
  callComplete: false,
  connection: getThunkInitialState(),
  setup: getThunkInitialState(),
  updateTrigger: null,
});

const [
  onTwilioConnectionFailed,
  onTwilioConnectionRequested,
  onTwilioConnectionSuccess,
] = createThunkReducers('connection');

const setTwilioConnection = (state, { payload }) => {
  const newState = state.merge({
    callActive: true,
    callComplete: false,
    updateTrigger: Date.now(),
  });

  return onTwilioConnectionSuccess(newState, { payload });
};

const onTwilioConnectionClosed = (state) => {
  return state.merge({
    callActive: false,
    callComplete: true,
  });
};

const [
  ,
  onTwilioSetupRequested,
  onTwilioSetupSuccess,
] = createThunkReducers('setup');

const setTwilioCallComplete = state => state.merge({
  callComplete: false,
  connection: getThunkInitialState(),
  updateTrigger: null,
});

const setTwilioConnectionStale = () => initialState;

export default createReducer(initialState, {
  [TWILIO_CALL_COMPLETE]: setTwilioCallComplete,
  [TWILIO_CONNECTION_CLOSED]: onTwilioConnectionClosed,
  [TWILIO_CONNECTION_FAILED]: onTwilioConnectionFailed,
  [TWILIO_CONNECTION_REQUESTED]: onTwilioConnectionRequested,
  [TWILIO_CONNECTION_STALE]: setTwilioConnectionStale,
  [TWILIO_CONNECTION_SUCCESS]: setTwilioConnection,
  [TWILIO_CONNECTION_UPDATED]: setTwilioConnection,
  [TWILIO_SETUP_REQUESTED]: onTwilioSetupRequested,
  [TWILIO_SETUP_SUCCESS]: onTwilioSetupSuccess,
});

const getTwilioState = state => state[stateKey];

export const getTwilioConnectionState = createStateSelector(getTwilioState, 'connection');
export const getTwilioSetupState = createStateSelector(getTwilioState, 'setup');
export const getTwilioConnectionHeartbeat = createStateSelector(getTwilioState, 'updateTrigger');
export const getTwilioCallComplete = createStateSelector(getTwilioState, 'callComplete');
export const getTwilioCallActive = createStateSelector(getTwilioState, 'callActive');

export const getTwilioConnection = createStateSelector(getTwilioConnectionState, 'data');
export const getTwilioIsReady = createStateSelector(getTwilioSetupState, 'data');

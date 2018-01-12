import Immutable from 'immutable';
import {
  createReducer,
  createStateSelector,
  createThunkReducers,
  getThunkInitialState,
} from '../utils/redux/reducers';
import {
  CREATE_CALL_SET_PHONE_NUMBER_CANCELED,
  CREATE_CALL_SET_PHONE_NUMBER_REQUESTED,
  TWILIO_CLIENT_TOKEN_FAILED,
  TWILIO_CLIENT_TOKEN_RECEVIED,
  TWILIO_CLIENT_TOKEN_REQUESTED,
  VALIDATE_PHONE_NUMBER_FAILED,
  VALIDATE_PHONE_NUMBER_REQUEST_RECEIVED,
  VALIDATE_PHONE_NUMBER_REQUESTED,
  VALIDATE_PHONE_NUMBER_SUCCESS,
  VERIFY_PHONE_NUMBER_FAILED,
  VERIFY_PHONE_NUMBER_RECEIVED,
  VERIFY_PHONE_NUMBER_REQUESTED,
} from '../actionTypes';

export const stateKey = 'phone';

const initialState = Immutable.fromJS({
  client: {
    token: getThunkInitialState(),
  },
  showSetPhoneModal: false,
  validation: getThunkInitialState(),
  verification: getThunkInitialState(),
});

const [
  phoneValidationFailed,
  phoneValidationRequested,
  phoneValidationReceived,
] = createThunkReducers('validation');

const [
  phoneVerificationFailed,
  phoneVerificationRequested,
  phoneVerificationReceived,
] = createThunkReducers('verification');

const onVerifyReceived = (state, { payload }) => {
  const {
    data,
  } = payload;

  let newState = state;

  if (data.hasValidated) {
    newState = newState.merge({
      showSetPhoneModal: false,
    });
  }

  return phoneVerificationReceived(newState, { payload });
};

const [
  twilioClientTokenFailed,
  twilioClientTokenRequested,
  twilioClientTokenReceived,
] = createThunkReducers('client', 'token');

const setPhoneNumberRequested = (state) => {
  return state.merge({
    showSetPhoneModal: true,
    validation: getThunkInitialState(),
    verification: getThunkInitialState(),
  });
};

const setPhoneNumberReset = (state) => {
  return state.merge({
    showSetPhoneModal: false,
    validation: getThunkInitialState(),
    verification: getThunkInitialState(),
  });
};

export default createReducer(initialState, {
  [CREATE_CALL_SET_PHONE_NUMBER_CANCELED]: setPhoneNumberReset,
  [CREATE_CALL_SET_PHONE_NUMBER_REQUESTED]: setPhoneNumberRequested,
  [TWILIO_CLIENT_TOKEN_FAILED]: twilioClientTokenFailed,
  [TWILIO_CLIENT_TOKEN_RECEVIED]: twilioClientTokenReceived,
  [TWILIO_CLIENT_TOKEN_REQUESTED]: twilioClientTokenRequested,
  [VALIDATE_PHONE_NUMBER_FAILED]: phoneValidationFailed,
  [VALIDATE_PHONE_NUMBER_REQUESTED]: phoneValidationRequested,
  [VALIDATE_PHONE_NUMBER_REQUEST_RECEIVED]: phoneValidationReceived,
  [VALIDATE_PHONE_NUMBER_SUCCESS]: setPhoneNumberReset,
  [VERIFY_PHONE_NUMBER_FAILED]: phoneVerificationFailed,
  [VERIFY_PHONE_NUMBER_RECEIVED]: onVerifyReceived,
  [VERIFY_PHONE_NUMBER_REQUESTED]: phoneVerificationRequested,
});

const phoneReducer = state => state[stateKey];

export const getPhoneValidation = createStateSelector(phoneReducer, 'validation');
export const getPhoneVerification = createStateSelector(phoneReducer, 'verification');
export const getTwilioClient = createStateSelector(phoneReducer, 'client');
export const getTwilioToken = createStateSelector(getTwilioClient, 'token');
export const getShowSetPhoneModal = createStateSelector(phoneReducer, 'showSetPhoneModal');

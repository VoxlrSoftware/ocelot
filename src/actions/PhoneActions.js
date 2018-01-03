import {
  createMeteorCallAction,
  createAction,
  createMultipleActions,
} from '../utils/redux/actions';
import {
  CREATE_CALL_SET_PHONE_NUMBER_CANCELED,
  CREATE_CALL_SET_PHONE_NUMBER_REQUESTED,
  TWILIO_CLIENT_TOKEN_FAILED,
  TWILIO_CLIENT_TOKEN_RECEVIED,
  TWILIO_CLIENT_TOKEN_REQUESTED,
  VALIDATE_PHONE_NUMBER_FAILED,
  VALIDATE_PHONE_NUMBER_REQUESTED,
  VALIDATE_PHONE_NUMBER_REQUEST_RECEIVED,
  VALIDATE_PHONE_NUMBER_SUCCESS,
  VERIFY_PHONE_NUMBER_REQUESTED,
  VERIFY_PHONE_NUMBER_FAILED,
  VERIFY_PHONE_NUMBER_RECEIVED,
} from '../actionTypes';

import {
  getPhoneValidation,
  getPhoneVerification,
  getTwilioToken,
} from '../reducers/PhoneReducer';

export const requestSetPhoneNumber = createAction(CREATE_CALL_SET_PHONE_NUMBER_REQUESTED);
export const cancelSetPhoneNumber = createAction(CREATE_CALL_SET_PHONE_NUMBER_CANCELED);


const [
  onPhoneValidateRequested,
  onPhoneValidateFailed,
  onPhoneValidateReceived,
  onPhoneValidateSuccess,
] = createMultipleActions([
  VALIDATE_PHONE_NUMBER_REQUESTED,
  VALIDATE_PHONE_NUMBER_FAILED,
  VALIDATE_PHONE_NUMBER_REQUEST_RECEIVED,
  VALIDATE_PHONE_NUMBER_SUCCESS,
]);

const [
  onPhoneVerificationRequested,
  onPhoneVerificationFailed,
  onPhoneVerificationReceived,
] = createMultipleActions([
  VERIFY_PHONE_NUMBER_REQUESTED,
  VERIFY_PHONE_NUMBER_FAILED,
  VERIFY_PHONE_NUMBER_RECEIVED,
]);

const [
  onTwilioTokenRequested,
  onTwilioTokenFailed,
  onTwilioTokenReceived,
] = createMultipleActions([
  TWILIO_CLIENT_TOKEN_REQUESTED,
  TWILIO_CLIENT_TOKEN_FAILED,
  TWILIO_CLIENT_TOKEN_RECEVIED,
]);

export const getTwilioClientToken = () => {
  return createMeteorCallAction({
    callPath: 'getToken',
    onFail: error => onTwilioTokenFailed({
      error,
    }),
    onRequest: onTwilioTokenRequested(),
    onSuccess: data => onTwilioTokenReceived({ data }),
    params: {},
    shouldFetch: state => getTwilioToken(state).shouldFetch(),
  });
};

export const checkForValidationResult = (config) => {
  const {
    onNumberSet,
    type,
  } = config;

  const callPath = type === 'account' ?
    'account.checkVerification' :
    'company.checkVerification';

  return createMeteorCallAction({
    callPath,
    onFail: error => onPhoneVerificationFailed({
      error,
    }),
    onRequest: onPhoneVerificationRequested(),
    onSuccess: (data) => {
      if (data.hasVerified) {
        onNumberSet();
      }

      return onPhoneVerificationReceived({ data });
    },
    params: {},
    shouldFetch: state => !getPhoneVerification(state).isFetching,
  });
};

export const validatePhoneNumber = (config) => {
  const {
    extension,
    onNumberSet,
    phoneNumber,
    type,
  } = config;

  const callPath = type === 'account' ?
    'account.validatePhoneNumber' :
    'company.validatePhoneNumber';

  return createMeteorCallAction({
    callPath,
    onFail: error => onPhoneValidateFailed({
      error,
    }),
    onRequest: onPhoneValidateRequested(),
    onSuccess: (data) => {
      if (data.error) {
        return onPhoneValidateFailed({ error: data.error });
      }

      if (data.isValidated) {
        onNumberSet();
        return onPhoneValidateSuccess({ data });
      }

      return onPhoneValidateReceived({ data });
    },
    params: {
      extension,
      phoneNumber,
    },
    shouldFetch: state => !getPhoneValidation(state).isFetching,
  });
};

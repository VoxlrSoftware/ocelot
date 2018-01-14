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
import {
  getTwilioConnectionState,
  getTwilioIsReady,
  getTwilioSetupState,
} from '../reducers/TwilioReducer';
import { Twilio } from '../utils/Twilio';
import { DEBUG_MODE } from '../Constants';
import { ALERT_TYPE, DEFAULT_TIMEOUT } from '../components/alert/Alert';
import { createFailureNotification } from '../utils/notification';

const offlineHandler = (dispatch) => {
  dispatch({
    type: TWILIO_CONNECTION_STALE,
  });
};

const readyHandler = (dispatch) => {
  dispatch({
    payload: {
      data: true,
    },
    type: TWILIO_SETUP_SUCCESS,
  });
};

const updateConnection = (connection) => {
  return {
    payload: {
      data: connection,
    },
    type: TWILIO_CONNECTION_UPDATED,
  };
};

const acceptHandler = (dispatch, connection) => {
  dispatch(updateConnection(connection));
};

const muteHandler = (dispatch, mute, connection) => {
  dispatch(updateConnection(connection));
};

const connectHandler = (dispatch, connection) => {
  connection.accept(acceptHandler.bind(this, dispatch));
  connection.mute(muteHandler.bind(this, dispatch));

  dispatch({
    notification: {
      autoCloseTimeout: DEFAULT_TIMEOUT,
      header: 'Call Connected',
      type: ALERT_TYPE.INFO,
    },
    payload: {
      data: connection,
    },
    type: TWILIO_CONNECTION_SUCCESS,
  });
};

const disconnectHandler = (dispatch) => {
  dispatch({
    notification: {
      autoCloseTimeout: DEFAULT_TIMEOUT,
      header: 'Call Disconnected',
      type: ALERT_TYPE.INFO,
    },
    type: TWILIO_CONNECTION_CLOSED,
  });
};

const errorHandler = (dispatch, error) => {
  dispatch({
    notification: createFailureNotification({
      error,
      header: 'Call Error',
      message: 'An error occurred during the call',
    }),
    payload: {
      error,
    },
    type: TWILIO_CONNECTION_FAILED,
  });
};


export const setupTwilio = (config) => {
  const {
    twilioToken,
  } = config;

  return (dispatch, getState) => {
    const setupState = getTwilioSetupState(getState());

    if (setupState.isFetching || setupState.data) {
      return;
    }

    Twilio().Device.offline(offlineHandler.bind(this, dispatch));
    Twilio().Device.ready(readyHandler.bind(this, dispatch));
    Twilio().Device.setup(twilioToken, { debug: DEBUG_MODE });
    dispatch({
      type: TWILIO_SETUP_REQUESTED,
    });
  };
};

export const connectToVoice = (config) => {
  const {
    accountId,
    callerId,
    companyId,
    companyName,
    customerNumber,
    selectedTemplateName,
  } = config;

  return (dispatch, getState) => {
    const isReady = getTwilioIsReady(getState());
    const twilioConnectionState = getTwilioConnectionState(getState());

    if (!isReady || twilioConnectionState.isFetching || twilioConnectionState.data) {
      return;
    }

    Twilio().Device.connect(connectHandler.bind(this, dispatch));
    Twilio().Device.error(errorHandler.bind(this, dispatch));
    Twilio().Device.disconnect(disconnectHandler.bind(this, dispatch));
    Twilio().Device.connect({
      callerId,
      companyId,
      companyName,
      customerNumber,
      selectedTemplateName,
      userID: accountId,
    });

    dispatch({
      type: TWILIO_CONNECTION_REQUESTED,
    });
  };
};

const executeOnConnection = (state, execute) => {
  const twilioConnectionState = getTwilioConnectionState(state);

  if (!twilioConnectionState.data) {
    return;
  }

  const connection = twilioConnectionState.data;

  if (connection.status() !== 'closed') {
    execute(connection);
  }
};

export const disconnectToVoice = () => {
  return (dispatch, getState) => {
    executeOnConnection(getState(), (connection) => {
      connection.disconnect();
    });
  };
};

export const muteConnection = () => {
  return (dispatch, getState) => {
    executeOnConnection(getState(), (connection) => {
      connection.mute(true);
    });
  };
};

export const unmuteConnection = () => {
  return (dispatch, getState) => {
    executeOnConnection(getState(), (connection) => {
      connection.mute(false);
    });
  };
};

export const sendDigit = (digit) => {
  return (dispatch, getState) => {
    executeOnConnection(getState(), (connection) => {
      connection.sendDigits(digit);
    });
  };
};

export const completeCall = () => {
  return {
    type: TWILIO_CALL_COMPLETE,
  };
};

import { doGet, makeRequest } from '../MarmosetAPI';
import { getAuth } from '../../reducers/AccountReducer';

const ActionException = message => ({
  message,
  type: 'ActionException',
});

export const createMeteorCallAction = (config) => {
  return (dispatch, getState) => {
    const {
      shouldFetch,
      callPath,
      params,
      onRequest,
      onSuccess,
      onFail,
    } = config;

    if (shouldFetch(getState())) {
      dispatch(onRequest);

      dispatch(onFail('', getState()));
      // Meteor.call(callPath, params, (err, data) => {
      //   if (err) {
      //     dispatch(onFail(err, getState()));
      //   } else {
      //     dispatch(onSuccess(data, getState()));
      //   }
      // });
    }
  };
};

export const createAction =
  type => (payload, meta = {}) => { return { payload: payload || {}, type, ...meta }; };

export const createMultipleActions = (types) => {
  return types.map(type => createAction(type));
};

const extractError = (response) => {
  const retVal = {};

  if (response.error && response.error.apierror) {
    const {
      error: {
        apierror,
      },
    } = response;
    retVal.message = apierror.message;
    retVal.error = {
      ...apierror,
      statusCode: response.statusCode,
    };
  } else {
    retVal.message = 'Unknown error occurred.';
    retVal.error = {
      ...response.error,
      statusCode: response.statusCode,
    };
  }

  return retVal;
};

const getAction = (action) => {
  if (typeof action === 'function' || typeof action === 'object') {
    return action;
  }

  if (typeof action === 'string') {
    return createAction(action)();
  }

  throw ActionException(`Action must be a string or a function ${action}`);
};

const execAction = (config) => {
  return (dispatch, getState) => {
    const {
      action,
      shouldFetch,
      onRequest,
      onSuccess,
      onFail,
      ...actionParams
    } = config;

    if (shouldFetch(getState())) {
      dispatch(getAction(onRequest));

      const auth = getAuth(getState());
      action({
        auth,
        ...actionParams,
      }).then((response) => {
        dispatch(getAction(onSuccess)(response, getState()));
      }, (response) => {
        const error = extractError(response);
        dispatch(getAction(onFail)(error, getState()));
      });
    }
  };
};

export const createFetchAction = (config) => {
  return execAction({
    action: ({
      auth,
      path,
      pagination,
      params = {},
    }) => {
      return doGet({
        auth,
        pagination,
        path,
        qs: params,
      });
    },
    ...config,
  });
};

export const createMutateAction = (config) => {
  return execAction({
    action: ({
      auth,
      method = 'PUT',
      params,
      path,
    }) => {
      return makeRequest({
        auth,
        body: params,
        method,
        path,
      });
    },
    ...config,
  });
};


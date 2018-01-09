import { doGet, makeRequest } from '../MarmosetAPI';
import { getAuth } from '../../reducers/AccountReducer';

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
      dispatch(onRequest);

      const auth = getAuth(getState());
      action({
        auth,
        ...actionParams,
      }).then((response) => {
        dispatch(onSuccess(response, getState()));
      }, (error) => {
        dispatch(onFail(error, getState()));
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

export const createAction =
  type => (payload, meta = {}) => { return { payload: payload || {}, type, ...meta }; };

export const createMultipleActions = (types) => {
  return types.map(type => createAction(type));
};

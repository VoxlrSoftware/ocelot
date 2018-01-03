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

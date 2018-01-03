import {
  createMeteorCallAction,
  createMultipleActions,
} from '../utils/redux/actions';
import {
  CALL_UPDATE_FAILED,
  CALL_UPDATE_REQUESTED,
  CALL_UPDATE_SUCCESS,
} from '../actionTypes';

const [
  onCallUpdateRequested,
  onCallUpdateFailed,
  onCallUpdateSuccess,
] = createMultipleActions([
  CALL_UPDATE_REQUESTED,
  CALL_UPDATE_FAILED,
  CALL_UPDATE_SUCCESS,
]);

export const updateCallByCallSid = (config) => {
  const {
    callSid,
    newValues,
    onSuccess,
  } = config;

  return createMeteorCallAction({
    callPath: 'calls.updateOneByCallSid',
    onFail: error => onCallUpdateFailed({
      error,
    }),
    onRequest: onCallUpdateRequested({ callSid }),
    onSuccess: (data) => {
      if (data.error) {
        return onCallUpdateFailed({
          error: data.error,
        });
      }

      onSuccess();
      return onCallUpdateSuccess({ callSid, data });
    },
    params: {
      callSid,
      newValues,
    },
    shouldFetch: () => true,
  });
};

import {
  createMeteorCallAction,
  createMutateAction,
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
  } = config;

  return createMutateAction({
    onFail: error => onCallUpdateFailed({
      error,
    }),
    onRequest: onCallUpdateRequested({ callSid }),
    onSuccess: (data) => {
      return onCallUpdateSuccess({ callSid, data });
    },
    params: {
      callSid,
      ...newValues,
    },
    path: 'call',
    shouldFetch: () => true,
  });
};

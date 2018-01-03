import {
  createMeteorCallAction,
  createMultipleActions,
} from '../../../utils/redux/actions';
import {
  CALL_FETCH_FAILED,
  CALL_FETCH_REQUESTED,
  CALL_FETCH_SUCCESS,
} from '../../../actionTypes';
import {
  getCallThunk,
} from '../reducers/CallReducer';

const [
  onCallFetchRequested,
  onCallFetchFetchFailed,
  onCallFetchFetchSuccess,
] = createMultipleActions([
  CALL_FETCH_REQUESTED,
  CALL_FETCH_FAILED,
  CALL_FETCH_SUCCESS,
]);

export const fetchCall = (callId) => {
  return createMeteorCallAction({
    callPath: 'calls.findOne',
    onFail: error => onCallFetchFetchFailed({
      error,
    }),
    onRequest: onCallFetchRequested(),
    onSuccess: (data) => {
      if (typeof data === 'undefined' || !data.length) {
        return onCallFetchFetchFailed();
      }

      return onCallFetchFetchSuccess({ data: data[0] });
    },
    params: {
      callId,
    },
    shouldFetch: state => getCallThunk(state).shouldFetch(),
  });
};

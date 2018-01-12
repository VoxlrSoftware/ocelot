import {
  createAction,
  createFetchAction,
  createMeteorCallAction,
  createMultipleActions,
} from '../utils/redux/actions';
import {
  ACCOUNT_FETCH_FAILED,
  ACCOUNT_FETCH_REQUESTED,
  ACCOUNT_FETCH_SUCCESS,
  ACCOUNT_SET_STALE,
} from '../actionTypes';
import {
  getAccountThunk,
  getIsLoggedIn,
} from '../reducers/AccountReducer';
import { createFailureNotification } from '../utils/notification';

export const setAccountStale = createAction(ACCOUNT_SET_STALE);

const [
  onAccountFetchRequested,
  onAccountFetchFailed,
  onAccountFetchSuccess,
] = createMultipleActions([
  ACCOUNT_FETCH_REQUESTED,
  ACCOUNT_FETCH_FAILED,
  ACCOUNT_FETCH_SUCCESS,
]);

export const fetchAccount = (accountId) => {
  return createFetchAction({
    onFail: error => onAccountFetchFailed({
      accountId,
      error,
    }, {
      notification: createFailureNotification({
        error,
        header: 'Unable to fetch account',
        message: 'An error occurred while trying to fetch your account information. Please reload and try again.',
      }),
    }),
    onRequest: onAccountFetchRequested({ accountId }),
    onSuccess: (data) => {
      return onAccountFetchSuccess({ accountId, data });
    },
    path: 'account',
    shouldFetch: state => getIsLoggedIn(state) && getAccountThunk(state).shouldFetch(),
  });
};

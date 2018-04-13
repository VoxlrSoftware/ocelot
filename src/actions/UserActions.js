import {
  createMeteorCallAction,
  createMutateAction,
  createMultipleActions,
  createFetchAction,
} from '../utils/redux/actions';
import {
  USER_FETCH_FAILED,
  USER_FETCH_REQUESTED,
  USER_FETCH_SUCCESS,
  USER_CREATE_FAILED,
  USER_CREATE_REQUESTED,
  USER_CREATE_SUCCESS,
} from '../actionTypes';
import {
  getUserStateSelector,
  getUserCreate,
} from '../reducers/UserReducer';

const [
  onUserFetchRequested,
  onUserFetchFailed,
  onUserFetchSuccess,
] = createMultipleActions([
  USER_FETCH_REQUESTED,
  USER_FETCH_FAILED,
  USER_FETCH_SUCCESS,
]);

const [
  onUserCreateRequested,
  onUserCreateFailed,
  onUserCreateSuccess,
] = createMultipleActions([
  USER_CREATE_REQUESTED,
  USER_CREATE_FAILED,
  USER_CREATE_SUCCESS,
]);

export const fetchUser = (userId) => {
  return createFetchAction({
    onFail: error => onUserFetchFailed({
      error,
    }),
    onRequest: onUserFetchRequested({ userId }),
    onSuccess: (data) => {
      if (typeof data === 'undefined') {
        return onUserFetchFailed({ userId });
      }

      return onUserFetchSuccess({ data, userId });
    },
    path: `user/${userId}`,
    shouldFetch: state => getUserStateSelector(state, userId).shouldFetch(),
  });
};

export const createUser = (config) => {
  const {
    email,
    firstName,
    lastName,
    onSuccess = () => {},
  } = config;

  return createMutateAction({
    method: 'POST',
    onFail: error => onUserCreateFailed({
      error,
    }),
    onRequest: onUserCreateRequested(),
    onSuccess: (data) => {
      onSuccess();
      return onUserCreateSuccess({ data });
    },
    params: {
      email,
      firstName,
      lastName,
    },
    path: 'user',
    shouldFetch: state => getUserCreate(state).shouldFetch(),
  });
};

import Immutable from 'immutable';
import { createSelector } from 'reselect';
import {
  createStateSelector,
  createReducer,
  createThunkReducers,
  getThunkInitialState,
} from '../utils/redux/reducers';
import {
  USER_CREATE_FAILED,
  USER_CREATE_REQUESTED,
  USER_CREATE_SUCCESS,
  USER_FETCH_FAILED,
  USER_FETCH_REQUESTED,
  USER_FETCH_SUCCESS,
} from '../actionTypes';

export const stateKey = 'users';

const initialState = Immutable.fromJS({
  create: getThunkInitialState(),
  users: {},
});

const [
  createFailed,
  createRequested,
  createSuccess,
] = createThunkReducers('create');

const [
  fetchFailed,
  fetchRequested,
  fetchSuccess,
] = createThunkReducers();

const getUserState = (state, userId) => {
  return state.getIn(['users', userId]) || getThunkInitialState();
};

const userFetchFailed = (state, { payload }) => {
  const {
    userId,
  } = payload;

  return state.setIn(['users', userId], fetchFailed(getUserState(state, userId), { payload }));
};

const userFetchRequested = (state, { payload }) => {
  const {
    userId,
  } = payload;

  return state.setIn(['users', userId], fetchRequested(getUserState(state, userId), { payload }));
};

const userFetchSuccess = (state, { payload }) => {
  const {
    userId,
  } = payload;

  return state.setIn(['users', userId], fetchSuccess(getUserState(state, userId), { payload }));
};

export default createReducer(initialState, {
  [USER_CREATE_FAILED]: createFailed,
  [USER_CREATE_REQUESTED]: createRequested,
  [USER_CREATE_SUCCESS]: createSuccess,
  [USER_FETCH_FAILED]: userFetchFailed,
  [USER_FETCH_REQUESTED]: userFetchRequested,
  [USER_FETCH_SUCCESS]: userFetchSuccess,
});

const usersReducer = state => state[stateKey];

const usersStateReducer = createStateSelector(usersReducer, 'users');

const userStateReducer = (state, userId) => state.get(userId) || getThunkInitialState();

export const getUserStateSelector = createSelector(
  usersStateReducer,
  (state, userId) => userId,
  userStateReducer,
);

export const getUserCreate = createStateSelector(usersReducer, 'create');

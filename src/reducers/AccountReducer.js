import Immutable from 'immutable';
import {
  createReducer,
  createStateSelector,
  createThunkReducers,
  getThunkInitialState,
} from '../utils/redux/reducers';
import localStorage from '../utils/localStorage';
import {
  ACCOUNT_FETCH_FAILED,
  ACCOUNT_FETCH_REQUESTED,
  ACCOUNT_FETCH_SUCCESS,
  ACCOUNT_LOGIN_FAILED,
  ACCOUNT_LOGIN_REQUESTED,
  ACCOUNT_LOGIN_SUCCESS,
  ACCOUNT_LOGOUT_FAILED,
  ACCOUNT_LOGOUT_REQUESTED,
  ACCOUNT_LOGOUT_SUCCESS,
  ACCOUNT_SET_STALE,
} from '../actionTypes';

export const stateKey = 'account';

const initialState = Immutable.fromJS({
  account: getThunkInitialState(),
  auth: JSON.parse(localStorage.getItem('_cred_')),
  isLoggedIn: false,
  isModifyingLogin: false,
  loginError: false,
  logoutError: false,
});

const [
  ,
  accountRequested,
  accountSuccess,
  accountSetStale,
] = createThunkReducers('account');

const accountFetchFailed = (state) => {
  return state.merge(initialState);
};

const accountLoginSuccess = (state, { payload }) => {
  const {
    data: {
      account,
      auth,
    },
  } = payload;

  const newState = state.merge({
    auth,
    isLoggedIn: true,
    isModifyingLogin: false,
  });

  return accountSuccess(newState, { payload: { data: account } });
};

const accountLoginFailed = (state) => {
  return state.merge({
    isLoggedIn: false,
    isModifyingLogin: false,
    loginError: true,
  });
};

const accountLoginRequested = (state) => {
  return state.merge({
    isModifyingLogin: true,
    loginError: false,
  });
};

const accountLogoutRequested = (state) => {
  return state.merge({
    isModifyingLogin: true,
    logoutError: false,
  });
};

const accountLogoutSuccess = (state) => {
  return state.merge(initialState);
};

const accountLogoutFailed = (state) => {
  return state.merge({
    isModifyingLogin: false,
    logoutError: true,
  });
};

export default createReducer(initialState, {
  [ACCOUNT_FETCH_FAILED]: accountFetchFailed,
  [ACCOUNT_FETCH_REQUESTED]: accountRequested,
  [ACCOUNT_FETCH_SUCCESS]: accountSuccess,
  [ACCOUNT_LOGIN_FAILED]: accountLoginFailed,
  [ACCOUNT_LOGIN_REQUESTED]: accountLoginRequested,
  [ACCOUNT_LOGIN_SUCCESS]: accountLoginSuccess,
  [ACCOUNT_LOGOUT_FAILED]: accountLogoutFailed,
  [ACCOUNT_LOGOUT_REQUESTED]: accountLogoutRequested,
  [ACCOUNT_LOGOUT_SUCCESS]: accountLogoutSuccess,
  [ACCOUNT_SET_STALE]: accountSetStale,
});

const accountReducerSelector = state => state[stateKey];

export const getIsLoggedIn = createStateSelector(accountReducerSelector, 'isLoggedIn');
export const getIsModifyingLogin = createStateSelector(accountReducerSelector, 'isModifyingLogin');
export const getLoginError = createStateSelector(accountReducerSelector, 'loginError');
export const getLogoutError = createStateSelector(accountReducerSelector, 'logoutError');
export const getAuth = createStateSelector(accountReducerSelector, 'auth');

export const getAccountThunk = createStateSelector(accountReducerSelector, 'account');
export const getAccount = createStateSelector(getAccountThunk, 'data');
export const getAccountCompanyName = createStateSelector(getAccount, 'profile', 'company');
export const getAccountCompanyId = createStateSelector(getAccount, 'companyId');

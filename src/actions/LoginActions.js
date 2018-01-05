import {
  ACCOUNT_LOGIN_FAILED,
  ACCOUNT_LOGIN_REQUESTED,
  ACCOUNT_LOGIN_SUCCESS,
  // ACCOUNT_LOGOUT_FAILED,
  ACCOUNT_LOGOUT_REQUESTED,
  ACCOUNT_LOGOUT_SUCCESS,
} from '../actionTypes';
import {
  getAuth,
  getIsModifyingLogin,
} from '../reducers/AccountReducer';
import {
  createAccountRequest,
  login,
  makeRequest,
} from '../utils/MarmosetAPI';

const userLoginRequested = {
  type: ACCOUNT_LOGIN_REQUESTED,
};

const userLoginFailed = {
  type: ACCOUNT_LOGIN_FAILED,
};

const userLoginSuccess = (payload) => {
  return {
    payload,
    type: ACCOUNT_LOGIN_SUCCESS,
  };
};

export const userLogin = ({ username, password }) => {
  return (dispatch, getState) => {
    if (getIsModifyingLogin(getState())) {
      return;
    }

    dispatch(userLoginRequested);
    login(username, password).then(({ error, ...response }) => {
      if (error) {
        return dispatch(userLoginFailed);
      }

      return dispatch(userLoginSuccess({ data: response }));
    });
  };
};

const userLogoutRequested = {
  type: ACCOUNT_LOGOUT_REQUESTED,
};

// TODO: finish logout sequence
// const userLogoutFailed = (payload) => {
//   return {
//     payload,
//     type: ACCOUNT_LOGOUT_FAILED,
//   };
// };

const userLogoutSuccess = {
  type: ACCOUNT_LOGOUT_SUCCESS,
};

export const userLogout = () => {
  return (dispatch, getState) => {
    if (getIsModifyingLogin(getState())) {
      return;
    }

    dispatch(userLogoutRequested);
    dispatch(userLogoutSuccess);
    // Meteor.logout((error) => {
    //   if (error) {
    //     return dispatch(userLogoutFailed({ error }));
    //   }

    //   return dispatch(userLogoutSuccess);
    // });
  };
};
// TODO: Fix initialization
export const initializeUser = () => {
  return (dispatch, getState) => {
    const authState = getAuth(getState());

    return new Promise((resolve) => {
      if (!authState) {
        return resolve();
      }

      const auth = authState.toJS();

      makeRequest({ auth, ...createAccountRequest() })
        .then(({ error, ...response }) => {
          if (!error) {
            return dispatch(userLoginSuccess({ data: { account: response, auth } }));
          }

          resolve();
        });
    });
  };
};

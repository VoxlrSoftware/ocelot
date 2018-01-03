import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import {
  getAccount,
  getIsLoggedIn,
  getIsModifyingLogin,
} from '../../reducers/AccountReducer';
import {
  userLogout,
} from '../../actions/LoginActions';
import { clearNotification } from '../../actions/NotificationActions';
import {
  getAlertProps,
  getShowAlert,
} from '../../reducers/NotificationReducer';

import Header from '../components/Header';

const mapStateToProps = (state) => {
  const isLoggedIn = getIsLoggedIn(state);
  const isModifyingLogin = getIsModifyingLogin(state);
  const alertProps = getAlertProps(state);
  const account = getAccount(state);

  return {
    account,
    isLoggedIn,
    isModifyingLogin,
    notification: {
      alertProps: alertProps && alertProps.toJS(),
      show: getShowAlert(state),
    },
  };
};

const mapDispatchToProps = {
  clearNotification,
  push,
  userLogout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);

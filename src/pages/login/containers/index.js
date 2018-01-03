import { connect } from 'react-redux';
import LoginPage from '../components';
import { userLogin } from '../../../actions/LoginActions';
import {
  getIsLoggedIn,
  getIsModifyingLogin,
  getLoginError,
} from '../../../reducers/AccountReducer';

const mapStateToProps = (state) => {
  const isLoggedIn = getIsLoggedIn(state);
  const isLoggingIn = getIsModifyingLogin(state);
  const error = getLoginError(state);

  return {
    error,
    isLoggedIn,
    isLoggingIn,
  };
};

const mapDispatchToProps = {
  login: userLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

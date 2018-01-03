import { connect } from 'react-redux';
import fetch from '../../utils/redux/fetch';

import { initializeUser } from '../../actions/LoginActions';
import { fetchAccount } from '../../actions/AccountActions';
import { pageInitialized } from '../../actions/VoxlrPageActions';
import { getIsPageInitialized } from '../../reducers/VoxlrPageReducer';
import { getAccountThunk } from '../../reducers/AccountReducer';

import VoxlrPage from '../components/VoxlrPage';

const mapStateToProps = (state) => {
  const isPageInitialized = getIsPageInitialized(state);
  const accountState = getAccountThunk(state);

  return {
    accountState,
    isPageInitialized,
  };
};

const mapDispatchToProps = {
  fetchAccount,
  initializeUser,
  pageInitialized,
};

const fetchFn = (props) => {
  const {
    fetchAccount,
  } = props;

  const promises = [
    fetchAccount(),
  ];

  return Promise.all(promises);
};

export default connect(mapStateToProps, mapDispatchToProps)(fetch(fetchFn)(VoxlrPage));

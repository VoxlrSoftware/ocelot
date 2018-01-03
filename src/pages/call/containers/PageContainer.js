import { connect } from 'react-redux';
import fetch from '../../../utils/redux/fetch';
import CallPage from '../components/Page';
import { getAccountCompanyName } from '../../../reducers/AccountReducer';
import {
  getCall,
  getIsFetching,
  getIsStale,
} from '../reducers/CallReducer';
import { getUserStateSelector } from '../../../reducers/UserReducer';
import { fetchUser } from '../../../actions/UserActions';
import { fetchCall } from '../actions/CallActions';

const mapStateToProps = (state) => {
  const companyName = getAccountCompanyName(state);
  const call = getCall(state);
  const employeeState = call && getUserStateSelector(state, call.get('employee'));
  const employee = employeeState && employeeState.data;
  const isLoading = (getIsStale(state) || getIsFetching(state));

  return {
    call,
    companyName,
    employee,
    isLoading,
  };
};

const mapDispatchToProps = {
  fetchCall,
  fetchUser,
};

const fetchFn = (props) => {
  const {
    call,
    fetchCall,
    fetchUser,
    match: {
      params: {
        callId,
      },
    },
  } = props;

  const promises = [
    fetchCall(callId),
  ];

  if (call) {
    promises.push(fetchUser(call.get('employee')));
  }

  return Promise.all(promises);
};

export default connect(mapStateToProps, mapDispatchToProps)(fetch(fetchFn)(CallPage));

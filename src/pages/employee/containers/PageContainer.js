import { connect } from 'react-redux';
import fetch from '../../../utils/redux/fetch';
import EmployeePage from '../components/Page';
import { getAccountCompanyName } from '../../../reducers/AccountReducer';
import {
  getEndDate,
  getStartDate,
} from '../reducers/EmployeeReducer';
import { dateRangeChanged } from '../actions/EmployeeActions';
import { getUserStateSelector } from '../../../reducers/UserReducer';
import { fetchUser } from '../../../actions/UserActions';

const mapStateToProps = (state, props) => {
  const {
    match: {
      params: {
        employeeId,
      },
    },
  } = props;

  const companyName = getAccountCompanyName(state);
  const employeeState = getUserStateSelector(state, employeeId);
  const employee = employeeState.data;
  const isLoading = employeeState.isStale || employeeState.isFetching;
  const startDate = getStartDate(state);
  const endDate = getEndDate(state);

  return {
    companyName,
    employee,
    endDate,
    isLoading,
    startDate,
  };
};

const mapDispatchToProps = {
  dateRangeChanged,
  fetchUser,
};

const fetchFn = (props) => {
  const {
    match: {
      params: {
        employeeId,
      },
    },
    fetchUser,
  } = props;

  const promises = [
    fetchUser(employeeId),
  ];

  return Promise.all(promises);
};

export default connect(mapStateToProps, mapDispatchToProps)(fetch(fetchFn)(EmployeePage));

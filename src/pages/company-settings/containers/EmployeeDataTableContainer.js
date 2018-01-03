import { connect } from 'react-redux';
import fetch from '../../../utils/redux/fetch';

import EmployeeDataTable from '../components/EmployeeDataTable';

import {
  getEmployeeList,
  getIsStale,
  getIsFetching,
  getPagination,
  getTotalCount,
} from '../reducers/EmployeeListReducer';
import {
  changePagination,
  changeSort,
  fetchEmployeeList,
} from '../actions/EmployeeListActions';

const mapStateToProps = (state) => {
  const employeeList = getEmployeeList(state);
  const totalCount = getTotalCount(state);
  const pagination = getPagination(state);
  const isStale = getIsStale(state);
  const isFetching = getIsFetching(state);

  return {
    employeeList,
    isFetching,
    isStale,
    pagination,
    totalCount,
  };
};

const mapDispatchToProps = {
  changePagination,
  changeSort,
  fetchEmployeeList,
};

const fetchFn = (props) => {
  const {
    companyId,
    fetchEmployeeList,
    pagination,
  } = props;

  const promises = [];

  if (companyId) {
    promises.push(fetchEmployeeList({ companyId, pagination }));
  }

  return Promise.all(promises);
};

export default connect(mapStateToProps, mapDispatchToProps)(fetch(fetchFn)(EmployeeDataTable));

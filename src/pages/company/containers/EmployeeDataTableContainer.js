import { connect } from 'react-redux';
import fetch from '../../../utils/redux/fetch';

import EmployeeDataTable from '../components/EmployeeDataTable';

import {
  getEmployeeList,
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
  const isFetching = getIsFetching(state);

  return {
    employeeList,
    isFetching,
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
    endDate,
    fetchEmployeeList,
    pagination,
    startDate,
  } = props;

  const promises = [
    fetchEmployeeList({ companyId, endDate, pagination, startDate }),
  ];

  return Promise.all(promises);
};

export default connect(mapStateToProps, mapDispatchToProps)(fetch(fetchFn)(EmployeeDataTable));

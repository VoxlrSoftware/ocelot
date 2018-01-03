import { connect } from 'react-redux';
import fetch from '../../../utils/redux/fetch';

import CallDataTable from '../components/CallDataTable';

import {
  getCallList,
  getIsFetching,
  getPagination,
  getTotalCount,
} from '../reducers/CallListReducer';
import {
  changePagination,
  changeSort,
  fetchCallList,
} from '../actions/CallListActions';

const mapStateToProps = (state) => {
  const callList = getCallList(state);
  const totalCount = getTotalCount(state);
  const pagination = getPagination(state);
  const isFetching = getIsFetching(state);

  return {
    callList,
    isFetching,
    pagination,
    totalCount,
  };
};

const mapDispatchToProps = {
  changePagination,
  changeSort,
  fetchCallList,
};

const fetchFn = (props) => {
  const {
    employee,
    endDate,
    fetchCallList,
    pagination,
    startDate,
  } = props;

  const promises = [];

  if (employee) {
    fetchCallList({ employeeId: employee.get('_id'), endDate, pagination, startDate });
  }

  return Promise.all(promises);
};

export default connect(mapStateToProps, mapDispatchToProps)(fetch(fetchFn)(CallDataTable));

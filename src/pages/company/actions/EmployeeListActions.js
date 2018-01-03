import { createMeteorCallAction } from '../../../utils/redux/actions';
import { getPaginationValues } from '../../../utils/pagination';
import {
  EMPLOYEE_SUMMARY_LIST_FETCH_FAILED,
  EMPLOYEE_SUMMARY_LIST_FETCH_REQUESTED,
  EMPLOYEE_SUMMARY_LIST_FETCH_SUCCESS,
  EMPLOYEE_SUMMARY_LIST_PAGINATION_CHANGED,
  EMPLOYEE_SUMMARY_LIST_SORT_CHANGED,
} from '../../../actionTypes';
import {
  getEmployeeListThunk,
} from '../reducers/EmployeeListReducer';

const onEmployeeListFetchRequested = {
  type: EMPLOYEE_SUMMARY_LIST_FETCH_REQUESTED,
};

const onEmployeeListFetchSuccess = (payload) => {
  return {
    payload,
    type: EMPLOYEE_SUMMARY_LIST_FETCH_SUCCESS,
  };
};

const onEmployeeListFetchFailed = (payload) => {
  return {
    payload,
    type: EMPLOYEE_SUMMARY_LIST_FETCH_FAILED,
  };
};

export const fetchEmployeeList = (params) => {
  const {
    companyId,
    endDate,
    pagination,
    startDate,
  } = params;

  const pageParams = getPaginationValues(pagination);

  return createMeteorCallAction({
    callPath: 'users.callSummaryByCompany',
    onFail: error => onEmployeeListFetchFailed({ error }),
    onRequest: onEmployeeListFetchRequested,
    onSuccess: (data) => {
      if (!data.length) {
        return onEmployeeListFetchSuccess({ data: [], total: 0 });
      }

      const {
        results,
        total,
      } = data[0];
      return onEmployeeListFetchSuccess({ data: results, total });
    },
    params: {
      companyId,
      endDate,
      startDate,
      ...pageParams,
    },
    shouldFetch: state => getEmployeeListThunk(state).shouldFetch(),
  });
};

export const changeSort = (payload) => {
  return {
    payload,
    type: EMPLOYEE_SUMMARY_LIST_SORT_CHANGED,
  };
};

export const changePagination = (payload) => {
  return {
    payload,
    type: EMPLOYEE_SUMMARY_LIST_PAGINATION_CHANGED,
  };
};

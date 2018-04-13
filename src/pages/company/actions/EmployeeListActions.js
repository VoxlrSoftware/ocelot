import { createFetchAction } from '../../../utils/redux/actions';
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

  return createFetchAction({
    onFail: error => onEmployeeListFetchFailed({ error }),
    onRequest: EMPLOYEE_SUMMARY_LIST_FETCH_REQUESTED,
    onSuccess: (response) => {
      const {
        results,
        ...data
      } = response;
      return onEmployeeListFetchSuccess({ data: results, ...data });
    },
    pagination,
    params: {
      endDate,
      fields: true,
      startDate,
    },
    path: `company/${companyId}/user/summary`,
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

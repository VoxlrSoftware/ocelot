import { createFetchAction } from '../../../utils/redux/actions';
import {
  EMPLOYEE_LIST_FETCH_FAILED,
  EMPLOYEE_LIST_FETCH_REQUESTED,
  EMPLOYEE_LIST_FETCH_SUCCESS,
  EMPLOYEE_LIST_PAGINATION_CHANGED,
  EMPLOYEE_LIST_SORT_CHANGED,
} from '../../../actionTypes';
import {
  getEmployeeListThunk,
} from '../reducers/EmployeeListReducer';

const onEmployeeListFetchRequested = {
  type: EMPLOYEE_LIST_FETCH_REQUESTED,
};

const onEmployeeListFetchSuccess = (payload) => {
  return {
    payload,
    type: EMPLOYEE_LIST_FETCH_SUCCESS,
  };
};

const onEmployeeListFetchFailed = (payload) => {
  return {
    payload,
    type: EMPLOYEE_LIST_FETCH_FAILED,
  };
};

export const fetchEmployeeList = (params) => {
  const {
    companyId,
    pagination,
  } = params;

  return createFetchAction({
    onFail: error => onEmployeeListFetchFailed({ error }),
    onRequest: onEmployeeListFetchRequested,
    onSuccess: (response) => {
      const {
        results,
        ...data
      } = response;
      return onEmployeeListFetchSuccess({ data: results, ...data });
    },
    pagination,
    path: `company/${companyId}/user`,
    shouldFetch: state => getEmployeeListThunk(state).shouldFetch(),
  });
};

export const changeSort = (payload) => {
  return {
    payload,
    type: EMPLOYEE_LIST_SORT_CHANGED,
  };
};

export const changePagination = (payload) => {
  return {
    payload,
    type: EMPLOYEE_LIST_PAGINATION_CHANGED,
  };
};

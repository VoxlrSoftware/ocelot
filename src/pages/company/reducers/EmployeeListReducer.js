import {
  createReducer,
  createThunkPagingSelectors,
  createThunkPagingReducers,
  getThunkPagingInitialState,
} from '../../../utils/redux/reducers';
import {
  COMPANY_DATE_RANGE_CHANGED,
  EMPLOYEE_SUMMARY_LIST_FETCH_FAILED,
  EMPLOYEE_SUMMARY_LIST_FETCH_REQUESTED,
  EMPLOYEE_SUMMARY_LIST_FETCH_SUCCESS,
  EMPLOYEE_SUMMARY_LIST_PAGINATION_CHANGED,
  EMPLOYEE_SUMMARY_LIST_SORT_CHANGED,
  LOCATION_CHANGED,
} from '../../../actionTypes';
import { COMPANY_PAGE_STATE_KEY } from '../Constants';
import { SORT_ORDER_ASC } from '../../../Constants';

export const stateKey = 'employeeList';

const initialState = getThunkPagingInitialState({
  pagination: {
    sortBy: 'employeeName',
    sortOrder: SORT_ORDER_ASC,
  },
});

const [
  employeeListFetchFailed,
  employeeListFetchRequested,
  employeeListFetchSuccess,
  employeeListSetStale,
  employeeListSortChanged,
  employeeListPaginationChanged,
] = createThunkPagingReducers();

export default createReducer(initialState, {
  [COMPANY_DATE_RANGE_CHANGED]: employeeListSetStale,
  [EMPLOYEE_SUMMARY_LIST_FETCH_FAILED]: employeeListFetchFailed,
  [EMPLOYEE_SUMMARY_LIST_FETCH_REQUESTED]: employeeListFetchRequested,
  [EMPLOYEE_SUMMARY_LIST_FETCH_SUCCESS]: employeeListFetchSuccess,
  [EMPLOYEE_SUMMARY_LIST_PAGINATION_CHANGED]: employeeListPaginationChanged,
  [EMPLOYEE_SUMMARY_LIST_SORT_CHANGED]: employeeListSortChanged,
  [LOCATION_CHANGED]: employeeListSetStale,
});

const employeeListReducer = state => state[COMPANY_PAGE_STATE_KEY][stateKey];

export const getEmployeeListThunk = employeeListReducer;

export const [
  getEmployeeList,
  getIsFetching,
  getIsStale,
  getPagination,
  getTotalCount,
] = createThunkPagingSelectors(employeeListReducer);

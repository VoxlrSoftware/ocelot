import {
  createReducer,
  createThunkPagingSelectors,
  createThunkPagingReducers,
  getThunkPagingInitialState,
} from '../../../utils/redux/reducers';
import {
  EMPLOYEE_LIST_FETCH_FAILED,
  EMPLOYEE_LIST_FETCH_REQUESTED,
  EMPLOYEE_LIST_FETCH_SUCCESS,
  EMPLOYEE_LIST_PAGINATION_CHANGED,
  EMPLOYEE_LIST_SORT_CHANGED,
  USER_CREATE_SUCCESS,
  LOCATION_CHANGED,
} from '../../../actionTypes';
import { COMPANY_SETTINGS_PAGE_STATE_KEY } from '../Constants';
import { SORT_ORDER_DESC } from '../../../Constants';

export const stateKey = 'employeeList';

const initialState = getThunkPagingInitialState({
  pagination: {
    sortBy: 'createDate',
    sortOrder: SORT_ORDER_DESC,
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
  [EMPLOYEE_LIST_FETCH_FAILED]: employeeListFetchFailed,
  [EMPLOYEE_LIST_FETCH_REQUESTED]: employeeListFetchRequested,
  [EMPLOYEE_LIST_FETCH_SUCCESS]: employeeListFetchSuccess,
  [EMPLOYEE_LIST_PAGINATION_CHANGED]: employeeListPaginationChanged,
  [EMPLOYEE_LIST_SORT_CHANGED]: employeeListSortChanged,
  [LOCATION_CHANGED]: employeeListSetStale,
  [USER_CREATE_SUCCESS]: employeeListSetStale,
});

const employeeListReducer = state => state[COMPANY_SETTINGS_PAGE_STATE_KEY][stateKey];

export const getEmployeeListThunk = employeeListReducer;

export const [
  getEmployeeList,
  getIsFetching,
  getIsStale,
  getPagination,
  getTotalCount,
] = createThunkPagingSelectors(employeeListReducer);

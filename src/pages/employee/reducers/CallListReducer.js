import {
  createReducer,
  createThunkPagingSelectors,
  createThunkPagingReducers,
  getThunkPagingInitialState,
} from '../../../utils/redux/reducers';
import {
  EMPLOYEE_DATE_RANGE_CHANGED,
  CALL_LIST_FETCH_FAILED,
  CALL_LIST_FETCH_REQUESTED,
  CALL_LIST_FETCH_SUCCESS,
  CALL_LIST_PAGINATION_CHANGED,
  CALL_LIST_SORT_CHANGED,
  LOCATION_CHANGED,
} from '../../../actionTypes';
import { EMPLOYEE_PAGE_STATE_KEY } from '../Constants';
import { SORT_ORDER_DESC } from '../../../Constants';

export const stateKey = 'callList';

const initialState = getThunkPagingInitialState({
  pagination: {
    sortBy: 'createDate',
    sortOrder: SORT_ORDER_DESC,
  },
});

const [
  callListFetchFailed,
  callListFetchRequested,
  callListFetchSuccess,
  callListSetStale,
  callListSortChanged,
  callListPaginationChanged,
] = createThunkPagingReducers();

export default createReducer(initialState, {
  [CALL_LIST_FETCH_FAILED]: callListFetchFailed,
  [CALL_LIST_FETCH_REQUESTED]: callListFetchRequested,
  [CALL_LIST_FETCH_SUCCESS]: callListFetchSuccess,
  [CALL_LIST_PAGINATION_CHANGED]: callListPaginationChanged,
  [CALL_LIST_SORT_CHANGED]: callListSortChanged,
  [EMPLOYEE_DATE_RANGE_CHANGED]: callListSetStale,
  [LOCATION_CHANGED]: callListSetStale,
});

const callListReducer = state => state[EMPLOYEE_PAGE_STATE_KEY][stateKey];

export const [
  getCallList,
  getIsFetching,
  getIsStale,
  getPagination,
  getTotalCount,
] = createThunkPagingSelectors(callListReducer);

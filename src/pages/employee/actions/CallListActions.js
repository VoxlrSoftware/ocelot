import { createFetchAction } from '../../../utils/redux/actions';
import { getPaginationValues } from '../../../utils/pagination';
import {
  CALL_LIST_FETCH_FAILED,
  CALL_LIST_FETCH_REQUESTED,
  CALL_LIST_FETCH_SUCCESS,
  CALL_LIST_PAGINATION_CHANGED,
  CALL_LIST_SORT_CHANGED,
} from '../../../actionTypes';
import {
  getIsFetching,
  getIsStale,
} from '../reducers/CallListReducer';

const onCallListFetchSuccess = (payload) => {
  return {
    payload,
    type: CALL_LIST_FETCH_SUCCESS,
  };
};

const onCallListFetchFailed = (payload) => {
  return {
    payload,
    type: CALL_LIST_FETCH_FAILED,
  };
};

export const fetchCallList = (params) => {
  const {
    employeeId,
    endDate,
    pagination,
    startDate,
  } = params;

  return createFetchAction({
    onFail: error => onCallListFetchFailed({ error }),
    onRequest: CALL_LIST_FETCH_REQUESTED,
    onSuccess: (response) => {
      const {
        results,
        ...data
      } = response;
      return onCallListFetchSuccess({ data: results, ...data });
    },
    pagination,
    params: {
      endDate,
      fields: true,
      startDate,
    },
    path: `user/${employeeId}/call`,
    shouldFetch: state => !getIsFetching(state) && getIsStale(state),
  });
};

export const changeSort = (payload) => {
  return {
    payload,
    type: CALL_LIST_SORT_CHANGED,
  };
};

export const changePagination = (payload) => {
  return {
    payload,
    type: CALL_LIST_PAGINATION_CHANGED,
  };
};

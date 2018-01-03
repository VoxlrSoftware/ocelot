import { createMeteorCallAction } from '../../../utils/redux/actions';
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

const onCallListFetchRequested = {
  type: CALL_LIST_FETCH_REQUESTED,
};

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

  const pageParams = getPaginationValues(pagination);

  return createMeteorCallAction({
    callPath: 'calls.callsByUser',
    onFail: error => onCallListFetchFailed({ error }),
    onRequest: onCallListFetchRequested,
    onSuccess: (data) => {
      if (!data.length) {
        return onCallListFetchSuccess({ data: [], total: 0 });
      }

      const {
        results,
        total,
      } = data[0];
      return onCallListFetchSuccess({ data: results, total });
    },
    params: {
      employeeId,
      endDate,
      startDate,
      ...pageParams,
    },
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

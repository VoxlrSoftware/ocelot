import { defaultMemoize } from 'reselect';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { Thunk } from '../../models/Thunk';

const shallowEqualFn = (a, b) => {
  return (typeof a === 'object' && typeof b === 'object') ?
    shallowEqual(a, b) : a === b;
};

export const createReducer = (initialState, handlers) => {
  const reducer = (state, action) => {
    const handler = handlers[action.type];
    return handler ? handler(state, action) : state;
  };

  return (state = initialState, action) => reducer(state, action);
};

export const createStateSelector = (selector, ...stateKeys) => {
  const stateKeyFns = stateKeys.map(key => () => key);
  const stateKeyPathSelector = defaultMemoize(
    (...args) => stateKeyFns.map(keyFn => keyFn(...args)),
    shallowEqualFn
  );

  return (rootState, ...args) => {
    const state = selector(rootState, ...args);

    if (typeof state === 'undefined') {
      return;
    }

    return state.getIn(stateKeyPathSelector(...args));
  };
};

export const createThunkSelectors = selector => [
  createStateSelector(selector, 'data'),
  createStateSelector(selector, 'isFetching'),
  createStateSelector(selector, 'isStale'),
];

export const createThunkPagingSelectors = selector => [
  ...createThunkSelectors(selector),
  createStateSelector(selector, 'pagination'),
  createStateSelector(selector, 'totalCount'),
];

/**
 * [Fail, Request, Success, Stale]
 */
export const createThunkReducers = (...thunkKey) => {
  const reducers = [
    (state, { payload }) =>
      state.setData(undefined).setIsFetching(false).setIsStale(false).setError(payload.error),
    state => state.setIsFetching(true).clearError(),
    (state, { payload: { data, totalCount, totalPages } }) =>
      state.setData(data).setTotalCount(totalCount)
        .setTotalPages(totalPages)
        .setIsFetching(false)
        .setIsStale(false)
        .clearError(),
    state => state.setIsStale(true).clearError(),
  ];

  if (thunkKey.length) {
    return reducers.map(reducer => (state, ...args) => {
      return state.setIn(thunkKey, reducer(state.getIn(thunkKey), ...args));
    });
  }

  return reducers;
};

export const createThunkPagingReducers = () => [
  ...createThunkReducers(),
  (state, { payload: { sortBy, sortOrder } }) =>
    state.setPagination(state.pagination.setSortBy(sortBy).setSortOrder(sortOrder))
      .setIsStale(true),
  (state, { payload: { page, pageSize } }) =>
    state.setPagination(state.pagination.setPage(page).setPageSize(pageSize)).setIsStale(true),
];

export const getThunkInitialState = (override) => {
  return Thunk.fromJS(override);
};

export const getThunkPagingInitialState = (overide) => {
  return Thunk.withPaging(overide);
};

import Immutable from 'immutable';
import { Pagination } from './Pagination';

export class Thunk extends Immutable.Record({
  data: null,
  error: null,
  hasError: false,
  isFetching: false,
  isStale: true,
  pagination: null,
  totalCount: undefined,
  totalPages: undefined,
}) {
  static fromJS(initialState) {
    const record = Object.assign({}, initialState);
    return new Thunk(record);
  }

  static withPaging({ pagination: paginationInitialState, ...initialState } = {}) {
    const pagination = Pagination.fromJS(paginationInitialState);

    const record = Object.assign({
      pagination,
      totalCount: 0,
      totalPages: 0,
    }, initialState);

    return new Thunk(record);
  }

  shouldFetch() {
    return !this.get('isFetching') && this.get('isStale');
  }

  setData(data) {
    return this.set('data', Immutable.fromJS(data));
  }

  clearError() {
    return this.set('hasError', false).set('error', null);
  }

  setError(error) {
    return this.set('hasError', true).set('error', error);
  }

  setIsFetching(isFetching) {
    return this.set('isFetching', isFetching);
  }

  setIsStale(isStale) {
    return this.set('isStale', isStale);
  }

  setPagination(pagination) {
    return this.set('pagination', pagination);
  }

  setTotalCount(totalCount) {
    return this.set('totalCount', totalCount);
  }

  setTotalPages(totalPages) {
    return this.set('totalPages', totalPages);
  }
}

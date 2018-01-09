import Immutable from 'immutable';
import {
  SORT_ORDER_ASC,
} from '../Constants';

export class Pagination extends Immutable.Record({
  page: 0,
  pageSize: 10,
  sortBy: '',
  sortOrder: SORT_ORDER_ASC,
}) {
  static fromJS(initialState) {
    const record = Object.assign({}, initialState);
    return new Pagination(record);
  }

  setPage(page) {
    return this.set('page', page);
  }

  setPageSize(pageSize) {
    return this.set('pageSize', pageSize);
  }

  setSortBy(sortBy) {
    return this.set('sortBy', sortBy);
  }

  setSortOrder(sortOrder) {
    return this.set('sortOrder', sortOrder);
  }

  getQueryObject() {
    const query = {
      page: this.page,
      size: this.pageSize,
    };

    if (this.sortBy !== '') {
      query.sort = `${this.sortBy},${this.sortOrder}`;
    }

    return query;
  }
}

import Immutable from 'immutable';
import {
  createReducer,
  createStateSelector,
} from '../../../utils/redux/reducers';
import {
  COMPANY_DATE_RANGE_CHANGED,
} from '../../../actionTypes';
import {
  COMPANY_PAGE_STATE_KEY,
} from '../Constants';
import { DATE_RANGES, getDateRange } from '../../../utils/date';

export const stateKey = 'company';

const initialState = Immutable.fromJS(getDateRange(DATE_RANGES.WEEK));

const dateRangeChanged = (state, { payload }) => {
  const {
    dateRange,
  } = payload;

  return state.merge(getDateRange(dateRange));
};

export default createReducer(initialState, {
  [COMPANY_DATE_RANGE_CHANGED]: dateRangeChanged,
});

const companyReducer = state => state[COMPANY_PAGE_STATE_KEY][stateKey];

export const getStartDate = createStateSelector(companyReducer, 'startDate');
export const getEndDate = createStateSelector(companyReducer, 'endDate');

import Immutable from 'immutable';
import {
  createReducer,
  createStateSelector,
} from '../../../utils/redux/reducers';
import {
  EMPLOYEE_DATE_RANGE_CHANGED,
} from '../../../actionTypes';
import {
  EMPLOYEE_PAGE_STATE_KEY,
} from '../Constants';
import { DATE_RANGES, getDateRange } from '../../../utils/date';

export const stateKey = 'employee';

const initialState = Immutable.fromJS(getDateRange(DATE_RANGES.WEEK));

const dateRangeChanged = (state, { payload }) => {
  const {
    dateRange,
  } = payload;

  return state.merge(getDateRange(dateRange));
};

export default createReducer(initialState, {
  [EMPLOYEE_DATE_RANGE_CHANGED]: dateRangeChanged,
});

const employeeReducer = state => state[EMPLOYEE_PAGE_STATE_KEY][stateKey];

export const getStartDate = createStateSelector(employeeReducer, 'startDate');
export const getEndDate = createStateSelector(employeeReducer, 'endDate');

import {
  EMPLOYEE_DATE_RANGE_CHANGED,
} from '../../../actionTypes';

export const dateRangeChanged = (dateRange) => {
  return {
    payload: {
      dateRange,
    },
    type: EMPLOYEE_DATE_RANGE_CHANGED,
  };
};

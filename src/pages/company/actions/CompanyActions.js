import {
  COMPANY_DATE_RANGE_CHANGED,
} from '../../../actionTypes';

export const dateRangeChanged = (dateRange) => {
  return {
    payload: {
      dateRange,
    },
    type: COMPANY_DATE_RANGE_CHANGED,
  };
};

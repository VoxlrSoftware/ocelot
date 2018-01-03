import { combineReducers } from 'redux';
import companyReducer, { stateKey as COMPANY_STATE_KEY } from './CompanyReducer';
import EmployeeListReducer, { stateKey as EMPLOYEE_SUMMARY_LIST_STATE_KEY } from './EmployeeListReducer';
import SummaryReducer, { stateKey as SUMMARY_STATE_KEY } from './SummaryReducer';

import { COMPANY_PAGE_STATE_KEY } from '../Constants';

export const stateKey = COMPANY_PAGE_STATE_KEY;

export default combineReducers({
  [COMPANY_STATE_KEY]: companyReducer,
  [EMPLOYEE_SUMMARY_LIST_STATE_KEY]: EmployeeListReducer,
  [SUMMARY_STATE_KEY]: SummaryReducer,
});

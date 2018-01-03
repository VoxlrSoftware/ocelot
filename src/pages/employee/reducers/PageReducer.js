import { combineReducers } from 'redux';
import employeeReducer, { stateKey as EMPLOYEE_STATE_KEY } from './EmployeeReducer';
import callListReducer, { stateKey as CALL_LIST_STATE_KEY } from './CallListReducer';
import summaryReducer, { stateKey as SUMMARY_STATE_KEY } from './SummaryReducer';

import { EMPLOYEE_PAGE_STATE_KEY } from '../Constants';

export const stateKey = EMPLOYEE_PAGE_STATE_KEY;

export default combineReducers({
  [CALL_LIST_STATE_KEY]: callListReducer,
  [EMPLOYEE_STATE_KEY]: employeeReducer,
  [SUMMARY_STATE_KEY]: summaryReducer,
});

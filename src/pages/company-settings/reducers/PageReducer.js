import { combineReducers } from 'redux';
import employeeReducer, { stateKey as EMPLOYEE_STATE_KEY } from './EmployeeListReducer';

import { COMPANY_SETTINGS_PAGE_STATE_KEY } from '../Constants';

export const stateKey = COMPANY_SETTINGS_PAGE_STATE_KEY;

export default combineReducers({
  [EMPLOYEE_STATE_KEY]: employeeReducer,
});

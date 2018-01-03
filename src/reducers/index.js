import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import accountReducer, { stateKey as ACCOUNT_STATE_KEY } from './AccountReducer';
import userReducer, { stateKey as USER_STATE_KEY } from './UserReducer';
import companyReducer, { stateKey as COMPANY_STATE_KEY } from './CompanyReducer';
import notificationReducer, { stateKey as NOTIFICATION_STATE_KEY } from './NotificationReducer';
import phoneReducer, { stateKey as PHONE_KEY } from './PhoneReducer';
import recordingReducer, { stateKey as RECORDING_KEY } from './RecordingReducer';
import twilioReducer, { stateKey as TWILIO_STATE_KEY } from './TwilioReducer';

import voxlrPageReducer, { stateKey as VOXLR_PAGE_STATE_KEY } from './VoxlrPageReducer';
import companyPageReducer, { stateKey as COMPANY_PAGE_STATE_KEY } from '../pages/company/reducers/PageReducer';
import companySettingsPageReducer, { stateKey as COMPANY_SETTINGS_PAGE_STATE_KEY } from '../pages/company-settings/reducers/PageReducer';
import employeePageReducer, { stateKey as EMPLOYEE_PAGE_STATE_KEY } from '../pages/employee/reducers/PageReducer';
import callPageReducer, { stateKey as CALL_PAGE_STATE_KEY } from '../pages/call/reducers/PageReducer';
import callStrategyPageReducer, { stateKey as CALL_STRATEGY_PAGE_STATE_KEY } from '../pages/strategy/reducers/PageReducer';

export default combineReducers({
  [ACCOUNT_STATE_KEY]: accountReducer,
  [CALL_PAGE_STATE_KEY]: callPageReducer,
  [CALL_STRATEGY_PAGE_STATE_KEY]: callStrategyPageReducer,
  [COMPANY_PAGE_STATE_KEY]: companyPageReducer,
  [COMPANY_SETTINGS_PAGE_STATE_KEY]: companySettingsPageReducer,
  [COMPANY_STATE_KEY]: companyReducer,
  [EMPLOYEE_PAGE_STATE_KEY]: employeePageReducer,
  [NOTIFICATION_STATE_KEY]: notificationReducer,
  [PHONE_KEY]: phoneReducer,
  [RECORDING_KEY]: recordingReducer,
  [TWILIO_STATE_KEY]: twilioReducer,
  [USER_STATE_KEY]: userReducer,
  [VOXLR_PAGE_STATE_KEY]: voxlrPageReducer,
  routing: routerReducer,
});

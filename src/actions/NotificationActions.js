import {
  createAction,
} from '../utils/redux/actions';
import {
  CLEAR_NOTIFICATION,
} from '../actionTypes';

export const clearNotification = createAction(CLEAR_NOTIFICATION);

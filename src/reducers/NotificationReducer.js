import Immutable from 'immutable';
import {
  createReducer,
  createStateSelector,
} from '../utils/redux/reducers';
import {
  CLEAR_NOTIFICATION,
} from '../actionTypes';

export const stateKey = 'notification';

const initialState = Immutable.fromJS({
  alertProps: null,
  show: false,
});

const clearNotification = () => {
  return initialState;
};

const notificationReducer = createReducer(initialState, {
  [CLEAR_NOTIFICATION]: clearNotification,
});

export default function (state = initialState, action) {
  const {
    notification,
  } = action;

  let newState = state;

  if (notification) {
    newState = state.merge({
      alertProps: notification,
      show: true,
    });
  }

  return notificationReducer(newState, action);
}

const notificationSelector = state => state[stateKey];

export const getAlertProps = createStateSelector(notificationSelector, 'alertProps');
export const getShowAlert = createStateSelector(notificationSelector, 'show');

import React from 'react';
import { ALERT_TYPE } from '../components/alert/Alert';

export const createFailureNotification = (config) => {
  const {
    error,
    header,
    message,
  } = config;

  const errorMessage = (error && error.message) || 'An internal error has occurred. Please contact the site owner for more information';

  return {
    header,
    hiddenMessage: <div>
      <b key={ 0 }>Error:</b> <span key={ 1 }>{ errorMessage }</span>
    </div>,
    message,
    type: ALERT_TYPE.ERROR,
  };
};

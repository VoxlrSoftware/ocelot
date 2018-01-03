import {
  PAGE_INITIALIZED,
} from '../actionTypes';

export const pageInitialized = () => {
  return (dispatch) => {
    dispatch({
      type: PAGE_INITIALIZED,
    });
  };
};

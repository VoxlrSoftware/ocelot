import { push } from 'react-router-redux';
import store from './store';

export const navigate = (path) => {
  return store.dispatch(push(path));
};

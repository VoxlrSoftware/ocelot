import Immutable from 'immutable';
import { createReducer, createStateSelector } from '../utils/redux/reducers';
import {
  PAGE_INITIALIZED,
} from '../actionTypes';

export const stateKey = 'voxlr';

const initialState = Immutable.fromJS({
  isPageInitialized: false,
});

const pageInitialized = (state) => {
  return state.merge({
    isPageInitialized: true,
  });
};

export default createReducer(initialState, {
  [PAGE_INITIALIZED]: pageInitialized,
});

const voxlrPageSelector = state => state[stateKey];

export const getIsPageInitialized = createStateSelector(voxlrPageSelector, 'isPageInitialized');

import Immutable from 'immutable';
import { createSelector } from 'reselect';
import {
  createReducer,
  createThunkReducers,
  getThunkInitialState,
} from '../utils/redux/reducers';
import {
  COMPANY_FETCH_FAILED,
  COMPANY_FETCH_REQUESTED,
  COMPANY_FETCH_SUCCESS,
  COMPANY_UPDATE_SUCCESS,
  COMPANY_SET_STALE,
} from '../actionTypes';

export const stateKey = 'companies';

const initialState = Immutable.Map();

const [
  fetchFailed,
  fetchRequested,
  fetchSuccess,
  setStale,
] = createThunkReducers();

const getCompanyState = (state, companyId) => {
  return state.get(companyId) || getThunkInitialState();
};

const companyFetchFailed = (state, { payload }) => {
  const {
    companyId,
  } = payload;

  return state.set(companyId, fetchFailed(getCompanyState(state, companyId), { payload }));
};

const companyFetchRequested = (state, { payload }) => {
  const {
    companyId,
  } = payload;

  return state.set(companyId, fetchRequested(getCompanyState(state, companyId), { payload }));
};

const companyFetchSuccess = (state, { payload }) => {
  const {
    companyId,
  } = payload;

  return state.set(companyId, fetchSuccess(getCompanyState(state, companyId), { payload }));
};

const companySetStale = (state, { payload }) => {
  const {
    companyId,
  } = payload;

  return state.set(companyId, setStale(getCompanyState(state, companyId), { payload }));
};

export default createReducer(initialState, {
  [COMPANY_FETCH_FAILED]: companyFetchFailed,
  [COMPANY_FETCH_REQUESTED]: companyFetchRequested,
  [COMPANY_FETCH_SUCCESS]: companyFetchSuccess,
  [COMPANY_SET_STALE]: companySetStale,
  [COMPANY_UPDATE_SUCCESS]: companySetStale,
});

const companysReducer = state => state[stateKey];

const companyStateReducer = (state, companyId) => state.get(companyId) || getThunkInitialState();

export const getCompanyStateSelector = createSelector(
  companysReducer,
  (state, companyId) => companyId,
  companyStateReducer,
);


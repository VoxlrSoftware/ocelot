import {
  createAction,
  createMeteorCallAction,
  createMultipleActions,
} from '../utils/redux/actions';
import {
  COMPANY_FETCH_FAILED,
  COMPANY_FETCH_REQUESTED,
  COMPANY_FETCH_SUCCESS,
  COMPANY_UPDATE_FAILED,
  COMPANY_UPDATE_REQUESTED,
  COMPANY_UPDATE_SUCCESS,
  COMPANY_SET_STALE,
} from '../actionTypes';
import {
  getCompanyStateSelector,
} from '../reducers/CompanyReducer';

export const setCompanyStale = createAction(COMPANY_SET_STALE);

const [
  onCompanyFetchRequested,
  onCompanyFetchFailed,
  onCompanyFetchSuccess,
] = createMultipleActions([
  COMPANY_FETCH_REQUESTED,
  COMPANY_FETCH_FAILED,
  COMPANY_FETCH_SUCCESS,
]);

export const fetchCompany = (companyId) => {
  return createMeteorCallAction({
    callPath: 'companies.findOne',
    onFail: error => onCompanyFetchFailed({
      error,
    }),
    onRequest: onCompanyFetchRequested({ companyId }),
    onSuccess: (data) => {
      if (typeof data === 'undefined') {
        return onCompanyFetchFailed({ companyId });
      }

      return onCompanyFetchSuccess({ companyId, data });
    },
    params: {
      companyId,
    },
    shouldFetch: state => getCompanyStateSelector(state, companyId).shouldFetch(),
  });
};

const [
  onCompanyUpdateRequested,
  onCompanyUpdateFailed,
  onCompanyUpdateSuccess,
] = createMultipleActions([
  COMPANY_UPDATE_REQUESTED,
  COMPANY_UPDATE_FAILED,
  COMPANY_UPDATE_SUCCESS,
]);

export const updateCompany = (config) => {
  const {
    companyId,
    newValues,
  } = config;

  return createMeteorCallAction({
    callPath: 'companies.updateOne',
    onFail: error => onCompanyUpdateFailed({
      error,
    }),
    onRequest: onCompanyUpdateRequested({ companyId }),
    onSuccess: (data) => {
      if (data.error) {
        return onCompanyUpdateFailed({
          error: data.error,
        });
      }

      return onCompanyUpdateSuccess({ companyId, data });
    },
    params: {
      companyId,
      newValues,
    },
    shouldFetch: () => true,
  });
};

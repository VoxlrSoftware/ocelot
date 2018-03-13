import {
  createFetchAction,
  createMultipleActions,
} from '../../../utils/redux/actions';
import {
  COMPANY_SUMMARY_AVERAGES_REQUESTED,
  COMPANY_SUMMARY_AVERAGES_RECEIVED,
  COMPANY_SUMMARY_AVERAGES_FAILED,
  COMPANY_SUMMARY_OUTCOMES_RECEIVED,
  COMPANY_SUMMARY_OUTCOMES_REQUESTED,
  COMPANY_SUMMARY_OUTCOMES_FAILED,
  COMPANY_SUMMARY_ROLLUPS_REQUESTED,
  COMPANY_SUMMARY_ROLLUPS_RECEIVED,
  COMPANY_SUMMARY_ROLLUPS_FAILED,
} from '../../../actionTypes';
import {
  getAverages,
  getRollups,
  getOutcomes,
} from '../reducers/SummaryReducer';

const [
  onAveragesFetchFailed,
  onAveragesFetchSuccess,
] = createMultipleActions([
  COMPANY_SUMMARY_AVERAGES_FAILED,
  COMPANY_SUMMARY_AVERAGES_RECEIVED,
]);

const [
  onOutcomesFetchFailed,
  onOutcomesFetchSuccess,
] = createMultipleActions([
  COMPANY_SUMMARY_OUTCOMES_FAILED,
  COMPANY_SUMMARY_OUTCOMES_RECEIVED,
]);

const [
  onRollupsFetchFailed,
  onRollupsFetchSuccess,
] = createMultipleActions([
  COMPANY_SUMMARY_ROLLUPS_FAILED,
  COMPANY_SUMMARY_ROLLUPS_RECEIVED,
]);

export const fetchAverages = (params) => {
  const {
    companyId,
    endDate,
    fields,
    startDate,
  } = params;

  return createFetchAction({
    onFail: error => onAveragesFetchFailed({
      error,
    }),
    onRequest: COMPANY_SUMMARY_AVERAGES_REQUESTED,
    onSuccess: data => onAveragesFetchSuccess({ data }),
    params: {
      endDate,
      fields,
      startDate,
    },
    path: `company/${companyId}/call/average`,
    shouldFetch: state => getAverages(state).shouldFetch(),
  });
};

export const fetchRollups = (params) => {
  const {
    companyId,
    endDate,
    fields,
    startDate,
  } = params;

  return createFetchAction({
    onFail: error => onRollupsFetchFailed({
      error,
    }),
    onRequest: COMPANY_SUMMARY_ROLLUPS_REQUESTED,
    onSuccess: data => onRollupsFetchSuccess({ data }),
    params: {
      endDate,
      fields,
      startDate,
    },
    path: `company/${companyId}/call/rollup`,
    shouldFetch: state => getRollups(state).shouldFetch(),
  });
};

export const fetchCallOutcomes = (params) => {
  const {
    companyId,
    endDate,
    startDate,
  } = params;

  return createFetchAction({
    onFail: error => onOutcomesFetchFailed({
      error,
    }),
    onRequest: COMPANY_SUMMARY_OUTCOMES_REQUESTED,
    onSuccess: data => onOutcomesFetchSuccess({ data }),
    params: {
      endDate,
      startDate,
    },
    path: `company/${companyId}/call/outcomes`,
    shouldFetch: state => getOutcomes(state).shouldFetch(),
  });
};

import {
  createFetchAction,
  createMultipleActions,
} from '../../../utils/redux/actions';
import {
  COMPANY_SUMMARY_AVERAGES_REQUESTED,
  COMPANY_SUMMARY_AVERAGES_RECEIVED,
  COMPANY_SUMMARY_AVERAGES_FAILED,
  COMPANY_SUMMARY_ROLLUPS_REQUESTED,
  COMPANY_SUMMARY_ROLLUPS_RECEIVED,
  COMPANY_SUMMARY_ROLLUPS_FAILED,
} from '../../../actionTypes';
import {
  getAverages,
  getRollups,
} from '../reducers/SummaryReducer';

const [
  onAveragesFetchFailed,
  onAveragesFetchSuccess,
] = createMultipleActions([
  COMPANY_SUMMARY_AVERAGES_FAILED,
  COMPANY_SUMMARY_AVERAGES_RECEIVED,
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

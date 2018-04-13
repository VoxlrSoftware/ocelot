import {
  createFetchAction,
  createMultipleActions,
} from '../../../utils/redux/actions';
import {
  EMPLOYEE_SUMMARY_AVERAGES_REQUESTED,
  EMPLOYEE_SUMMARY_AVERAGES_RECEIVED,
  EMPLOYEE_SUMMARY_AVERAGES_FAILED,
  EMPLOYEE_SUMMARY_OUTCOMES_RECEIVED,
  EMPLOYEE_SUMMARY_OUTCOMES_REQUESTED,
  EMPLOYEE_SUMMARY_OUTCOMES_FAILED,
  EMPLOYEE_SUMMARY_ROLLUPS_REQUESTED,
  EMPLOYEE_SUMMARY_ROLLUPS_RECEIVED,
  EMPLOYEE_SUMMARY_ROLLUPS_FAILED,
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
  EMPLOYEE_SUMMARY_AVERAGES_FAILED,
  EMPLOYEE_SUMMARY_AVERAGES_RECEIVED,
]);

const [
  onOutcomesFetchFailed,
  onOutcomesFetchSuccess,
] = createMultipleActions([
  EMPLOYEE_SUMMARY_OUTCOMES_FAILED,
  EMPLOYEE_SUMMARY_OUTCOMES_RECEIVED,
]);

const [
  onRollupsFetchFailed,
  onRollupsFetchSuccess,
] = createMultipleActions([
  EMPLOYEE_SUMMARY_ROLLUPS_FAILED,
  EMPLOYEE_SUMMARY_ROLLUPS_RECEIVED,
]);

export const fetchAverages = (params) => {
  const {
    employeeId,
    endDate,
    fields,
    startDate,
  } = params;

  return createFetchAction({
    onFail: error => onAveragesFetchFailed({
      error,
    }),
    onRequest: EMPLOYEE_SUMMARY_AVERAGES_REQUESTED,
    onSuccess: data => onAveragesFetchSuccess({ data }),
    params: {
      endDate,
      fields,
      startDate,
    },
    path: `user/${employeeId}/call/average`,
    shouldFetch: state => getAverages(state).shouldFetch(),
  });
};

export const fetchRollups = (params) => {
  const {
    employeeId,
    endDate,
    fields,
    startDate,
  } = params;

  return createFetchAction({
    onFail: error => onRollupsFetchFailed({
      error,
    }),
    onRequest: EMPLOYEE_SUMMARY_ROLLUPS_REQUESTED,
    onSuccess: data => onRollupsFetchSuccess({ data }),
    params: {
      endDate,
      fields,
      startDate,
    },
    path: `user/${employeeId}/call/rollup`,
    shouldFetch: state => getRollups(state).shouldFetch(),
  });
};

export const fetchCallOutcomes = (params) => {
  const {
    employeeId,
    endDate,
    startDate,
  } = params;

  return createFetchAction({
    onFail: error => onOutcomesFetchFailed({
      error,
    }),
    onRequest: EMPLOYEE_SUMMARY_OUTCOMES_REQUESTED,
    onSuccess: data => onOutcomesFetchSuccess({ data }),
    params: {
      endDate,
      startDate,
    },
    path: `user/${employeeId}/call/outcomes`,
    shouldFetch: state => getOutcomes(state).shouldFetch(),
  });
};

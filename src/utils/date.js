import moment from 'moment';

export const DATE_RANGES = {
  DAY: 'Day',
  MONTH: 'Month',
  QUARTER: 'Quarter',
  WEEK: 'Week',
};

export const getStartOfDate = date => (
  moment(date).startOf('day').toDate()
);

export const getMonthToDate = () => (
  moment().add(-30, 'day').startOf('day')
);

const getRangeDay = () => {
  return {
    endDate: moment().endOf('day').toDate(),
    startDate: moment().startOf('day').toDate(),
  };
};

const getRangeWeek = () => {
  return {
    endDate: moment().endOf('day').toDate(),
    startDate: moment().startOf('isoWeek').toDate(),
  };
};

const getRangeMonth = () => {
  return {
    endDate: moment().endOf('day').toDate(),
    startDate: moment().startOf('month').startOf('day').toDate(),
  };
};

const getRangeQuarter = () => {
  return {
    endDate: moment().endOf('day').toDate(),
    startDate: moment().startOf('quarter').startOf('day').toDate(),
  };
};

export const getDateRange = (range) => {
  switch (range) {
    case DATE_RANGES.WEEK: return getRangeWeek();
    case DATE_RANGES.MONTH: return getRangeMonth();
    case DATE_RANGES.QUARTER: return getRangeQuarter();
    default: return getRangeDay();
  }
};

export const formatTime = (seconds) => {
  if (seconds >= 3600) {
    const hours = seconds / 3600;
    return `${hours.toFixed(2)} hrs`;
  }

  if (seconds >= 60) {
    const minutes = seconds / 60;
    return `${minutes.toFixed(2)} mins`;
  }

  return `${Math.round(seconds)} secs`;
};

const padLeft = (str, pad, length) => (
  (new Array(length + 1).join(pad) + str).slice(-length)
);

export const formatTimeSeparated = (seconds) => {
  let working = seconds;

  const hours = Math.floor(working / 3600);
  working -= hours * 3600;

  const minutes = Math.floor(working / 60);
  working = Math.floor(working - (minutes * 60));

  return `${padLeft(hours, '0', 2)}:${padLeft(minutes, '0', 2)}:${padLeft(working, '0', 2)}`;
};

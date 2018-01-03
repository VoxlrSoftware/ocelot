import { connect } from 'react-redux';
import { defaultMemoize } from 'reselect';
import fetch from '../../../utils/redux/fetch';
import Summary from '../../../components/summary/Summary';
import {
  fetchCallOutcome,
} from '../actions/SummaryActions';

import {
  getCallOutcome,
} from '../reducers/SummaryReducer';
import { CALL_OUTCOMES } from '../../../Constants';

const UNKNOWN = 'Unknown';

const callOutcomes = [
  CALL_OUTCOMES.WON,
  CALL_OUTCOMES.PROGRESS,
  CALL_OUTCOMES.LOST,
  CALL_OUTCOMES.VOICEMAIL,
];

const getStatData = (outcome) => {
  return {
    data: 0,
    isLoading: false,
    label: outcome,
    name: outcome,
  };
};

const statistics = callOutcomes.map(getStatData);

const getStatistics = defaultMemoize((outcomes) => {
  let stats = statistics.slice();

  if (outcomes) {
    const outcomeMap = outcomes.reduce((acc, outcome) => {
      acc[outcome.get('name')] = outcome.get('count');
      return acc;
    }, {});

    if (outcomeMap[UNKNOWN]) {
      stats.push(getStatData(UNKNOWN));
    }

    stats = stats.map((outcome) => {
      const data = outcomeMap[outcome.name] || 0;
      return {
        ...outcome,
        data,
      };
    });
  }

  return stats;
});

const mapStateToProps = (state) => {
  const callOutcome = getCallOutcome(state);
  const statistics = getStatistics(callOutcome.data);

  return {
    callOutcome,
    isLoading: callOutcome.isFetching || callOutcome.isStale,
    statistics,
  };
};

const mapDispatchToProps = {
  fetchCallOutcome,
};

const fetchFn = (props) => {
  const {
    employee,
    endDate,
    fetchCallOutcome,
    startDate,
  } = props;


  const employeeId = employee.get('_id');

  const promises = [
    fetchCallOutcome({ employeeId, endDate, startDate }),
  ];

  return Promise.all(promises);
};

export default connect(mapStateToProps, mapDispatchToProps)(fetch(fetchFn)(Summary));

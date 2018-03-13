import Immutable from 'immutable';
import { connect } from 'react-redux';
import { defaultMemoize } from 'reselect';
import fetch from '../../../utils/redux/fetch';
import Summary from '../../../components/summary/Summary';
import {
  fetchCallOutcomes,
} from '../actions/SummaryActions';

import {
  getOutcomes,
} from '../reducers/SummaryReducer';
import { CALL_OUTCOMES } from '../../../Constants';

const NONE = { text: 'None', value: 'None' };

const callOutcomes = [
  CALL_OUTCOMES.WON,
  CALL_OUTCOMES.PROGRESS,
  CALL_OUTCOMES.LOST,
  CALL_OUTCOMES.VOICEMAIL,
];

const knownOutcomes = Immutable.Set.of(
  CALL_OUTCOMES.WON.value,
  CALL_OUTCOMES.LOST.value,
  CALL_OUTCOMES.PROGRESS.value,
  CALL_OUTCOMES.VOICEMAIL.value,
);

const getStatData = (outcome) => {
  return {
    data: 0,
    isLoading: false,
    label: outcome.text,
    name: outcome.value,
  };
};

const statistics = callOutcomes.map(getStatData);

const getStatistics = defaultMemoize((outcomes) => {
  const unknownKey = NONE.value;
  let stats = statistics.slice();

  if (outcomes) {
    const outcomeMap = outcomes.reduce((acc, count, name) => {
      if (knownOutcomes.contains(name)) {
        acc[name] = count;
      } else {
        acc[unknownKey] = (acc[unknownKey] || 0) + count;
      }

      return acc;
    }, {});

    if (outcomeMap[unknownKey]) {
      stats.push(getStatData(NONE));
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
  const callOutcome = getOutcomes(state);
  const statistics = getStatistics(callOutcome.data);

  return {
    callOutcome,
    isLoading: callOutcome.isFetching || callOutcome.isStale,
    statistics,
  };
};

const mapDispatchToProps = {
  fetchCallOutcomes,
};

const fetchFn = (props) => {
  const {
    companyId,
    endDate,
    fetchCallOutcomes,
    startDate,
  } = props;

  const promises = [
    fetchCallOutcomes({ companyId, endDate, startDate }),
  ];

  return Promise.all(promises);
};

export default connect(mapStateToProps, mapDispatchToProps)(fetch(fetchFn)(Summary));

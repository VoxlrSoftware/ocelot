import { connect } from 'react-redux';
import fetch from '../../utils/redux/fetch';

import Chart from './Chart';

const mapStateToProps = (state, props) => {
  const {
    selector,
  } = props;

  const data = selector(state).data;
  const isLoading = selector(state).isFetching;

  return {
    data,
    isLoading,
  };
};

const fetchFn = (props) => {
  const {
    dispatch,
    fetchChart,
  } = props;

  const promises = [
    fetchChart(dispatch),
  ];

  return Promise.all(promises);
};

export default connect(mapStateToProps)(fetch(fetchFn)(Chart));

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  Loader,
} from 'semantic-ui-react';
import _ from 'lodash';
import Highcharts from '../../utils/Highcharts';

import { getClassNameGenerator } from '../../utils/namespacing';

import './Chart.scss';

const displayName = 'Chart';
const getClassName = getClassNameGenerator(displayName);

export default class Chart extends Component {
  static displayName = displayName;

  static defaultProps = {
    isLoading: true,
  };

  static propTypes = {
    buildParams: PropTypes.object,
    chartBuilder: PropTypes.func.isRequired,
    chartKey: PropTypes.string.isRequired,
    data: ImmutablePropTypes.list,
    isLoading: PropTypes.bool,
  };

  componentDidMount() {
    this._buildChart(this.props);
    this.forceUpdate();
  }

  componentWillUpdate(nextProps) {
    if (this.compareProps(nextProps)) {
      this._buildChart(nextProps);
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  compareProps(nextProps) {
    return this.props.data !== nextProps.data ||
      this.props.chartKey !== nextProps.chartKey ||
      !_.isEqual(this.props.buildParams, nextProps.buildParams) ||
      this.props.isLoading !== nextProps.isLoading;
  }

  _buildChart = (props) => {
    const {
      buildParams,
      chartBuilder,
      data,
    } = props;

    if (data) {
      const chartConfig = chartBuilder({ data, renderTo: this.chartRef, ...buildParams });
      this.chart = Highcharts.chart(chartConfig);
    }
  };

  render() {
    const {
      isLoading,
    } = this.props;

    return (
      <div className={ getClassName() }>
        {
          isLoading ? <Loader active size="huge" /> : null
        }
        <div ref={ chart => this.chartRef = chart } />
      </div>
    );
  }
}

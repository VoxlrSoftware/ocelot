import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  Divider,
  Loader,
  Statistic,
} from 'semantic-ui-react';

import { getClassNameGenerator } from '../../utils/namespacing';

import './Summary.scss';

const displayName = 'Summary';
const getClassName = getClassNameGenerator(displayName);

export default class Summary extends Component {
  static displayName = displayName;

  static propTypes = {
    isLoading: PropTypes.bool,
    renderComponent: PropTypes.func,
    renderProps: PropTypes.object,
    statistics: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.statistics !== this.props.statistics ||
      nextProps.isLoading !== this.props.isLoading ||
      nextState.currentTab !== this.state.currentTab;
  }

  getStatistic = (statistic, index) => {
    const {
      renderComponent,
    } = this.props;

    const {
      data,
      isLoading,
      label,
      name,
      render = a => a,
    } = statistic;

    const statOnly = !renderComponent;
    const isActive = !statOnly && this.state.currentTab === index;

    let statContent;

    if (isLoading) {
      statContent = <Loader inline active />;
    } else {
      const dataValue = render(data);

      statContent = [
        <Statistic.Value key={ `${name}-value` }>{ dataValue }</Statistic.Value>,
        <Statistic.Label key={ `${name}-label` }>{ label }</Statistic.Label>,
      ];
    }

    const classes = {
      active: isActive,
      statOnly,
    };

    const indicator = isActive ? <div className="indicator" /> : null;
    const onClick = !statOnly ? () => this.setTab(index) : null;

    const props = {
      className: classnames(getClassName({ child: 'statistic' }), classes),
      key: name,
      onClick,
    };

    return (
      <Statistic { ...props }>
        { statContent }
        { indicator }
      </Statistic>
    );
  };

  setTab = (index) => {
    this.setState({
      currentTab: index,
    });
  };

  getTab = () => {
    const {
      renderComponent,
      renderProps,
      statistics,
    } = this.props;

    if (!statistics.length) {
      return;
    }

    const currentStat = statistics[this.state.currentTab];
    const props = renderProps[currentStat.name];

    return renderComponent(props);
  };

  getStatGroup() {
    const {
      statistics,
      renderComponent,
    } = this.props;

    const divider = renderComponent ?
      (<Divider section />) : null;
    const tab = renderComponent ?
      this.getTab() : null;

    return (
      <div>
        <Statistic.Group widths={ statistics.length }>
          { statistics.map(this.getStatistic)}
        </Statistic.Group>
        { divider }
        { tab }
      </div>
    );
  }

  render() {
    const {
      isLoading,
    } = this.props;

    const content = isLoading ?
      (<Loader active inline="centered" />) :
      this.getStatGroup();

    return (
      <div className={ getClassName() }>
        { content }
      </div>
    );
  }
}

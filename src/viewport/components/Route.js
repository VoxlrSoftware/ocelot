import React, { Component } from 'react';
import { Route as ReactRoute } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Loader,
} from 'semantic-ui-react';

import ScrollToTop from './ScrollToTop';
import { getIsPageInitialized } from '../../reducers/VoxlrPageReducer';

const displayName = 'Route';

class Route extends Component {
  static displayName = displayName;

  static propTypes = {
    component: PropTypes.func,
    isPageInitialized: PropTypes.bool,
  }

  render() {
    const {
      component: Component,
      isPageInitialized,
      ...rest
    } = this.props;

    const render = props => (isPageInitialized ? <ScrollToTop><Component { ...props } /></ScrollToTop> : <Loader type="massive" active />);

    return <ReactRoute { ...rest } render={ render } />;
  }
}

const mapStateToProps = (state) => {
  const isPageInitialized = getIsPageInitialized(state);

  return {
    isPageInitialized,
  };
};

export default connect(mapStateToProps, null, null, { pure: false })(Route);

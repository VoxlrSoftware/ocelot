import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import {
  Loader,
} from 'semantic-ui-react';

import ScrollToTop from './ScrollToTop';
import { getAccount, getIsLoggedIn } from '../../reducers/AccountReducer';
import { getIsPageInitialized } from '../../reducers/VoxlrPageReducer';

const displayName = 'PrivateRoute';

class PrivateRoute extends Component {
  static displayName = displayName;

  static defaultProps = {
    admin: false,
  };

  static propTypes = {
    account: ImmutablePropTypes.map,
    admin: PropTypes.bool,
    component: PropTypes.func,
    isLoggedIn: PropTypes.bool,
    isPageInitialized: PropTypes.bool,
  };

  render() {
    const {
      account,
      admin,
      component: Component,
      isLoggedIn,
      isPageInitialized,
      ...rest
    } = this.props;

    let render;
    let redirectPath = '/login';
    let canRender = true;

    if (!isLoggedIn) {
      if (admin && account.getIn(['profile', 'role']) !== 'admin') {
        redirectPath = '/new/call';
      }
      canRender = false;
    }

    if (canRender) {
      render = props => (isPageInitialized ?
        <ScrollToTop><Component { ...props } /></ScrollToTop> :
        <Loader type="massive" active />);
    } else {
      render = props => (<Redirect
        to={ { pathname: redirectPath, state: { from: props.location } } } />);
    }

    return <Route { ...rest } render={ render } />;
  }
}

const mapStateToProps = (state) => {
  const account = getAccount(state);
  const isLoggedIn = getIsLoggedIn(state);
  const isPageInitialized = getIsPageInitialized(state);

  return {
    account,
    isLoggedIn,
    isPageInitialized,
  };
};

export default connect(mapStateToProps, null, null, { pure: false })(PrivateRoute);

import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getIsLoggedIn } from '../../reducers/AccountReducer';

const displayName = 'IndexRedirect';

class IndexRedirect extends Component {
  static displayName = displayName;

  static propTypes = {
    isLoggedIn: PropTypes.bool,
    redirectTo: PropTypes.string.isRequired,
  }

  render() {
    const {
      isLoggedIn,
      redirectTo,
    } = this.props;

    let path = '/login';

    if (isLoggedIn) {
      path = redirectTo;
    }

    return (<Route exact path="/" >
      <Redirect to={ { pathname: path } } />
    </Route>);
  }
}

const mapStateToProps = (state) => {
  const isLoggedIn = getIsLoggedIn(state);

  return {
    isLoggedIn,
  };
};

export default connect(mapStateToProps, null, null, { pure: false })(IndexRedirect);

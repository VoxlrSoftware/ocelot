import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'react-router-redux';
import { Switch } from 'react-router-dom';
import {
  Loader,
} from 'semantic-ui-react';

import { history } from '../../store';
import Route from './Route';
import PrivateRoute from './PrivateRoute';

import HeaderContainer from '../containers/HeaderContainer';
import IndexRedirect from './IndexRedirect';

import EmployeeDetailPage from '../../pages/employee/containers/PageContainer';
import CompanyPage from '../../pages/company/containers/PageContainer';
import CallPage from '../../pages/call/containers/PageContainer';
import NewCallPage from '../../pages/new-call/containers/PageContainer';
import CompanySettingsPage from '../../pages/company-settings/containers/PageContainer';
import CallStrategyPage from '../../pages/strategy/containers/PageContainer';
import LoginPage from '../../pages/login/containers';

import { Thunk } from '../../models/Thunk';

import { isAdminAccount } from '../../utils/account';

import './VoxlrPage.scss';

const displayName = 'VoxlrPage';

export default class VoxlrPage extends Component {
  static displayName = displayName;

  static propTypes = {
    accountState: PropTypes.instanceOf(Thunk).isRequired,
    initializeUser: PropTypes.func.isRequired,
    isPageInitialized: PropTypes.bool.isRequired,
    pageInitialized: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const {
      initializeUser,
      pageInitialized,
    } = this.props;

    initializeUser().then(() => {
      pageInitialized();
    });
  }

  getRoutes = () => {
    const {
      accountState,
    } = this.props;

    const routes = [
      <PrivateRoute exact path="/employee/:employeeId" component={ EmployeeDetailPage } key="employee" />,
      <PrivateRoute exact path="/call/new" component={ NewCallPage } key="new-call" />,
      <PrivateRoute exact path="/call/:callId" component={ CallPage } key="call" />,
    ];

    const isAdmin = isAdminAccount(accountState.data);

    if (isAdmin) {
      routes.push(
        <PrivateRoute exact path="/company" component={ CompanyPage } key="company" admin />,
        <PrivateRoute exact path="/company/settings" component={ CompanySettingsPage } key="company-settings" admin />,
        <PrivateRoute exact path="/strategy" component={ CallStrategyPage } key="strategy" admin />,
      );
    }

    const indexRedirectProps = {
      redirectTo: isAdmin ? '/company' : '/call/new',
    };

    return (
      <ConnectedRouter history={ history }>
        <div>
          <HeaderContainer />
          <Switch>
            { routes }
            <Route exact path="/login" component={ LoginPage } />
            <IndexRedirect { ...indexRedirectProps } />
          </Switch>
        </div>
      </ConnectedRouter>
    );
  };

  render() {
    const {
      isPageInitialized,
    } = this.props;

    return isPageInitialized ? this.getRoutes() : <Loader size="massive" active />;
  }
}

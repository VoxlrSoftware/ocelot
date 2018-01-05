import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import classnames from 'classnames';
import {
  Container,
  Dropdown,
  Loader,
  Menu,
} from 'semantic-ui-react';

import { getClassNameGenerator } from '../../utils/namespacing';
import { wrapComponents } from '../../utils';
import { isAdminAccount } from '../../utils/account';
import RenderToBody from './RenderToBody';
import Alert from '../../components/alert/Alert';

import './Header.scss';

const displayName = 'Viewport/Header';
const getClassName = getClassNameGenerator(displayName);

const COMPANY_SETTINGS = 'Company Settings';
const MANAGE_SALES_SCRIPT = 'Manage Call Strategies';

export default class Header extends Component {
  static displayName = displayName;

  static propTypes = {
    account: ImmutablePropTypes.map,
    clearNotification: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isModifyingLogin: PropTypes.bool.isRequired,
    notification: PropTypes.shape({
      alertProps: PropTypes.object,
      show: PropTypes.bool.isRequired,
    }).isRequired,
    push: PropTypes.func.isRequired,
    userLogout: PropTypes.func.isRequired,
  };

  getAlert() {
    const {
      clearNotification,
      notification: {
        alertProps = {},
        show = false,
      },
    } = this.props;

    const props = {
      controlled: true,
      onClose: () => clearNotification(),
      show,
      ...alertProps,
    };

    const classes = classnames(getClassName({ child: 'notification' }), 'no-dim');

    return (
      <RenderToBody>
        <div className={ classes }>
          <Alert { ...props } />
        </div>
      </RenderToBody>
    );
  }

  getNav() {
    const {
      account,
      isLoggedIn,
      isModifyingLogin,
    } = this.props;

    if (isLoggedIn) {
      const dropdownProps = {
        closeOnBlur: true,
        item: true,
        text: 'Admin',
        value: 0,
      };

      const isAdmin = isAdminAccount(account);

      return [
        <Menu.Item link onClick={ this.navTo('/call/new') }>New Call</Menu.Item>,
        <Menu.Item link onClick={ this.navTo(`/employee/${account.get('_id')}`) }>My Calls</Menu.Item>,
        isAdmin ? <Menu.Item link onClick={ this.navTo('/company') }>Company</Menu.Item> : null,
        isAdmin ? <Dropdown { ...dropdownProps } >
          <Dropdown.Menu>
            <Dropdown.Item text={ COMPANY_SETTINGS } onClick={ this.navTo('/company/settings') } />
            <Dropdown.Item text={ MANAGE_SALES_SCRIPT } onClick={ this.navTo('/strategy') } />
          </Dropdown.Menu>
        </Dropdown> : null,
        <Menu.Item link onClick={ this.logout } position="right">{ isModifyingLogin ? <Loader active inline /> : 'Log Out' }</Menu.Item>,
      ];
    }

    return [
      <Menu.Item link onClick={ this.navTo('/login') } position="right">{ isModifyingLogin ? <Loader active inline /> : 'Log In' }</Menu.Item>,
    ];
  }

  logout = () => {
    this.props.userLogout();
  };

  navTo = (path) => {
    const {
      push,
    } = this.props;

    return () => {
      push(path);
    };
  };

  render() {
    const menuProps = {
      borderless: true,
      fixed: 'top',
      inverted: true,
    };

    return (
      <Menu { ...menuProps } className={ getClassName() }>
        { this.getAlert() }
        <Container>
          <Menu.Item link onClick={ this.navTo('/') }><h1>Voxlr</h1></Menu.Item>
          { wrapComponents(this.getNav()) }
        </Container>
      </Menu>
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Container,
  Divider,
  Header as SemanticHeader,
  Segment,
} from 'semantic-ui-react';

import { Thunk } from '../../../models/Thunk';
import { getClassNameGenerator } from '../../../utils/namespacing';
import Page from '../../../components/Page';
import Header from '../../../components/Header';
import EmployeeDataTableContainer from '../containers/EmployeeDataTableContainer';
import EmployeeDataTableToolbar from './EmployeeDataTableToolbar';
import CompanyInfoContainer from '../containers/CompanyInfoContainer';

const displayName = 'Pages/CompanySettings';
const getClassName = getClassNameGenerator(displayName);

export default class CompanySettingsPage extends Component {
  static displayName = displayName;

  static propTypes = {
    companyId: PropTypes.string,
    companyState: PropTypes.instanceOf(Thunk).isRequired,
    createUser: PropTypes.func.isRequired,
    isCreating: PropTypes.bool.isRequired,
  };

  render() {
    const {
      companyId,
      companyState,
      createUser,
      isCreating,
    } = this.props;

    const companyName = companyState.data && companyState.data.get('Name');

    const headerProps = {
      leftHeaderText: 'Company Settings',
      leftSubHeaderText: 'View company information and manage employees',
      rightHeaderText: <Link to="/company">{ companyName }</Link>,
    };

    const employeeDataTableContainerProps = {
      companyId,
      companyName,
    };

    const employeeDataTableToolbarProps = {
      createUser,
      isCreating,
    };

    const companyInfoProps = {
      companyState,
    };

    return (
      <Page className={ getClassName() } isLoading={ companyState.isFetching }>
        <Container>
          <Header { ...headerProps } />
          <Segment>
            <SemanticHeader>Info</SemanticHeader>
            <Divider />
            <CompanyInfoContainer { ...companyInfoProps } />
          </Segment>
          <Segment>
            <SemanticHeader>Employees</SemanticHeader>
            <Divider />
            <EmployeeDataTableToolbar { ...employeeDataTableToolbarProps } />
            <EmployeeDataTableContainer { ...employeeDataTableContainerProps } />
          </Segment>
        </Container>
      </Page>
    );
  }
}

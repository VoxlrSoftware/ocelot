import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  Container,
  Divider,
  Header as SemanticHeader,
  Segment,
} from 'semantic-ui-react';

import { getClassNameGenerator } from '../../../utils/namespacing';
import { getProfileName } from '../../../utils/types/User';

import Page from '../../../components/Page';
import Header from '../../../components/Header';
import DateFilter from '../../../components/filters/DateFilter';
import CallDataTableContainer from '../containers/CallDataTableContainer';
import SummaryContainer from '../containers/SummaryContainer';
import OutcomeContainer from '../containers/OutcomeContainer';

const displayName = 'Pages/Employee';
const getClassName = getClassNameGenerator(displayName);

export default class EmployeePage extends Component {
  static displayName = displayName;

  static propTypes = {
    companyName: PropTypes.string,
    dateRangeChanged: PropTypes.func.isRequired,
    employee: ImmutablePropTypes.map,
    endDate: PropTypes.instanceOf(Date),
    isLoading: PropTypes.bool.isRequired,
    startDate: PropTypes.instanceOf(Date),
  };

  render() {
    const {
      companyName,
      employee,
      endDate,
      isLoading,
      startDate,
    } = this.props;

    const employeeName = employee ? getProfileName(employee) : '';

    const headerProps = {
      leftHeaderText: 'Employee',
      leftSubHeaderText: 'View overall performance and detail for an employee',
      rightHeaderText: employeeName,
      rightSubHeaderText: <Link to="/company">{ companyName }</Link>,
    };

    const callDataTableContainerProps = {
      employee,
      endDate,
      startDate,
    };

    const summaryProps = {
      employee,
      endDate,
      startDate,
    };

    const outcomeProps = {
      employee,
      endDate,
      startDate,
    };

    return (
      <Page isLoading={ isLoading } className={ getClassName() }>
        <Container>
          <Header { ...headerProps }>
            <DateFilter onSelected={ this.props.dateRangeChanged } />
          </Header>
          <Segment>
            <SemanticHeader>Call Outcome</SemanticHeader>
            <Divider />
            <OutcomeContainer { ...outcomeProps } />
          </Segment>
          <Segment>
            <SemanticHeader>Call Metrics</SemanticHeader>
            <Divider />
            <SummaryContainer { ...summaryProps } />
          </Segment>
          <Segment>
            <SemanticHeader>Call List</SemanticHeader>
            <Divider />
            <CallDataTableContainer { ...callDataTableContainerProps } />
          </Segment>
        </Container>
      </Page>
    );
  }
}

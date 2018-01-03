import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Divider,
  Header as SemanticHeader,
  Segment,
} from 'semantic-ui-react';

import { getClassNameGenerator } from '../../../utils/namespacing';
import Page from '../../../components/Page';
import Header from '../../../components/Header';
import SummaryContainer from '../containers/SummaryContainer';
import OutcomeContainer from '../containers/OutcomeContainer';
import EmployeeDataTableContainer from '../containers/EmployeeDataTableContainer';
import DateFilter from '../../../components/filters/DateFilter';

const displayName = 'Pages/Company';
const getClassName = getClassNameGenerator(displayName);

export default class EmployeeListPage extends Component {
  static displayName = displayName;

  static propTypes = {
    companyId: PropTypes.string,
    companyName: PropTypes.string,
    dateRangeChanged: PropTypes.func.isRequired,
    endDate: PropTypes.instanceOf(Date),
    startDate: PropTypes.instanceOf(Date),
  };

  render() {
    const {
      companyId,
      companyName,
      endDate,
      startDate,
    } = this.props;

    const employeeDataTableContainerProps = {
      companyId,
      companyName,
      endDate,
      startDate,
    };

    const outcomeProps = {
      companyId,
      endDate,
      startDate,
    };

    const summaryProps = {
      companyId,
      endDate,
      startDate,
    };

    const headerProps = {
      leftHeaderText: 'Company',
      leftSubHeaderText: 'View overall summary and statistics for each employee',
      rightHeaderText: companyName,
    };

    return (
      <Page className={ getClassName() }>
        <Container>
          <Header { ...headerProps }>
            <DateFilter onSelected={ this.props.dateRangeChanged } />
          </Header>
          <Segment>
            <SemanticHeader>Call Outcomes</SemanticHeader>
            <Divider />
            <OutcomeContainer { ...outcomeProps } />
          </Segment>
          <Segment>
            <SemanticHeader>Call Metrics</SemanticHeader>
            <Divider />
            <SummaryContainer { ...summaryProps } />
          </Segment>
          <Segment>
            <SemanticHeader>Employee List</SemanticHeader>
            <Divider />
            <EmployeeDataTableContainer { ...employeeDataTableContainerProps } />
          </Segment>
        </Container>
      </Page>
    );
  }
}

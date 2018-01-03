import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  Progress,
  Table,
} from 'semantic-ui-react';

import { getClassNameGenerator } from '../../../utils/namespacing';
import { formatTime } from '../../../utils/date';

import './CustomerTalkAnaysis.scss';

const displayName = 'Pages/Call/CustomerTalkAnaysis';
const getClassName = getClassNameGenerator(displayName);

export default class CustomerTalkAnaysis extends Component {
  static displayName = displayName;

  static propTypes = {
    call: ImmutablePropTypes.map,
  }

  getCustomerTalkReport = (call) => {
    const customerTalkTime = call.get('customerTalkTime') || 0;
    const employeeTalkTime = call.get('employeeTalkTime') || 0;
    const totalTalkTime = call.get('totalTalkTime') || 0;

    return (
      <Table basic="very" className={ getClassName({ child: 'table' }) }>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              Customer Talk Time
            </Table.Cell>
            <Table.Cell>
              { formatTime(customerTalkTime / 1000) }
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              Employee Talk Time
            </Table.Cell>
            <Table.Cell>
              { formatTime(employeeTalkTime / 1000) }
            </Table.Cell>
          </Table.Row>
          <Table.Row className="footer" >
            <Table.Cell>
              Total Talk Time
            </Table.Cell>
            <Table.Cell>
              { formatTime(totalTalkTime / 1000) }
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  };

  getCustomerTalkAnalysis = (call) => {
    const percent = ((call.get('customerTalkRatio') || 0) * 100).toFixed(1);
    const progressProps = {
      color: 'blue',
      percent,
      progress: true,
      size: 'large',
    };

    return (
      <div className={ getClassName({ child: 'talk' }) }>
        <p>
          Percent of time that the customer spoke versus the amount of time than
          the employee spoke. Typically, it should be greater than 60% of the time.
        </p>
        <Progress { ...progressProps } />
      </div>
    );
  };

  render() {
    const {
      call,
    } = this.props;

    return (
      <div className={ getClassName() }>
        { this.getCustomerTalkAnalysis(call) }
        { this.getCustomerTalkReport(call) }
      </div>
    );
  }
}


import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  Table,
} from 'semantic-ui-react';
import moment from 'moment';

import { getClassNameGenerator } from '../../../utils/namespacing';
import { formatPhoneNumber } from '../../../utils/types/Calls';

import './Info.scss';

const displayName = 'Pages/Call/Info';
const getClassName = getClassNameGenerator(displayName);

export default class Info extends Component {
  static displayName = displayName;

  static propTypes = {
    call: ImmutablePropTypes.map,
  }

  getCallInfo = (call) => {
    const createDate = call.get('createAt');
    const customerNumber = call.get('phoneNumber');
    const callOutcome = call.get('callOutcome') || '';

    return (
      <Table basic="very" className={ getClassName({ child: 'table' }) }>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              Create Date
            </Table.Cell>
            <Table.Cell>
              { moment(createDate).format('MM-DD-YYYY hh:mm a') }
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              Customer Number
            </Table.Cell>
            <Table.Cell>
              { formatPhoneNumber(customerNumber) }
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              Call Outcome
            </Table.Cell>
            <Table.Cell>
              { callOutcome }
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  };

  render() {
    const {
      call,
    } = this.props;

    return (
      <div className={ getClassName() }>
        { this.getCallInfo(call) }
      </div>
    );
  }
}


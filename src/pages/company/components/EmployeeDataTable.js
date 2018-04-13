import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router-dom';

import { getClassNameGenerator } from '../../../utils/namespacing';
import { Pagination } from '../../../models/Pagination';
import { formatTime, formatTimeSeparated } from '../../../utils/date';
import DataTable from '../../../components/data-table/DataTable';

const displayName = 'Pages/Company/EmployeeList';
const getClassName = getClassNameGenerator(displayName);

export default class Summary extends Component {
  static displayName = displayName;

  static propTypes = {
    changePagination: PropTypes.func.isRequired,
    changeSort: PropTypes.func.isRequired,
    employeeList: ImmutablePropTypes.list,
    isFetching: PropTypes.bool.isRequired,
    pagination: PropTypes.instanceOf(Pagination).isRequired,
    totalCount: PropTypes.number.isRequired,
  };

  buildColumns = () => {
    return [
      {
        name: 'displayName',
        render: (entry) => {
          const name = entry.get('displayName');
          const id = entry.get('id');
          return <Link to={ `/employee/${id}` }>{ name }</Link>;
        },
        text: 'Employee',
      },
      {
        dataIndex: 'totalCalls',
        name: 'totalCalls',
        text: 'Total Calls',
      },
      {
        name: 'totalCallTime',
        render: (entry) => {
          const value = entry.get('totalCallTime');
          const decimal = formatTime(value);
          const title = formatTimeSeparated(value);

          return <span title={ title }>{ decimal }</span>;
        },
        text: 'Total Call Time',
      },
      {
        dataIndex: 'totalConversations',
        name: 'totalConversations',
        text: 'Total Conversations',
      },
      {
        name: 'detectionRatio',
        render: (entry) => {
          const value = entry.get('detectionRatio');
          return `${(value * 100).toFixed(2)} %`;
        },
        text: 'Detection Ratio',
      },
      {
        name: 'customerTalkRatio',
        render: (entry) => {
          const value = entry.get('customerTalkRatio');
          return `${(value * 100).toFixed(2)} %`;
        },
        text: 'Customer Talk Ratio',
      },
      {
        name: 'conversationRatio',
        render: (entry) => {
          const totalCalls = entry.get('totalCalls');
          const totalConversations = entry.get('totalConversations');
          const ratio = totalCalls > 0 ? (totalConversations / totalCalls) : 0;
          
          return `${(ratio * 100).toFixed(2)} %`;
        },
        sortable: false,
        text: 'Conversation Ratio',
      },
    ];
  };

  render() {
    const {
      changePagination,
      changeSort,
      employeeList,
      isFetching,
      pagination,
      totalCount,
    } = this.props;

    const dataTableProps = {
      columns: this.buildColumns(),
      data: employeeList,
      isFetching,
      keyBy: '_id',
      onChangePagination: changePagination,
      onChangeSort: changeSort,
      pagination,
      totalCount,
    };

    return (
      <DataTable { ...dataTableProps } className={ getClassName() } />
    );
  }
}

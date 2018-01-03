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
        name: 'employeeName',
        render: (entry) => {
          const name = entry.get('employeeName');
          const id = entry.get('_id');
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
        name: 'totalRecordingDuration',
        render: (entry) => {
          const value = entry.get('totalRecordingDuration');
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
        name: 'scriptCompliance',
        render: (entry) => {
          const value = entry.get('scriptCompliance');
          return `${(value * 100).toFixed(2)} %`;
        },
        text: 'Call Strategy',
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
          const value = entry.get('conversationRatio');
          return `${(value * 100).toFixed(2)} %`;
        },
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

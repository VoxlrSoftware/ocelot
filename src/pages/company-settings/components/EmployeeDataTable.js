import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { getClassNameGenerator } from '../../../utils/namespacing';
import { Pagination } from '../../../models/Pagination';
import DataTable from '../../../components/data-table/DataTable';

const displayName = 'Pages/CompanySettings/EmployeeDataTable';
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
        dataIndex: 'email',
        name: 'email',
        text: 'Email',
      },
      {
        name: 'createdAt',
        render: (entry) => {
          const createDate = entry.get('createdAt');
          return moment(createDate).format('MM/DD/YYYY hh:mm');
        },
        text: 'Create Date',
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

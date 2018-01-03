import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import { getClassNameGenerator } from '../../../utils/namespacing';
import { Pagination } from '../../../models/Pagination';
import DataTable from '../../../components/data-table/DataTable';
import { formatPhoneNumber } from '../../../utils/types/Calls';
import { formatTime, formatTimeSeparated } from '../../../utils/date';
import { navigate } from '../../../globalActions';

import './CallDataTable.scss';

const displayName = 'Pages/Employee/CallList';
const getClassName = getClassNameGenerator(displayName);

export default class Summary extends Component {
  static displayName = displayName;

  static propTypes = {
    callList: ImmutablePropTypes.list,
    changePagination: PropTypes.func.isRequired,
    changeSort: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    pagination: PropTypes.instanceOf(Pagination).isRequired,
    totalCount: PropTypes.number.isRequired,
  };

  onRowClick = (entry) => {
    navigate(`/call/${entry.get('_id')}`);
  };

  getCustomClasses = (entry) => {
    const classes = [];

    if (!entry.get('isConversation')) {
      classes.push('non-conversation');
    }

    return classes;
  };

  buildColumns = () => {
    return [
      {
        name: 'createAt',
        render: (entry) => {
          const value = entry.get('createAt');
          return moment(value).format('MM-DD-YYYY hh:mm a');
        },
        text: 'Date',
      },
      {
        dataIndex: 'callTemplate',
        name: 'callTemplate',
        text: 'Call Template',
      },
      {
        name: 'phoneNumber',
        render: (entry) => {
          const phoneNumber = entry.get('phoneNumber') || '';
          return formatPhoneNumber(phoneNumber);
        },
        sortable: false,
        text: 'Phone Number',
      },
      {
        name: 'duration',
        render: (entry) => {
          const value = entry.get('duration');
          const decimal = formatTime(value);
          const title = formatTimeSeparated(value);

          return <span title={ title }>{ decimal }</span>;
        },
        text: 'Duration',
      },
      {
        name: 'callStrategy',
        render: (entry) => {
          const detected = entry.get('detectedPhraseCount');
          const total = entry.get('totalPhraseCount');
          const percent = detected > 0 ? ((detected / total) * 100) : 0;
          return `${detected}/${total} (${(percent).toFixed(1)} %)`;
        },
        text: 'Call Strategy',
      },
      {
        dataIndex: 'callOutcome',
        name: 'callOutcome',
        text: 'Call Outcome',
      },
      {
        name: 'customerTalkRatio',
        render: (entry) => {
          const value = entry.get('customerTalkRatio') || 0;
          const percent = value * 100;


          return `${percent.toFixed(1)} %`;
        },
        text: 'Customer Talk Ratio',
      },
    ];
  };

  render() {
    const {
      callList,
      changePagination,
      changeSort,
      isFetching,
      pagination,
      totalCount,
    } = this.props;

    const rowConfig = {
      getCustomClasses: this.getCustomClasses,
      onClick: this.onRowClick,
    };

    const dataTableProps = {
      className: getClassName(),
      columns: this.buildColumns(),
      data: callList,
      isFetching,
      keyBy: '_id',
      onChangePagination: changePagination,
      onChangeSort: changeSort,
      pagination,
      rowConfig,
      totalCount,
    };

    return (
      <DataTable { ...dataTableProps } className={ getClassName() } />
    );
  }
}

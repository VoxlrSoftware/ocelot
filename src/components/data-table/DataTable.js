import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import classnames from 'classnames';
import _ from 'lodash';
import {
  Dropdown,
  Grid,
  Icon,
  Loader,
  Menu,
  Table,
} from 'semantic-ui-react';

import { Pagination } from '../../models/Pagination';
import { getClassNameGenerator } from '../../utils/namespacing';
import {
  getAdjacentPage,
  getPaginationOptions,
  getTotalPages,
} from '../../utils/pagination';
import {
  SORT_ORDER_ASC,
  SORT_ORDER_DESC,
} from '../../Constants';

import './DataTable.scss';

const displayName = 'DataTable';
const getClassName = getClassNameGenerator(displayName);

export default class DataTable extends Component {
  static displayName = displayName;

  static defaultProps = {
    keyBy: '_id',
  };

  static propTypes = {
    className: PropTypes.string,
    columns: PropTypes.array.isRequired,
    data: ImmutablePropTypes.list,
    isFetching: PropTypes.bool,
    keyBy: PropTypes.string,
    onChangePagination: PropTypes.func,
    onChangeSort: PropTypes.func,
    pagination: PropTypes.instanceOf(Pagination).isRequired,
    rowConfig: PropTypes.object,
    totalCount: PropTypes.number,
  };

  getHeaders() {
    const {
      columns,
      pagination: {
        sortBy,
        sortOrder,
      },
    } = this.props;

    const columnHeaders = columns.map((column) => {
      const classes = {};
      let sortIcon;
      let headerParams = {
        key: column.name,
      };

      if (sortBy === column.name) {
        const order = sortOrder === SORT_ORDER_ASC ? 'up' : 'down';
        sortIcon = <Icon name={ `caret ${order}` } size="small" />;
      }

      if (!_.has(column, 'sortable') || column.sortable) {
        headerParams = {
          onClick: () => this._onChangeSort(column),
          ...headerParams,
        };
        classes.sortable = true;
      }

      return (
        <Table.HeaderCell { ...headerParams } className={ classnames(classes) }>
          { column.text }
          { sortIcon }
        </Table.HeaderCell>);
    });

    return (
      <Table.Header>
        <Table.Row>
          { columnHeaders }
        </Table.Row>
      </Table.Header>
    );
  }

  getCell(column, entry, index) {
    const {
      keyBy,
    } = this.props;

    const {
      dataIndex,
      onClick,
      render,
    } = column;

    const key = entry.has(keyBy) ? entry.get(keyBy) : index;
    let value;
    let classes = {};
    let cellProps = {
      key: `${column.name}-${key}`,
    };

    if (typeof dataIndex !== 'undefined') {
      if (entry.has(dataIndex)) value = entry.get(dataIndex);
    } else if (typeof render !== 'undefined') {
      value = render(entry);
    }

    const cellValue = typeof value !== 'undefined' ? value : '-';

    if (typeof onClick !== 'undefined') {
      cellProps = {
        onClick: () => onClick(entry),
        ...cellProps,
      };
      classes = {
        clickable: true,
        ...classes,
      };
    }

    return (
      <Table.Cell { ...cellProps } className={ classnames(classes) }>{ cellValue }</Table.Cell>
    );
  }

  getEmptyRow = (span) => {
    return (
      <Table.Row className={ getClassName({ child: 'noResultsRow' }) }>
        <Table.Cell colSpan={ `${span}` }>No results to display</Table.Cell>
      </Table.Row>
    );
  };

  getPaging = () => {
    const {
      pagination: {
        page,
        pageSize,
      },
      totalCount,
    } = this.props;

    const paginationOptions = getPaginationOptions({ page, pageSize, totalCount });
    const leftDisabled = paginationOptions[0] === page;
    const rightDisabled = paginationOptions[paginationOptions.length - 1] === page;

    const leftIcon = (
      <Menu.Item as="a" icon disabled={ leftDisabled } onClick={ () => this._pageBackward() }>
        <Icon name="left chevron" />
      </Menu.Item>
    );

    const rightIcon = (
      <Menu.Item as="a" icon disabled={ rightDisabled } onClick={ () => this._pageForward() }>
        <Icon name="right chevron" />
      </Menu.Item>
    );

    return (
      <Menu floated="right" size="small" compact pagination>
        { leftIcon }
        { paginationOptions.map((option) => {
          const disabled = option === page;
          return (<Menu.Item
            as="a"
            key={ option }
            disabled={ disabled }
            onClick={ () => this._setPage(option) }>{ option }</Menu.Item>);
        })}
        { rightIcon }
      </Menu>
    );
  };

  getFooter = (span) => {
    const {
      pagination: {
        page,
        pageSize,
      },
      totalCount,
    } = this.props;

    const dropdownProps = {
      compact: true,
      defaultValue: pageSize,
      onChange: (evt, data) => this._onChangePagination(data.value),
      options: [
        { text: '10', value: 10 },
        { text: '20', value: 20 },
        { text: '50', value: 50 },
        { text: '100', value: 100 },
      ],
      selection: true,
    };

    const totalPages = getTotalPages(totalCount, pageSize);

    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan={ `${span}` }>
            <Grid columns="equal">
              <Grid.Column>
                <span className={ getClassName({ child: 'showingLabel' }) }>Display Count:</span>
                <Dropdown { ...dropdownProps } />
              </Grid.Column>
              <Grid.Column width={ 6 } className={ getClassName({ child: 'displayCount' }) }>
                Page <b>{ page }</b> of <b>{ totalPages }</b>
                <span>({ totalCount } Results)</span>
              </Grid.Column>
              <Grid.Column>
                { this.getPaging() }
              </Grid.Column>
            </Grid>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  };

  getRow(columns, entry, index) {
    const {
      rowConfig,
    } = this.props;

    const cells = columns.map((column, idx) => {
      return this.getCell(column, entry, idx);
    });

    let classes = {};
    let customClasses = [];
    let rowProps = {
      key: index,
    };

    if (rowConfig) {
      const {
        onClick,
        getCustomClasses,
      } = rowConfig;

      if (onClick) {
        rowProps = {
          onClick: () => onClick(entry),
          ...rowProps,
        };
        classes = {
          clickable: true,
          ...classes,
        };
      }

      if (getCustomClasses) {
        customClasses = getCustomClasses(entry) || [];
      }
    }

    return (
      <Table.Row { ...rowProps } className={ classnames(classes, ...customClasses) }>
        { cells }
      </Table.Row>
    );
  }

  getRows(columns, data) {
    const rows = data.map((entry, idx) => {
      return this.getRow(columns, entry, idx);
    });

    return (
      <Table.Body>
        { rows.size ? rows : this.getEmptyRow(columns.length) }
      </Table.Body>
    );
  }

  _pageForward = () => {
    const {
      pagination: {
        page,
        pageSize,
      },
      totalCount,
    } = this.props;

    this._setPage(getAdjacentPage({ page, pageSize, totalCount }));
  }

  _pageBackward = () => {
    const {
      pagination: {
        page,
        pageSize,
      },
      totalCount,
    } = this.props;

    this._setPage(getAdjacentPage({ page, pageSize, totalCount }, true));
  };

  _setPage = (page) => {
    this._onChangePagination(null, page);
  };

  _onChangePagination = (newPageSize, newPage) => {
    const {
      onChangePagination,
      pagination: {
        page,
        pageSize,
      },
    } = this.props;

    if (onChangePagination) {
      const pageParams = {
        page: newPage || page,
        pageSize: newPageSize || pageSize,
      };

      onChangePagination(pageParams);
    }
  };

  _onChangeSort = (column) => {
    const {
      onChangeSort,
      pagination: {
        sortBy,
        sortOrder,
      },
    } = this.props;

    if (onChangeSort) {
      let nextSortOrder = SORT_ORDER_ASC;

      if (sortBy === column.name) {
        nextSortOrder = sortOrder === SORT_ORDER_ASC ? SORT_ORDER_DESC : SORT_ORDER_ASC;
      }

      const sortParams = {
        sortBy: column.name,
        sortOrder: nextSortOrder,
      };

      onChangeSort(sortParams);
    }
  };

  render() {
    const {
      className = '',
      columns,
      data,
      isFetching,
    } = this.props;

    if (!data) {
      return <Loader active size="huge" inline="centered" />;
    }

    return (
      <Table celled className={ classnames(getClassName(), className) }>
        { isFetching ? <Loader active size="huge" /> : null }
        { this.getHeaders() }
        { this.getRows(columns, data) }
        { this.getFooter(columns.length) }
      </Table>
    );
  }
}

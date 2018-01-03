import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown,
} from 'semantic-ui-react';
import classnames from 'classnames';
import { getClassNameGenerator } from '../../utils/namespacing';
import { DATE_RANGES } from '../../utils/date';

import './DateFilter.scss';

const displayName = 'DateFilter';
const getClassName = getClassNameGenerator(displayName);

const periods = {
  [DATE_RANGES.DAY]: 'Today',
  [DATE_RANGES.WEEK]: 'Current Week',
  [DATE_RANGES.MONTH]: 'Current Month',
  [DATE_RANGES.QUARTER]: 'Current Quarter',
};

export default class DateFilter extends Component {
  static displayName = displayName;

  static defaultProps = {
    defaultValue: periods[DATE_RANGES.WEEK],
  };

  static propTypes = {
    defaultValue: PropTypes.string,
    onSelected: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selection: props.defaultValue,
    };
  }

  getItems = () => {
    return Object.keys(periods).map((period) => {
      const props = {
        key: period,
        onClick: this._onItemClick,
        text: periods[period],
        value: period,
      };

      return (
        <Dropdown.Item { ...props } />
      );
    });
  };

  _onItemClick = (event, item) => {
    if (this.state.selection !== item.text) {
      this.setState({
        selection: item.text,
      });
      this.props.onSelected(item.value);
    }
  };

  render() {
    const title = this.state.selection;

    const dropdownProps = {
      button: true,
      className: classnames('icon', getClassName()),
      compact: true,
      floating: true,
      icon: 'filter',
      labeled: true,
      text: title,
    };

    return (
      <Dropdown { ...dropdownProps } >
        <Dropdown.Menu>
          { this.getItems() }
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

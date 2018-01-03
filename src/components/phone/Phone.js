import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IntlTelInput from 'react-intl-tel-input';

import './react-intl-tel.css';
import './Phone.scss';

import { getClassNameGenerator } from '../../utils/namespacing';

const displayName = 'Phone';
const getClassName = getClassNameGenerator(displayName);

export default class Phone extends Component {
  static displayName = displayName;

  static propTypes = {
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.string,
  }

  onChange = (valid, phoneNumber, country) => {
    const countryCode = `+${country.dialCode}`;
    const unformattedNumber = phoneNumber.replace(/[()-\s]*/g, '');
    const intlNumber = `${countryCode}${unformattedNumber.replace(countryCode, '')}`;

    this.props.onChange(intlNumber);
  };

  render() {
    const {
      onChange,
      placeholder,
      value,
    } = this.props;

    let intlTelInputProps = {
      css: [`intl-tel-input ui fluid input ${getClassName()}`],
      defaultCountry: 'us',
      format: true,
      formatOnInit: true,
      placeholder,
      preferredCountries: ['us'],
      value,
    };

    if (onChange) {
      intlTelInputProps = {
        onPhoneNumberChange: this.onChange,
        ...intlTelInputProps,
      };
    }

    return (
      <IntlTelInput { ...intlTelInputProps } />
    );
  }
}

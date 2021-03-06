import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
} from 'semantic-ui-react';

import { getClassNameGenerator } from '../../../utils/namespacing';

const displayName = 'Pages/CompanySettings/EmployeeDataTableToolbar';
const getClassName = getClassNameGenerator(displayName);

export default class Summary extends Component {
  static displayName = displayName;

  static propTypes = {
    createUser: PropTypes.func.isRequired,
    isCreating: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      firstName: '',
      lastName: '',
    };
  }

  setFirstName = (proxy, { value }) => {
    this.setState({
      firstName: value,
    });
  }

  setLastName = (proxy, { value }) => {
    this.setState({
      lastName: value,
    });
  }

  setEmail = (proxy, { value }) => {
    this.setState({
      email: value,
    });
  }

  clearFields = () => {
    this.setState({
      email: '',
      name: '',
    });
  }

  addEmployee() {
    const {
      createUser,
    } = this.props;

    createUser({
      ...this.state,
      onSuccess: this.clearFields,
    });
  }

  render() {
    const {
      isCreating,
    } = this.props;

    const buttonProps = {
      disabled: isCreating ||
        !this.state.firstName.length ||
        !this.state.lastName.length ||
        !this.state.email.length,
      loading: isCreating,
      onClick: () => this.addEmployee(),
      primary: true,
    };

    return (
      <Form className={ getClassName() }>
        <Form.Group widths="equal">
          <Form.Input placeholder="First Name" onChange={ this.setFirstName } value={ this.state.firstName } />
          <Form.Input placeholder="Last Name" onChange={ this.setLastName } value={ this.state.lastName } />
          <Form.Input placeholder="Email" onChange={ this.setEmail } value={ this.state.email } />
          <Form.Button { ...buttonProps }>Add Employee</Form.Button>
        </Form.Group>
      </Form>
    );
  }
}

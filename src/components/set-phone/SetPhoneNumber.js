import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import {
  Button,
  Grid,
  Icon,
  Input,
  Message,
  Modal,
} from 'semantic-ui-react';

import Phone from '../phone/Phone';
import Alert, { ALERT_TYPE } from '../alert/Alert';
import { Thunk } from '../../models/Thunk';
import { getClassNameGenerator } from '../../utils/namespacing';
import { formatPhoneNumber } from '../../utils/types/Calls';

const displayName = 'SetPhoneNumber';
const getClassName = getClassNameGenerator(displayName);

export default class SetPhoneNumber extends Component {
  static displayName = displayName;

  static defaultProps = {
    show: false,
  };

  static propTypes = {
    checkForValidationResult: PropTypes.func.isRequired,
    currentNumber: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onNumberSet: PropTypes.func.isRequired,
    params: PropTypes.object,
    phoneValidation: PropTypes.instanceOf(Thunk).isRequired,
    phoneVerification: PropTypes.instanceOf(Thunk).isRequired,
    show: PropTypes.bool,
    validatePhoneNumber: PropTypes.func.isRequired,
    validateType: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      extension: '',
      phoneNumber: '',
    };
  }

  componentWillMount() {
    this.timeout = null;
  }

  componentWillReceiveProps(nextProps) {
    this.maybeStartPoll(nextProps);
  }

  componentWillUnmount() {
    this.stopPoll();
  }

  getAlert() {
    const {
      phoneValidation,
    } = this.props;

    if (phoneValidation.hasError) {
      const alertProps = {
        header: 'Unable to verify',
        icon: 'warning sign',
        message: phoneValidation.error.message,
        type: ALERT_TYPE.ERROR,
      };

      return (
        <Alert { ...alertProps } />
      );
    }

    return null;
  }

  getValidation = (validationCode) => {
    return (
      <Message icon>
        <Icon name="circle notched" loading />
        <Message.Content>
          <Message.Header>Validation Code: { validationCode }</Message.Header>
          We are calling your phone to validate. Please enter the code when prompted.
        </Message.Content>
      </Message>
    );
  }

  getPhoneNumberGrid() {
    const {
      currentNumber,
      phoneValidation,
    } = this.props;

    const validateProps = {
      disabled: !this.state.phoneNumber.length,
      loading: phoneValidation.isFetching,
      onClick: this.verify,
    };

    return (
      <Grid className="form-grid">
        <Grid.Row verticalAlign="middle">
          <Grid.Column width={ 4 } className="label">
            Current
          </Grid.Column>
          <Grid.Column width={ 7 }>
            <Input fluid placeholder="No Value Set" readOnly value={ formatPhoneNumber(currentNumber) } />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row verticalAlign="middle">
          <Grid.Column width={ 4 } className="label">
            New
          </Grid.Column>
          <Grid.Column width={ 7 }>
            <Phone onChange={ this.setNumber } />
          </Grid.Column>
          <Grid.Column width={ 5 }>
            <Input fluid placeholder="Extension" type="number" onChange={ this.setExtension } />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row verticalAlign="middle">
          <Grid.Column width={ 16 } textAlign="right">
            <Button primary { ...validateProps }>Verify Phone Number</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  setNumber = (value) => {
    this.setState({
      phoneNumber: value,
    });
  }

  setExtension = (value) => {
    this.setState({
      extension: value,
    });
  }

  verify = () => {
    this.props.validatePhoneNumber({
      extension: this.state.extension,
      onNumberSet: this.props.onNumberSet,
      params: this.props.params,
      phoneNumber: this.state.phoneNumber,
      type: this.props.validateType,
    });
  };

  pollForVerification = (props) => {
    const {
      checkForValidationResult,
      onNumberSet,
      validateType,
    } = props;

    checkForValidationResult({
      onNumberSet,
      type: validateType,
    });
  };

  stopPoll() {
    if (this.timeout) {
      clearInterval(this.timeout);
      this.timeout = null;
    }
  }

  maybeStartPoll(props) {
    const {
      checkForValidationResult,
      onNumberSet,
      phoneValidation,
      phoneVerification,
      validateType,
    } = props;

    const validationData = phoneValidation.data || Immutable.Map();
    const verificationData = phoneVerification.data || Immutable.Map();

    if (verificationData.get('hasVerified') || (this.timeout && !validationData.get('validationCode'))) {
      return this.stopPoll();
    }

    if (this.timeout) {
      return;
    }

    if (validationData.get('validationCode')) {
      this.timeout = setInterval(() => {
        checkForValidationResult({
          onNumberSet,
          type: validateType,
        });
      }, 5000);
    }
  }

  render() {
    const {
      onClose,
      phoneValidation,
      show,
    } = this.props;

    const modalProps = {
      closeOnDimmerClick: false,
      dimmer: 'blurring',
      onClose,
      open: show,
      size: 'small',
    };

    const validationCode = phoneValidation.data && phoneValidation.data.get('validationCode');

    return (
      <Modal { ...modalProps } className={ getClassName() }>
        <Modal.Header>
          Set Phone Number
        </Modal.Header>
        <Modal.Content>
          { this.getAlert() }
          <p>Setting your phone number allows outgoing calls to appear to
            come from this number, making it feel more official and also
            providing clients with a number to call back.</p>
          { validationCode ? this.getValidation(validationCode) : this.getPhoneNumberGrid() }
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={ onClose }>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

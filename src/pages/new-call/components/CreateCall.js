import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  Button,
  Dropdown,
  Input,
  Grid,
} from 'semantic-ui-react';
import SetPhoneNumberContainer from '../../../components/set-phone/SetPhoneNumberContainer';
import DialerContainer from '../../../components/dialer/DialerContainer';
import Phone from '../../../components/phone/Phone';

import { formatPhoneNumber, getPhoneNumber } from '../../../utils/types/Calls';
import { getClassNameGenerator } from '../../../utils/namespacing';
import { getStrategyByName } from '../../../utils/types/Company';
import { VOXLR_PHONE } from '../../../Constants';

import './CreateCall.scss';

const displayName = 'Pages/NewCall/Create';
const getClassName = getClassNameGenerator(displayName);

export default class CallStrategyList extends Component {
  static displayName = displayName;

  static propTypes = {
    account: ImmutablePropTypes.map,
    callActive: PropTypes.bool.isRequired,
    cancelSetPhoneNumber: PropTypes.func.isRequired,
    company: ImmutablePropTypes.map,
    connectRecording: PropTypes.func.isRequired,
    connectToVoice: PropTypes.func.isRequired,
    onStrategySelected: PropTypes.func,
    recordingSocketState: ImmutablePropTypes.map.isRequired,
    requestId: PropTypes.string,
    requestNewCall: PropTypes.func.isRequired,
    requestSetPhoneNumber: PropTypes.func.isRequired,
    selectedStrategy: PropTypes.string,
    setAccountStale: PropTypes.func.isRequired,
    showDialer: PropTypes.bool.isRequired,
    showModal: PropTypes.bool,
    startRecording: PropTypes.func.isRequired,
    stopRecording: PropTypes.func.isRequired,
    twilioConnection: PropTypes.object,
    twilioIsReady: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.requestId && this.props.requestId) {
      console.log('made it here with request', this.props.requestId);
      // this.startTwilioCall(this.props, requestId);
    }

    if (!prevProps.callActive && this.props.callActive) {
      const {
        twilioConnection: {
          mediaStream: {
            callSid,
          },
        },
      } = this.props;
      // this.props.startRecording(callSid);
    }

    if (prevProps.callActive && !this.props.callActive) {
      const {
        twilioConnection: {
          mediaStream: {
            callSid,
          },
        },
      } = prevProps;
      // this.props.stopRecording({ callSid });
    }
  }

  onNumberSet = () => {
    this.props.setAccountStale();
  }

  onStrategyChange = (evt, data) => {
    this.props.onStrategySelected(data.value);
  };

  getDropdownProps() {
    const {
      company,
      selectedStrategy,
    } = this.props;

    const callStrategies = company.get('callStrategies');

    const options = callStrategies.map((strategy, index) => {
      return {
        key: index,
        text: strategy.get('name'),
        value: strategy.get('name'),
      };
    }).toJS();

    return {
      onChange: this.onStrategyChange,
      options,
      value: selectedStrategy,
    };
  }

  getCallerID() {
    const {
      company,
      account,
    } = this.props;

    const userPhone = getPhoneNumber(account);
    if (userPhone) {
      return userPhone;
    }

    const companyPhone = getPhoneNumber(company);
    if (companyPhone) {
      return companyPhone;
    }

    return VOXLR_PHONE;
  }

  getCallerIDFormatted() {
    return formatPhoneNumber(this.getCallerID());
  }

  getCallForm() {
    const {
      twilioIsReady,
    } = this.props;

    const dropdownProps = this.getDropdownProps();

    const startCallProps = {
      disabled: !twilioIsReady,
      loading: !twilioIsReady,
      onClick: this.startCall,
    };

    return (
      <Grid className="form-grid">
        <Grid.Row verticalAlign="middle">
          <Grid.Column width={ 5 } className="label">
            Caller ID
          </Grid.Column>
          <Grid.Column width={ 8 }>
            <Input fluid readOnly value={ this.getCallerIDFormatted() } />
          </Grid.Column>
          <Grid.Column width={ 3 }>
            <Button fluid onClick={ this.showModal }>Set</Button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row verticalAlign="middle">
          <Grid.Column width={ 5 } className="label">
            Call Strategy
          </Grid.Column>
          <Grid.Column width={ 11 }>
            <Dropdown placeholder="Select Call Strategy" selection fluid { ...dropdownProps } />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row verticalAlign="middle">
          <Grid.Column width={ 5 } className="label">
            Customer Number
          </Grid.Column>
          <Grid.Column width={ 11 }>
            <Phone onChange={ this.setNumber } />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row verticalAlign="middle">
          <Grid.Column width={ 16 } textAlign="right">
            <Button primary { ...startCallProps }>Start Call</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  getDialer() {
    const {
      company,
      selectedStrategy,
      showDialer,
    } = this.props;

    const selectedStrategyObj = getStrategyByName(company.get('callStrategies'), selectedStrategy);

    const dialerProps = {
      callStrategy: selectedStrategyObj,
      onClose: () => this.setState({
        showDialer: false,
      }),
      phoneNumber: this.state.phoneNumber,
      show: showDialer,
    };

    return (
      <DialerContainer { ...dialerProps } />
    );
  }

  setNumber = (value) => {
    this.setState({
      phoneNumber: value,
    });
  }

  showModal = () => {
    this.props.requestSetPhoneNumber();
  };

  startTwilioCall = (props, callRequest) => {
    const {
      account,
      company,
      connectToVoice,
      selectedStrategy,
    } = props;

    const selectedStrategyObj = getStrategyByName(company.get('callStrategies'), selectedStrategy);

    connectToVoice({
      accountId: account.get('id'),
      callStrategyId: selectedStrategyObj.get('id'),
      callerId: this.getCallerID(),
      companyId: company.get('id'),
      companyName: company.get('name'),
      customerNumber: this.state.phoneNumber,
    });
  }

  startCall = () => {
    const {
      account,
      company,
      requestNewCall,
      connectRecording,
      selectedStrategy,
      twilioIsReady,
    } = this.props;

    if (!selectedStrategy || !this.state.phoneNumber || !twilioIsReady) {
      return;
    }

    const selectedStrategyObj = getStrategyByName(company.get('callStrategies'), selectedStrategy);

    requestNewCall({
      callerId: this.getCallerID(),
      customerNumber: this.state.phoneNumber,
      strategyId: selectedStrategyObj.get('id'),
      userId: account.get('id'),
    });

    // connectRecording({
    //   afterConnect: this.startTwilioCall.bind(this, this.props),
    // });
    this.startTwilioCall(this.props);
  };

  hideModal = () => {
    this.props.cancelSetPhoneNumber();
  }

  render() {
    const {
      account,
      showModal,
    } = this.props;

    const setPhoneNumberProps = {
      currentNumber: getPhoneNumber(account),
      entityId: account.get('id'),
      onClose: this.hideModal,
      onNumberSet: this.onNumberSet,
      show: showModal,
      validateType: 'user',
    };

    return (
      <div className={ getClassName({ child: 'talk' }) }>
        <p>
        Fill out the following fields to start a new call.
        The selected strategy will display during the call.
        </p>
        { this.getCallForm() }
        <SetPhoneNumberContainer { ...setPhoneNumberProps } />
        { this.getDialer() }
      </div>
    );
  }
}


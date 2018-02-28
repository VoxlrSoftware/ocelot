import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  Button,
  Grid,
  Header,
  Input,
  Modal,
} from 'semantic-ui-react';

import { getClassNameGenerator } from '../../utils/namespacing';
import { formatPhoneNumber } from '../../utils/types/Calls';
import { formatTimeSeparated } from '../../utils/date';
import { CALL_OUTCOMES } from '../../Constants';

import CallStrategyList from '../CallStrategyList';

import './Dialer.scss';

const callOutcomes = [
  CALL_OUTCOMES.WON,
  CALL_OUTCOMES.PROGRESS,
  CALL_OUTCOMES.LOST,
  CALL_OUTCOMES.VOICEMAIL,
];

const displayName = 'Dialer';
const getClassName = getClassNameGenerator(displayName);

export default class Dialer extends Component {
  static displayName = displayName;

  static propTypes = {
    callStrategy: ImmutablePropTypes.map,
    completeCall: PropTypes.func.isRequired,
    connection: PropTypes.object,
    disconnectToVoice: PropTypes.func.isRequired,
    heartbeat: PropTypes.number,
    isCallActive: PropTypes.bool,
    isCallComplete: PropTypes.bool,
    muteConnection: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    phoneNumber: PropTypes.string,
    sendDigit: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    unmuteConnection: PropTypes.func.isRequired,
    updateCallByCallSid: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      digits: '',
      time: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.show !== nextProps.show) {
      this.setState({
        digits: '',
        time: 0,
      });
    }

    this.checkStartTime(this.props.connection, nextProps.connection);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.show !== nextProps.show) ||
      (this.props.isCallActive !== nextProps.isCallActive) ||
      (this.props.isCallComplete !== nextProps.isCallComplete) ||
      (this.props.connection && !nextProps.connection) ||
      (!this.props.connection && nextProps.conection) ||
      (this.props.heartbeat !== nextProps.heartbeat) ||
      (this.state !== nextState);
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  getButton = (value) => {
    const {
      isCallActive,
    } = this.props;

    const buttonProps = {
      disabled: !isCallActive,
      onClick: () => this.sendDigit(value),
    };

    return (
      <Grid.Column>
        <Button { ...buttonProps }>{ value }</Button>
      </Grid.Column>
    );
  }

  getDigitEntry() {
    const inputProps = {
      fluid: true,
      readOnly: true,
      size: 'large',
      value: this.state.digits,
    };

    return (
      <Input { ...inputProps } />
    );
  }

  getButtonGrid() {
    const gridProps = {
      columns: 'equal',
      stackable: false,
      textAlign: 'center',
    };

    return (
      <Grid { ...gridProps } className={ getClassName({ child: 'buttonGrid' }) }>
        <Grid.Row>
          { this.getButton('1') }
          { this.getButton('2') }
          { this.getButton('3') }
        </Grid.Row>
        <Grid.Row>
          { this.getButton('4') }
          { this.getButton('5') }
          { this.getButton('6') }
        </Grid.Row>
        <Grid.Row>
          { this.getButton('7') }
          { this.getButton('8') }
          { this.getButton('9') }
        </Grid.Row>
        <Grid.Row>
          { this.getButton('*') }
          { this.getButton('0') }
          { this.getButton('#') }
        </Grid.Row>
      </Grid>
    );
  }

  getCallStrategyList() {
    const {
      callStrategy,
    } = this.props;

    const callStrategyListProps = {
      callStrategy,
    };

    return (
      <CallStrategyList { ...callStrategyListProps } />
    );
  }

  getCallOutcome() {
    return (
      <div className={ getClassName({ child: 'callOutcome' }) }>
        <Header>Call Outcome</Header>
        <p>Select the most appropriate call outcome to complete the call.</p>
        {
          callOutcomes.map((outcome) => {
            return (
              <Button fluid key={ outcome.value } onClick={ () => this.setOutcome(outcome.value) }>
                { outcome.text }
              </Button>
            );
          })
        }
      </div>
    );
  }

  getActionGrid() {
    const {
      connection,
      isCallActive,
    } = this.props;

    const isMuted = connection && connection.isMuted();

    const gridProps = {
      columns: 'equal',
      stackable: false,
      textAlign: 'center',
    };

    const muteProps = {
      color: 'teal',
      content: isMuted ? 'Unmute' : 'Mute',
      disabled: !isCallActive,
      floated: 'left',
      icon: isMuted ? 'microphone slash' : 'microphone',
      labelPosition: 'left',
      onClick: this.toggleMute,
      size: 'large',
    };

    const endProps = {
      color: 'red',
      content: 'Hang Up',
      disabled: !isCallActive,
      floated: 'right',
      icon: 'text telephone',
      labelPosition: 'right',
      onClick: this.disconnect,
      size: 'large',
    };

    return (
      <Grid { ...gridProps } className={ getClassName({ child: 'actionGrid' }) }>
        <Grid.Row>
          <Grid.Column>
            <Button { ...muteProps } />
            <Button { ...endProps } />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  getCallTime = () => {
    return (
      <span className={ getClassName({ child: 'callTime' }) }>
        { formatTimeSeparated(this.state.time) }
      </span>
    );
  }

  setOutcome = (value) => {
    const {
      connection,
      completeCall,
    } = this.props;

    const {
      mediaStream: {
        callSid,
      },
    } = connection;

    const newValues = {
      callOutcome: value,
    };

    this.props.updateCallByCallSid({
      callSid,
      newValues,
    });
    completeCall();
  };

  clearTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  startTimer = () => {
    this.clearTimer();

    this.timer = setInterval(() => {
      this.setState({
        time: this.state.time + 1,
      });
    }, 1000);
  };

  checkStartTime = (currentConnection, newConnection) => {
    const currentStatus = currentConnection && currentConnection.status();
    const newStatus = newConnection && newConnection.status();

    if (newStatus === 'open' && newStatus !== currentStatus) {
      this.startTimer();
    }
  }

  toggleMute = (event) => {
    event.preventDefault();

    const {
      connection,
      muteConnection,
      unmuteConnection,
    } = this.props;

    if (connection.isMuted()) {
      unmuteConnection();
    } else {
      muteConnection();
    }

    return true;
  }

  sendDigit = (value) => {
    this.props.sendDigit(value);
    this.setState({
      digits: this.state.digits + value,
    });
  };

  disconnect = () => {
    const {
      disconnectToVoice,
      isCallActive,
    } = this.props;

    if (isCallActive) {
      disconnectToVoice();
      this.clearTimer();
    }
  }

  compareConnections = (currentConnection, newConnection) => {
    if (currentConnection !== newConnection) {
      return true;
    }

    const currentMute = currentConnection && currentConnection.isMuted();
    const newMute = newConnection && newConnection.isMuted();

    if (currentMute !== newMute) {
      return true;
    }

    return false;
  }

  render() {
    const {
      isCallComplete,
      onClose,
      phoneNumber,
      show,
    } = this.props;

    const showModal = show || isCallComplete;

    const modalProps = {
      closeOnDimmerClick: false,
      dimmer: 'blurring',
      onClose,
      open: showModal,
    };

    return (
      <Modal { ...modalProps }>
        <Modal.Header>
          Call To: { formatPhoneNumber(phoneNumber) }
          { this.getCallTime() }
        </Modal.Header>
        <Modal.Content>
          <div className={ getClassName() }>
            <div className="dialerCol">
              { this.getDigitEntry() }
              { this.getButtonGrid() }
              { this.getActionGrid() }
            </div>
            <div className="strategyCol">
              { isCallComplete ? this.getCallOutcome() : this.getCallStrategyList() }
            </div>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

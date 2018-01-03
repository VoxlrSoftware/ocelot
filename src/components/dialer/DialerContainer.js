import { connect } from 'react-redux';

import Dialer from './Dialer';

import {
  getTwilioCallActive,
  getTwilioCallComplete,
  getTwilioConnectionHeartbeat,
  getTwilioConnectionState,
} from '../../reducers/TwilioReducer';
import {
  completeCall,
  disconnectToVoice,
  muteConnection,
  sendDigit,
  unmuteConnection,
} from '../../actions/TwilioActions';
import {
  updateCallByCallSid,
} from '../../actions/CallActions';

const mapStateToProps = (state) => {
  const isCallActive = getTwilioCallActive(state);
  const isCallComplete = getTwilioCallComplete(state);
  const connection = getTwilioConnectionState(state).data;
  const heartbeat = getTwilioConnectionHeartbeat(state);

  return {
    connection,
    heartbeat,
    isCallActive,
    isCallComplete,
  };
};

const mapDispatchToProps = {
  completeCall,
  disconnectToVoice,
  muteConnection,
  sendDigit,
  unmuteConnection,
  updateCallByCallSid,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dialer);

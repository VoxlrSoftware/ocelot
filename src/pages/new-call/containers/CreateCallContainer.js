import { connect } from 'react-redux';
import fetch from '../../../utils/redux/fetch';

import { setAccountStale } from '../../../actions/AccountActions';
import {
  cancelSetPhoneNumber,
  getTwilioClientToken,
  requestSetPhoneNumber,
} from '../../../actions/PhoneActions';
import {
  getShowSetPhoneModal,
  getTwilioToken,
} from '../../../reducers/PhoneReducer';
import {
  connectToVoice,
  setupTwilio,
} from '../../../actions/TwilioActions';
import {
  getTwilioCallActive,
  getTwilioConnectionState,
  getTwilioIsReady,
} from '../../../reducers/TwilioReducer';
import {
  connect as connectRecording,
  startRecording,
  stopRecording,
} from '../../../actions/RecordingActions';
import {
  getRecordingSocketState,
} from '../../../reducers/RecordingReducer';

import CreateCall from '../components/CreateCall';

const mapStateToProps = (state) => {
  const showModal = getShowSetPhoneModal(state);
  const twilioToken = getTwilioToken(state);
  const twilioIsReady = getTwilioIsReady(state);
  const twilioConnectionState = getTwilioConnectionState(state);
  const recordingSocketState = getRecordingSocketState(state);

  const showDialer = twilioConnectionState.isFetching || !!twilioConnectionState.data;
  const twilioConnection = twilioConnectionState.data;
  const callActive = getTwilioCallActive(state);

  return {
    callActive,
    recordingSocketState,
    showDialer,
    showModal,
    twilioConnection,
    twilioIsReady,
    twilioToken,
  };
};

const mapDispatchToProps = {
  cancelSetPhoneNumber,
  connectRecording,
  connectToVoice,
  getTwilioClientToken,
  requestSetPhoneNumber,
  setAccountStale,
  setupTwilio,
  startRecording,
  stopRecording,
};

const fetchFn = (props) => {
  const {
    getTwilioClientToken,
    setupTwilio,
    twilioToken,
  } = props;

  const promises = [
    getTwilioClientToken(),
  ];

  if (twilioToken.data) {
    promises.push(setupTwilio({ twilioToken: twilioToken.data }));
  }

  return Promise.all(promises);
};

export default connect(mapStateToProps, mapDispatchToProps)(fetch(fetchFn)(CreateCall));

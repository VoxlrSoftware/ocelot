import Immutable from 'immutable';
import {
  createReducer,
  createStateSelector,
} from '../utils/redux/reducers';
import {
  RECORDING_SOCKET_CONNECTED,
  RECORDING_SOCKET_CONNECT_REQUESTED,
  RECORDING_SOCKET_DISCONNECTED,
  RECORDING_SOCKET_ERROR,
  RECORDING_STREAM_CONNECTED,
} from '../actionTypes';

export const stateKey = 'recording';

const recordingInitialState = Immutable.fromJS({
  isConnected: false,
  isConnecting: false,
  socket: null,
});

const micStreamInitialState = Immutable.fromJS({
  echoStream: null,
  isStreaming: false,
  stream: null,
});

const initialState = Immutable.fromJS({
  micStream: micStreamInitialState,
  recordingSocket: recordingInitialState,
});

const onRecordingSocketConnectRequested = (state, { payload }) => {
  const {
    socket,
  } = payload;

  const recording = state.get('recordingSocket');

  return state.set('recordingSocket', recording.merge({
    isConnecting: true,
    socket,
  }));
};

const onRecordingSocketConnected = (state) => {
  const recording = state.get('recordingSocket');

  return state.set('recordingSocket', recording.merge({
    isConnected: true,
    isConnecting: false,
  }));
};

const onRecordingSocketDisconnected = () => initialState;

const onRecordingStreamConnected = (state, { payload }) => {
  const {
    echoStream,
    stream,
  } = payload;

  const micStream = state.get('micStream');

  return state.set('micStream', micStream.merge({
    echoStream,
    isStreaming: true,
    stream,
  }));
};

export default createReducer(initialState, {
  [RECORDING_SOCKET_CONNECTED]: onRecordingSocketConnected,
  [RECORDING_SOCKET_CONNECT_REQUESTED]: onRecordingSocketConnectRequested,
  [RECORDING_SOCKET_DISCONNECTED]: onRecordingSocketDisconnected,
  [RECORDING_SOCKET_ERROR]: onRecordingSocketDisconnected,
  [RECORDING_STREAM_CONNECTED]: onRecordingStreamConnected,
});

const recordingState = state => state[stateKey];

export const getRecordingSocketState = createStateSelector(recordingState, 'recordingSocket');
export const getMicStreamState = createStateSelector(recordingState, 'micStream');

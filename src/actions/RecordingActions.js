import Socket from 'socket.io-client';
import stream from 'stream';
import getUserMedia from 'get-user-media-promise';
import MicrophoneStream from 'microphone-stream';
import WebAudiol16Stream from 'watson-speech/speech-to-text/webaudio-l16-stream';
import { RECORDING_URL, VOXLR_URL } from '../Constants';
import {
  RECORDING_SOCKET_CONNECTED,
  RECORDING_SOCKET_CONNECT_REQUESTED,
  RECORDING_SOCKET_DISCONNECTED,
  RECORDING_SOCKET_ERROR,
  RECORDING_STREAM_CONNECTED,
  RECORDING_STREAM_ERROR,
} from '../actionTypes';
import { createFailureNotification } from '../utils/notification';
import {
  getMicStreamState,
  getRecordingSocketState,
} from '../reducers/RecordingReducer';

const START_COMMAND = 'start';
const START_COMMAND_MESSAGE = 'stream ready';

const STOP_COMMAND = 'stop';

const CALL_INIT_COMMAND = 'callInit';

const onConnect = (dispatch, socket, afterConnect) => {
  dispatch({
    type: RECORDING_SOCKET_CONNECTED,
  });

  socket.emit(START_COMMAND, START_COMMAND_MESSAGE, () => {
    afterConnect();
  });
};

const onDisconnect = (dispatch) => {
  dispatch({
    type: RECORDING_SOCKET_DISCONNECTED,
  });
};

const onError = (dispatch, error) => {
  dispatch({
    notification: createFailureNotification({
      error,
      header: 'Recording Error',
      message: 'An error occurred while trying to record the call',
    }),
    payload: {
      error,
    },
    type: RECORDING_SOCKET_ERROR,
  });
};

const onConnectRequested = (payload) => {
  return {
    payload,
    type: RECORDING_SOCKET_CONNECT_REQUESTED,
  };
};

export const connect = (config) => {
  const {
    afterConnect,
  } = config;

  return (dispatch, getState) => {
    const socketState = getRecordingSocketState(getState());

    if (socketState.get('isConnected') || socketState.get('isConnecting')) {
      return;
    }

    const socket = Socket(RECORDING_URL, {
      reconnection: false,
      rejectUnauthorized: false,
      transports: ['websocket'],
    });
    socket.on('connect', () => onConnect(dispatch, socket, afterConnect));
    socket.on('disconnect', () => onDisconnect(dispatch));
    socket.on('error', error => onError(dispatch, error));

    return dispatch(onConnectRequested({ socket }));
  };
};

const isConnected = (socketState) => {
  return socketState.get('isConnected') && socketState.get('socket');
};

const getCallData = (callSid) => {
  return {
    callback: VOXLR_URL,
    sid: callSid,
  };
};

export const stopRecording = (config) => {
  const {
    callSid,
  } = config;

  return (dispatch, getState) => {
    const state = getState();
    const socketState = getRecordingSocketState(state);
    const micState = getMicStreamState(state);

    if (!isConnected(socketState)) {
      return;
    }

    const stream = micState.get('stream');
    const echoStream = micState.get('echoStream');

    try {
      stream.stop();
    } catch (e) { console.log('Unable to stop mic stream', e); }

    try {
      echoStream.end();
    } catch (e) { console.log('Unable to stop echo stream', e); }

    const socket = socketState.get('socket');
    socket.emit(STOP_COMMAND, getCallData(callSid), () => {
      socket.disconnect();
    });
  };
};

const emit = (socket, key, message) => {
  socket.emit(key, message);
};

const emitCallSid = (socket, callSid) => emit(socket, CALL_INIT_COMMAND, getCallData(callSid));

const onStreamError = (error) => {
  return {
    notification: createFailureNotification({
      error,
      header: 'Recording Error',
      message: 'An error occurred while trying to record the call',
    }),
    payload: {
      error,
    },
    type: RECORDING_STREAM_ERROR,
  };
};

const onStreamConnected = (payload) => {
  return {
    payload,
    type: RECORDING_STREAM_CONNECTED,
  };
};

export const startRecording = (callSid) => {
  return (dispatch, getState) => {
    const state = getState();
    const socketState = getRecordingSocketState(state);
    const micStreamState = getMicStreamState(state);

    if (!isConnected(socketState)) {
      return;
    }

    if (micStreamState.get('isStreaming')) {
      return;
    }

    const socket = socketState.get('socket');
    const micStream = new MicrophoneStream({ objectMode: true });
    const echoStream = new stream.Writable();

    echoStream._write = (chunk, encoding, done) => {
      const data = Array.from(new Int16Array(chunk.buffer));
      try {
        socket.emit('audio stream', {
          data,
        });
      } catch (e) {
        console.log(e);
      }
      done();
    };

    micStream.on('format', (format) => {
      const l16stream = new WebAudiol16Stream({
        downsample: true,
        objectMode: true,
        sourceSampleRate: format.sampleRate,
      });
      micStream.pipe(l16stream).pipe(echoStream);
    });

    getUserMedia({ audio: true, video: false })
      .then((stream) => {
        micStream.setStream(stream);
        emitCallSid(socket, callSid);
        dispatch(onStreamConnected({
          echoStream,
          stream: micStream,
        }));
      }).catch((error) => {
        console.log(error);
        dispatch(onStreamError(error));
      });
  };
};

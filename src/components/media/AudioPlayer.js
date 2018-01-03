import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactAudioPlayer from 'react-audio-player';
import {
  Loader,
} from 'semantic-ui-react';

import { getClassNameGenerator } from '../../utils/namespacing';

import './AudioPlayer.scss';

const displayName = 'AudioPlayer';
const getClassName = getClassNameGenerator(displayName);

export default class AudioPlayer extends Component {
  static displayName = displayName;

  static propTypes = {
    src: PropTypes.string,
  };

  render() {
    const {
      src,
    } = this.props;

    return (
      <div className={ getClassName() }>
        {
          (!src || !src.length) ?
            (<Loader active inline />) :
            (<ReactAudioPlayer src={ src } controls preload="auto" />)
        }
      </div>
    );
  }
}

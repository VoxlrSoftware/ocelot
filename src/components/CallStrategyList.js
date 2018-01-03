import React, { Component } from 'react';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  Segment,
} from 'semantic-ui-react';

import { getClassNameGenerator } from '..//utils/namespacing';

import './CallStrategyList.scss';

const displayName = 'CallStrategyList';
const getClassName = getClassNameGenerator(displayName);

export default class CallStrategyList extends Component {
  static displayName = displayName;

  static propTypes = {
    callStrategy: ImmutablePropTypes.map,
  }

  getEmptyPhrase = (callStrategy) => {
    return (
      <Segment className="empty">
        {
          callStrategy ?
            'No phrases exist for selected call strategy' :
            'Selected a call strategy to view phrases'
        }
      </Segment>
    );
  };

  getCallStrategyPhrase = (phrase, index) => {
    return (
      <Segment key={ index }>
        { phrase }
      </Segment>
    );
  };

  getCallStrategyList() {
    const {
      callStrategy,
    } = this.props;

    let phrases = Immutable.List();

    if (callStrategy) {
      phrases = callStrategy.get('phrases') || Immutable.List();
    }

    return (
      <Segment.Group piled className={ getClassName({ child: 'phrases' }) }>
        {
          phrases.size ?
            phrases.map(this.getCallStrategyPhrase) :
            this.getEmptyPhrase(callStrategy)
        }
      </Segment.Group>
    );
  }

  render() {
    const {
      callStrategy,
    } = this.props;

    const name = callStrategy ? callStrategy.get('name') : '';

    return (
      <div className={ getClassName() }>
        <div className="label-group">
          <span>Strategy Name:</span>
          <span>{ name }</span>
        </div>
        { this.getCallStrategyList() }
      </div>
    );
  }
}


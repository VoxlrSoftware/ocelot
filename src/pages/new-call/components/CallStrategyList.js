import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  Segment,
} from 'semantic-ui-react';

import { getClassNameGenerator } from '../../../utils/namespacing';

import './CallStrategyList.scss';

const displayName = 'Pages/NewCall/StrategyList';
const getClassName = getClassNameGenerator(displayName);

export default class CallStrategyList extends Component {
  static displayName = displayName;

  static propTypes = {
    callStrategies: ImmutablePropTypes.list,
    selectedStrategy: PropTypes.string,
  }

  getEmptyPhrase = (selectedStrategy) => {
    return (
      <Segment className="empty">
        {
          selectedStrategy ?
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
      callStrategies,
      selectedStrategy,
    } = this.props;

    let phrases = Immutable.List();

    if (callStrategies && selectedStrategy) {
      const strategy = callStrategies.find((strategy) => {
        return strategy.get('name') === selectedStrategy;
      });

      phrases = strategy.get('phrases') || Immutable.List();
    }

    return (
      <Segment.Group piled className={ getClassName({ child: 'phrases' }) }>
        {
          phrases.size ?
            phrases.map(this.getCallStrategyPhrase) :
            this.getEmptyPhrase(selectedStrategy)
        }
      </Segment.Group>
    );
  }

  render() {
    return (
      <div className={ getClassName({ child: 'talk' }) }>
        <p>
        These are questions and comments that your manager requires to be said on each call
        </p>
        { this.getCallStrategyList() }
      </div>
    );
  }
}


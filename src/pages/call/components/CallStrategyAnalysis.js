import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import classnames from 'classnames';
import {
  Icon,
  Grid,
  Progress,
  Segment,
} from 'semantic-ui-react';

import { getClassNameGenerator } from '../../../utils/namespacing';

import './CallStrategyAnalysis.scss';

const displayName = 'Pages/Call/CallStrategyAnalysis';
const getClassName = getClassNameGenerator(displayName);

export default class CallStrategyAnaysis extends Component {
  static displayName = displayName;

  static propTypes = {
    call: ImmutablePropTypes.map,
  }

  getCallStrategyPhrase = (phrase) => {
    const detected = !!phrase.get('detected');

    const classes = {
      detected,
    };

    return (
      <Segment key={ phrase.get('id') } className={ classnames(classes) }>
        <Grid>
          <Grid.Row>
            <Grid.Column width={ 13 }>
              { phrase.get('wholephrase') }
            </Grid.Column>
            <Grid.Column width={ 3 }>
              { detected ? <Icon name="checkmark box" size="large" /> : null }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  };

  getCallStrategyAnalysis = (call) => {
    const percent = ((call.get('callStrategy') || 0) * 100).toFixed(1);
    const progressProps = {
      color: 'blue',
      percent,
      progress: true,
      size: 'large',
    };

    return (
      <div className={ getClassName({ child: 'talk' }) }>
        <p>
          Questions that were identified on the call will be highlighted
        </p>
        <Progress { ...progressProps } />
      </div>
    );
  };

  render() {
    const {
      call,
    } = this.props;

    const phrases = call.get('callStrategyPhrases');

    return (
      <div className={ getClassName() }>
        { this.getCallStrategyAnalysis(call) }
        <Segment.Group piled className={ getClassName({ child: 'phrases' }) }>
          { phrases.map(this.getCallStrategyPhrase) }
        </Segment.Group>
      </div>
    );
  }
}


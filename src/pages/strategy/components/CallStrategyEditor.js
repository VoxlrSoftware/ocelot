import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  Button,
  Icon,
  Segment,
} from 'semantic-ui-react';

import TextAreaEditor from '../../../components/editor/TextAreaEditor';
import { getClassNameGenerator } from '../../../utils/namespacing';

import './CallStrategyEditor.scss';

const displayName = 'Pages/CallStrategy/Edit';
const getClassName = getClassNameGenerator(displayName);
const placeholderText = 'Start typing...';

export default class CallStrategyEditor extends Component {
  static displayName = displayName;

  static propTypes = {
    callStrategy: ImmutablePropTypes.map,
    isSaving: PropTypes.bool.isRequired,
    onStrategySave: PropTypes.func.isRequired,
  };

  state = {
    phrases: Immutable.List(),
  };

  componentDidMount() {
    this.getPhrases(this.props.callStrategy);
  }

  componentWillReceiveProps(nextProps) {
    this.getPhrases(nextProps.callStrategy);
  }

  getPhrases(callStrategy) {
    if (callStrategy) {
      this.setState({
        phrases: callStrategy.get('phrases') || Immutable.List(),
      });
    }
  }

  getPhraseEditor = (phrase, index) => {
    const editorProps = {
      onChange: value => this.updatePhrase(index, value),
      placeholderValue: placeholderText,
      value: phrase,
    };

    return (
      <TextAreaEditor { ...editorProps } className="editor" />
    );
  };

  getCallStrategyPhrase = (phrase, index) => {
    const closeProps = {
      name: 'delete',
      onClick: () => this.removePhrase(index),
    };

    return (
      <Segment key={ index }>
        <Icon { ...closeProps } />
        { this.getPhraseEditor(phrase, index) }
      </Segment>
    );
  };

  getAddNewPhrase() {
    const buttonProps = {
      fluid: true,
      onClick: this.addPhrase,
    };

    return (
      <Button { ...buttonProps }>
        Add a new phrase or question
      </Button>
    );
  }

  getStrategyList() {
    const {
      callStrategy,
    } = this.props;

    if (!callStrategy) {
      return null;
    }

    return (
      <div className={ getClassName({ child: 'list' }) }>
        { this.state.phrases.map(this.getCallStrategyPhrase) }
        { this.getAddNewPhrase() }
      </div>
    );
  }

  getActionBar() {
    const {
      callStrategy,
      isSaving,
    } = this.props;

    if (!callStrategy) {
      return null;
    }

    const hasChanged = this.state.phrases !== callStrategy.get('phrases');

    const resetProps = {
      disabled: !hasChanged || isSaving,
      onClick: this.reset,
    };

    const saveProps = {
      disabled: !hasChanged || isSaving,
      loading: isSaving,
      onClick: this.save,
    };

    return (
      <div className={ getClassName({ child: 'actionBar' }) }>
        <Button secondary { ...resetProps }>Reset</Button>
        <Button primary { ...saveProps }>Save</Button>
      </div>
    );
  }

  addPhrase = () => {
    this.setState({
      phrases: this.state.phrases.push(placeholderText),
    });
  };

  updatePhrase = (index, value) => {
    this.setState({
      phrases: this.state.phrases.set(index, value),
    });
  }

  reset = () => {
    this.getPhrases(this.props.callStrategy);
  }

  removePhrase = (index) => {
    this.setState({
      phrases: this.state.phrases.delete(index),
    });
  };

  save = () => {
    const {
      callStrategy,
      onStrategySave,
    } = this.props;

    const validPhrases = this.state.phrases
      .filter(x => x !== placeholderText);

    const newCallStrategy = callStrategy.set('phrases', validPhrases);

    onStrategySave(newCallStrategy);
  };

  render() {
    const {
      callStrategy,
    } = this.props;

    const name = callStrategy ? callStrategy.get('name') : '<Select a Strategy>';

    return (
      <div className={ getClassName() }>
        <div className="label-group">
          <span>Strategy Name:</span>
          <span>{ name }</span>
        </div>
        { this.getStrategyList() }
        { this.getActionBar() }
      </div>
    );
  }
}

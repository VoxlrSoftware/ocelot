import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextareaAutosize from 'react-autosize-textarea';
import classnames from 'classnames';

import { getClassNameGenerator } from '../../utils/namespacing';

import './TextAreaEditor.scss';

const displayName = 'TextAreaEditor';
const getClassName = getClassNameGenerator(displayName);

export default class TextAreaEditor extends Component {
  static displayName = displayName;

  static propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholderValue: PropTypes.string,
    value: PropTypes.string,
  };

  static defaultProps = {
    value: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      value: props.value,
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick); // eslint-disable-line 
    document.addEventListener('keydown', this.handleKey); // eslint-disable-line 
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.value) {
      this.setState({
        isEditing: false,
        value: nextProps.value,
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick); // eslint-disable-line 
    document.removeEventListener('keydown', this.handleKey); // eslint-disable-line 
  }

  getEditor() {
    const value =
      this.state.value === this.props.placeholderValue ?
        '' :
        this.state.value;

    const textAreaProps = {
      autoFocus: true,
      onChange: e => this.updateState(e.target.value),
      value,
    };

    return (
      <TextareaAutosize { ...textAreaProps } />
    );
  }

  getContent() {
    return (
      <div
        role="button"
        tabIndex={ 0 }
        onClick={ this.showEditor }
        className="content">
        { this.state.value }
      </div>
    );
  }

  handleClick = (e) => {
    if (this.state.isEditing && this.wrapper && !this.wrapper.contains(e.target)) {
      this.hideEditor();
    }
  };

  handleKey = (e) => {
    if (this.state.isEditing) {
      switch (e.keyCode) {
        case 13:
        case 27: {
          e.preventDefault();
          this.hideEditor();
          break;
        }
        default:
      }
    }
    return true;
  };

  hideEditor = () => {
    this.setState({
      isEditing: false,
    });
    this.props.onChange(this.state.value);
  }

  showEditor = () => {
    this.setState({
      isEditing: true,
    });
  };

  updateState = (value) => {
    this.setState({
      value,
    });
  };

  render() {
    const classes = classnames(getClassName(), this.props.className);

    return (
      <div className={ classes } ref={ wrapper => this.wrapper = wrapper }>
        { this.state.isEditing ?
          this.getEditor() :
          this.getContent() }
      </div>
    );
  }
}

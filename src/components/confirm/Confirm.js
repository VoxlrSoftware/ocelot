import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
} from 'semantic-ui-react';

import { getClassNameGenerator } from '../../utils/namespacing';

const displayName = 'Confirm';
const getClassName = getClassNameGenerator(displayName);

export default class Confirm extends Component {
  static displayName = displayName;

  static defaultProps = {
    cancelText: 'No',
    confirmText: 'Yes',
  };

  static propTypes = {
    cancelText: PropTypes.string,
    confirmText: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    prompt: PropTypes.node.isRequired,
    show: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
  }

  render() {
    const {
      cancelText,
      confirmText,
      onCancel,
      onConfirm,
      prompt,
      show,
      title,
    } = this.props;

    const modalProps = {
      closeOnDimmerClick: false,
      open: show,
      size: 'small',
    };

    return (
      <Modal { ...modalProps } className={ getClassName() } >
        <Modal.Header>
          { title }
        </Modal.Header>
        <Modal.Content>
          { prompt }
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={ onCancel }>{ cancelText }</Button>
          <Button positive onClick={ onConfirm }>{ confirmText }</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

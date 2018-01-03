import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Icon,
  Message,
  Segment,
} from 'semantic-ui-react';
import _ from 'lodash';
import { CSSTransitionGroup } from 'react-transition-group';

import './Alert.scss';

import { getClassNameGenerator } from '../../utils/namespacing';

const displayName = 'Alert';
const getClassName = getClassNameGenerator(displayName);

export const ALERT_TYPE = {
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

export const DEFAULT_TIMEOUT = 5000;

export default class Alert extends Component {
  static displayName = displayName;

  static defaultProps = {
    animate: true,
    autoCloseTimeout: null,
    controlled: false,
    isCloseable: true,
    show: false,
    transitionName: 'notification',
    type: ALERT_TYPE.INFO,
  };

  static propTypes = {
    animate: PropTypes.bool,
    autoCloseTimeout: PropTypes.number,
    controlled: PropTypes.bool,
    header: PropTypes.node,
    hiddenMessage: PropTypes.node,
    icon: PropTypes.string,
    isCloseable: PropTypes.bool,
    message: PropTypes.node,
    onClose: PropTypes.func,
    show: PropTypes.bool,
    transitionName: PropTypes.string,
    type: PropTypes.oneOf(_.values(ALERT_TYPE)),
  }

  constructor(props) {
    super(props);
    this.state = {
      show: props.controlled ? props.show : true,
      showHidden: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props, nextProps)) {
      this.setState({
        show: nextProps.controlled ? nextProps.show : true,
        showHidden: false,
      });
    }

    if (nextProps.autoCloseTimeout) {
      this.startTimeout(nextProps.autoCloseTimeout);
    }
  }

  onDismiss = () => {
    const {
      controlled,
    } = this.props;

    if (!controlled) {
      this.setState({
        show: false,
        showHidden: false,
      });
    }

    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  getIconFromType = (type) => {
    switch (type) {
      case ALERT_TYPE.ERROR: return 'warning circle';
      case ALERT_TYPE.WARNING: return 'help circle';
      case ALERT_TYPE.INFO: return 'info circle';
      default: return null;
    }
  }

  getIcon() {
    const {
      icon,
      type,
    } = this.props;

    const iconName = icon || this.getIconFromType(type);

    return iconName &&
      (
        <Grid.Column width={ 1 } className="icon-col">
          <Icon name={ iconName } />
        </Grid.Column>
      );
  }

  getHeader() {
    const {
      header,
    } = this.props;

    return header &&
      <Message.Header>{ header }</Message.Header>;
  }

  getHiddenMessage() {
    const {
      hiddenMessage,
    } = this.props;

    if (!this.state.showHidden) {
      return null;
    }

    return (
      <Grid.Row>
        <Grid.Column stretched className="hidden-message-col">
          <Segment>
            { hiddenMessage }
          </Segment>
        </Grid.Column>
      </Grid.Row>
    );
  }

  getMessage() {
    const {
      hiddenMessage,
      isCloseable,
      message,
      type,
    } = this.props;

    if (!this.state.show) {
      return null;
    }

    const messageProps = {
      floating: true,
      onDismiss: isCloseable && this.onDismiss,
      [type]: true,
    };

    const messageContent = message ? (
      <div>
        { message }
        { (hiddenMessage && !this.state.showHidden) ?
          <a
            className="showMore"
            role="link"
            tabIndex={ 0 }
            onClick={ () => this.setState({ showHidden: true }) }>...Show More</a>
          : null }
      </div>
    ) : null;

    return (
      <Message { ...messageProps } key="message">
        <Grid columns="equal">
          <Grid.Row>
            { this.getIcon() }
            <Grid.Column stretched className="message-col">
              { this.getHeader() }
              { messageContent }
            </Grid.Column>
          </Grid.Row>
          { this.getHiddenMessage() }
        </Grid>
      </Message>
    );
  }

  getTransitionProps() {
    const {
      transitionName,
    } = this.props;

    return {
      transitionAppear: true,
      transitionAppearTimeout: 300,
      transitionEnter: false,
      transitionLeave: true,
      transitionLeaveTimeout: 300,
      transitionName,
    };
  }

  startTimeout = (timeout) => {
    const {
      onClose,
    } = this.props;

    this.clearTimeout();
    this.timeout = setTimeout(() => {
      onClose();
    }, timeout);
  }

  clearTimeout = () => {
    if (this.autoTimeout) {
      clearTimeout(this.autoTimeout);
      this.autoTimeout = null;
    }
  }

  render() {
    const {
      animate,
    } = this.props;

    let content;

    if (animate) {
      content = (
        <CSSTransitionGroup { ...this.getTransitionProps() }>
          { this.getMessage() }
        </CSSTransitionGroup>
      );
    } else {
      content = this.getMessage();
    }

    return (
      <div className={ getClassName() }>
        { content }
      </div>
    );
  }
}

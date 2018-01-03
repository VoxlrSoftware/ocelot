import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

export default class RenderToBody extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  componentDidMount() {
    this.bodyComponent = document.createElement('div'); // eslint-disable-line
    this.bodyComponent.className = 'body-rendered no-dim';
    document.body.appendChild(this.bodyComponent); // eslint-disable-line
    this._renderLayer();
  }

  componentDidUpdate() {
    this._renderLayer();
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.bodyComponent);
    document.body.removeChild(this.bodyComponent); // eslint-disable-line
  }

  _renderLayer() {
    ReactDOM.render(this.props.children, this.bodyComponent);
  }

  render() {
    return <div />;
  }
}

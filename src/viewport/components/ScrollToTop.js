import { Component } from 'react';
import PropTypes from 'prop-types';

const displayName = 'ScrollToTop';

export default class ScrollToTop extends Component {
  static displayName = displayName;

  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
  };

  componentDidUpdate(prevProps) {
    if (this.props.children.props.location !== prevProps.children.props.location) {
      window.scrollTo(0, 0); // eslint-disable-line
    }
  }

  render() {
    return this.props.children;
  }
}

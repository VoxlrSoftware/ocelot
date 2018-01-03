import React, { Component } from 'react';
import classnames from 'classnames';
import { PropTypes } from 'prop-types';
import {
  Loader,
} from 'semantic-ui-react';
import scriptLoader from 'react-async-script-loader';
import { getClassNameGenerator } from '../utils/namespacing';

import './Page.scss';

const displayName = 'Page';
const getClassName = getClassNameGenerator(displayName);

const getPage = (hasLoadScripts = false) => {
  return class Page extends Component {
    static displayName = displayName;

    static propTypes = {
      children: PropTypes.node,
      className: PropTypes.string,
      isLoading: PropTypes.bool,
      isScriptLoadSucceed: PropTypes.bool,
      isScriptLoaded: PropTypes.bool,
    };

    static defaultProps = {
      className: {},
    };

    constructor(props) {
      super(props);
      this.state = {
        scriptsLoaded: !hasLoadScripts,
      };
    }

    componentDidMount() {
      const { isScriptLoaded, isScriptLoadSucceed } = this.props;
      if (isScriptLoaded && isScriptLoadSucceed) {
        this.updateLoadState(isScriptLoadSucceed);
      }
    }

    componentWillReceiveProps({ isScriptLoaded, isScriptLoadSucceed }) {
      if (isScriptLoaded && !this.props.isScriptLoaded) {
        this.updateLoadState(isScriptLoadSucceed);
      }
    }

    updateLoadState(isScriptLoadSucceed) {
      if (isScriptLoadSucceed) {
        this.setState({
          scriptsLoaded: true,
        });
      } else {
        console.error('Unable to load page dependencies'); // eslint-disable-line
      }
    }

    render() {
      const {
        children,
        className,
        isLoading,
      } = this.props;

      const classes = classnames(
        getClassName(),
        className,
      );

      return (
        <div className={ classes }>
          { (isLoading || !this.state.scriptsLoaded) ? <Loader active /> : children }
        </div>
      );
    }
  };
};

export const PageWithScripts = (...scripts) => {
  return scriptLoader(...scripts)(getPage(scripts.length));
};

export default getPage();

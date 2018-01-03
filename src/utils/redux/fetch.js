import React, { Component } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { shallowEquals } from '../Immutable';

export default function fetch(fetchFn) {
  return (WrappedComponent) => {
    class Container extends Component {
      static displayName = `Fetch||${WrappedComponent.displayName}`;

      constructor(props) {
        super(props);
        this.WrappedComponent = WrappedComponent;
      }

      componentWillMount() {
        this.fetch(this.props);
      }

      componentWillReceiveProps(nextProps) {
        if (!shallowEquals(this.props, nextProps)) {
          this.fetch(nextProps);
        }
      }

      shouldComponentUpdate(nextProps, nextState) {
        return !shallowEquals(this.props, nextProps) ||
          !shallowEquals(this.state, nextState);
      }

      fetch = (nextProps) => {
        const fetchPromise = fetchFn(nextProps);
        Promise.resolve(fetchPromise);
      };

      render() {
        return <this.WrappedComponent { ...this.props } />;
      }
    }

    return hoistNonReactStatic(Container, WrappedComponent);
  };
}

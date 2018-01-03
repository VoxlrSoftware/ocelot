import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import './lib/init.js';

import VoxlrPageContainer from './viewport/containers/VoxlrPageContainer';

export default class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <div>Hello</div>
        <VoxlrPageContainer />
      </Provider>
    );
  }
}

import React, { Component, PropTypes } from 'react';

import {ipcRenderer} from 'electron';

export default class App extends Component {

  constructor(){
    super();
    ipcRenderer.send('react-app-started');
  }

  static propTypes = {
    children: PropTypes.element.isRequired
  };

  render() {
    return (
      <div>
        {this.props.children}
        {
          (() => {
            if (process.env.NODE_ENV !== 'production') {
              const DevTools = require('./DevTools');
              return <DevTools />;
            }
          })()
        }
      </div>
    );
  }
}

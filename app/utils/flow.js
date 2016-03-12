
import {ipcRenderer} from 'electron';

import * as ActionTypes from '../constants/ActionTypes';
import storage from 'electron-json-storage';
import _ from 'lodash';

const remote = require('remote').remote;

export default function({getState, dispatch}){
  return (next) => (action) => {

    const returnValue = next(action);

    switch(action.type){

      case ActionTypes.RESET:
        ipcRenderer.send('setup')
      break;

      case ActionTypes.REFRESH_REPOSITORIES:
        ipcRenderer.send('refreshRepositories');
      break;

      case ActionTypes.ADD_REPOSITORIES:
        ipcRenderer.send('resizeCornerWindow');
      break;

      case ActionTypes.RESIZE_CORNER_WINDOW:
        ipcRenderer.send('resizeCornerWindow');
      break;

      case ActionTypes.RERUN_SETUP:
        ipcRenderer.send('setup');
      break;

    }

    return returnValue;
  }
}

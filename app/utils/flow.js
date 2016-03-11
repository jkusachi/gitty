
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

      case ActionTypes.ADD_REPOSITORIES:
        ipcRenderer.send('resizeCornerWindow');
    }

    return returnValue;
  }
}

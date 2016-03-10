
import {ipcRenderer} from 'electron';

import * as setupActions from '../actions/setup';
import * as ActionTypes from '../constants/ActionTypes';
import storage from 'electron-json-storage';
import _ from 'lodash';

const remote = require('remote').remote;

export default function({getState, dispatch}){
  return (next) => (action) => {

    const returnValue = next(action);

    switch(action.type){

      case ActionTypes.RESET:
        console.log('ipc render clear');
        ipcRenderer.send('setup')
    }

    return returnValue;
  }
}

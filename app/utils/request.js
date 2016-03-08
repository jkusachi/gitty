
import * as setupActions from '../actions/setup';

import * as ActionTypes from '../constants/ActionTypes';

const remote = require('remote').remote;

import storage from 'electron-json-storage';

export default function({getState, dispatch}){
  return (next) => (action) => {

    const returnValue = next(action);

    switch(action.type){

      case ActionTypes.GET_REPOSITORIES:
        var data = storage.get('repositories');

        storage.get('repositories', function(err, data){
          if(err) throw err;
          console.log('- storage has data: ', data);
          dispatch(setupActions.saveRepositories(data));
        });

        //dispatch(setupActions.saveRepositories(data))
        break;

      case ActionTypes.SAVE_REPOSITORIES:
        dispatch(setupActions.setLoading());
        storage.set('repositories', action.data);
        console.log('saving data ', action.data);
        dispatch(setupActions.finishLoading());
        break;
    }

    return returnValue;
  }
}

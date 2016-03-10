
import * as setupActions from '../actions/setup';
import * as ActionTypes from '../constants/ActionTypes';
import storage from 'electron-json-storage';
import _ from 'lodash';

const remote = require('remote').remote;

export default function({getState, dispatch}){
  return (next) => (action) => {

    const returnValue = next(action);

    switch(action.type){

      case ActionTypes.GET_REPOSITORIES:

        storage.get('repositories', function(err, data){
          if(err) throw err;
          console.log('- storage has data: ', data);
          if(!_.isEmpty(data))
            dispatch(setupActions.saveRepositories(data));
        });

        //dispatch(setupActions.saveRepositories(data))
        break;

      case ActionTypes.CLEAR_REPOSITORIES:
        storage.remove('repositories', function(err, data){
          if(err) throw err;
          dispatch(setupActions.reset())
        });

      case ActionTypes.SAVE_REPOSITORIES:
        dispatch(setupActions.setLoading());

        storage.set('repositories', action.data, function(err,data){
          dispatch(setupActions.finishLoading());
        });

        break;
    }

    return returnValue;
  }
}

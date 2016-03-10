
import * as repositoryActions from '../actions/repositories';
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
            dispatch(repositoryActions.saveRepositories(data));
        });

        //dispatch(repositoryActions.saveRepositories(data))
        break;

      case ActionTypes.CLEAR_REPOSITORIES:
        storage.remove('repositories', function(err, data){
          if(err) throw err;
          dispatch(repositoryActions.reset())
        });

      case ActionTypes.SAVE_REPOSITORIES:
        dispatch(repositoryActions.setLoading());

        storage.set('repositories', action.data, function(err,data){
          dispatch(repositoryActions.finishLoading());
        });

        break;
    }

    return returnValue;
  }
}

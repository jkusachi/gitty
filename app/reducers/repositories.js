
import {
  ADD_REPOSITORIES,
  SAVE_STATUS,
  CLEAR_REPOSITORIES,
  GET_REPOSITORIES,
  SAVE_REPOSITORIES,
  SET_LOADING,
  FINISH_LOADING
}
from '../constants/ActionTypes';

import update from 'react-addons-update';
import _ from 'lodash';

const initialState = {
  repos: [],
  isLoading: false
};


export default function repositories(state = initialState, action){

  switch(action.type){

    case GET_REPOSITORIES:
      return state;

    case CLEAR_REPOSITORIES:
      return Object.assign({}, state, {repos: null });

    case SAVE_STATUS:
      var status = action.data.status;

      return update(state, {
        repos: {
          [action.data.index]: {
            $merge: {
              status: status
            }
          }
        }
      });

    case SAVE_REPOSITORIES:

      var newList = _.map(action.data, (item) => _.create({},{ path: item}) );

      return Object.assign({}, state, {
        repos: newList
      });

    case ADD_REPOSITORIES:

      var newList = state.repos.concat ( _.map(action.data, function(item){
        return _.create({},{ path: item});
      }) );

      return Object.assign({}, state, {
        repos: newList
      });

    case SET_LOADING:
      return Object.assign({}, state, { isLoading: true });

    case FINISH_LOADING:
      return Object.assign({}, state, { isLoading: false });

    default:
      return state;
  }

}

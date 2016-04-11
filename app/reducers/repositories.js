
import {
  SET_ITEM_LOADING,
  FINISH_ITEM_LOADING,
  SET_DIRTY,
  REMOVE_REPOSITORY,
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


    case SET_DIRTY:
      return Object.assign({}, state, {
        repos: state.repos.map( (repo, index) => {
          if(index === action.data.index){
            return Object.assign({}, repo, {
              isDirty: action.data.status
            })
          }
          return repo;
        })
      });

    case SAVE_STATUS:
      var status = action.data.status;

      if(!state.repos[action.data.index])
        return state;

      return update(state, {
        repos: {
          [action.data.index]: {
            $merge: {
              status: status
            }
          }
        }
      });

    case SET_ITEM_LOADING:
      var indexToUpdate = action.data;
      return Object.assign({}, state, {
        repos: state.repos.map( (repo, index) => {
          if(index === indexToUpdate){
            return Object.assign({}, repo, {
              isLoading: true
            })
          }
          return repo;
        })
      });

    case FINISH_ITEM_LOADING:
      var indexToUpdate = action.data;
      return Object.assign({}, state, {
        repos: state.repos.map( (repo, index) => {
          if(index === indexToUpdate){
            return Object.assign({}, repo, {
              isLoading: false
            })
          }
          return repo;
        })
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

    case REMOVE_REPOSITORY:
      //action.data is the index to be removed
      return update(state, {
        repos: {
          $splice: [ [action.data, 1] ]
        }
      })

    case SET_LOADING:
      return Object.assign({}, state, { isLoading: true });

    case FINISH_LOADING:
      return Object.assign({}, state, { isLoading: false });

    default:
      return state;
  }

}

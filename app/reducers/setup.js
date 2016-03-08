
import {
  CLEAR_REPOSITORIES,
  GET_REPOSITORIES,
  SAVE_REPOSITORIES,
  SET_LOADING,
  FINISH_LOADING
}
from '../constants/ActionTypes';

const initialState = {
  repos: [],
  isLoading: false
};

export default function setup(state = initialState, action){

  switch(action.type){

    case GET_REPOSITORIES:
      return state;

    case CLEAR_REPOSITORIES:
      return Object.assign({}, state, {repos: null });

    case SAVE_REPOSITORIES:
      let newList = (state.repos || []).concat(action.data);
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

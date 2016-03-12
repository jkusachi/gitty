
import * as ActionTypes from '../constants/ActionTypes';

export function setLoading(){
  return {
    type: ActionTypes.SET_LOADING
  }
}

export function finishLoading(){
  return {
    type: ActionTypes.FINISH_LOADING
  }
}

export function setDirty(index, status){
  return {
    type: ActionTypes.SET_DIRTY,
    data: {
      index,
      status
    }
  }
}

export function completeSetup(){
  return {
    type: ActionTypes.COMPLETE_SETUP
  };
}

export function getRepositories(){
  return {
    type: ActionTypes.GET_REPOSITORIES
  }
}


export function clearRepositories(){
  return {
    type: ActionTypes.CLEAR_REPOSITORIES
  };
}

export function addRepositories(repos){
  return {
    type: ActionTypes.ADD_REPOSITORIES,
    data: repos
  };
}


export function saveRepositories(repos){
  return {
    type: ActionTypes.SAVE_REPOSITORIES,
    data: repos
  };
}

export function removeRepository(index){
  return {
    type: ActionTypes.REMOVE_REPOSITORY,
    data: index
  };
}


export function rerunSetup(){
  return {
    type: ActionTypes.RERUN_SETUP
  };
}


export function refreshRepositories(){
  return {
    type: ActionTypes.REFRESH_REPOSITORIES
  };
}

export function saveStatus(status){
  return {
    type: ActionTypes.SAVE_STATUS,
    data: status
  }
}

export function reset(){
  return {
    type: ActionTypes.RESET
  };
}

export function resizeCornerWindow(){
  return {
    type: ActionTypes.RESIZE_CORNER_WINDOW
  }
}

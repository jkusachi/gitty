import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import setup from './setup';

const rootReducer = combineReducers({
  counter,
  routing,
  setup
});

export default rootReducer;

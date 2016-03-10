import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import repositories from './repositories';

const rootReducer = combineReducers({
  counter,
  routing,
  repositories
});

export default rootReducer;

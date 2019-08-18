import { combineReducers } from 'redux';

import eventReducer from './eventReducer';
import serviceReducer from './serviceProviders';

const rootReducer = combineReducers({
  event: eventReducer,
  service: serviceReducer
});

export default rootReducer;

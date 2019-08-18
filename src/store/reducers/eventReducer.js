// import action types
import {
  LOAD_ALL_EVENTS_IN_A_MONTH,
  POST_EVENT_IN_DB
} from '../types/eventTypes';

const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ALL_EVENTS_IN_A_MONTH: {
      return { ...state, ...action.payload };
    }
    default:
      return { ...state };
  }
};

export default reducer;

import { LOAD_ALL_SERVICE_PROVIDERS } from '../types/eventTypes';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ALL_SERVICE_PROVIDERS:
      return { ...state, ...action.payload };
    default:
      return { ...state };
  }
};

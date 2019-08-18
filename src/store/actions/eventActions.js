import * as firebase from 'firebase';

// load all action types
import {
  LOAD_ALL_SERVICE_PROVIDERS,
  POST_EVENT_IN_DB
} from '../types/eventTypes';

// load firebase configuration from environment
const {
  REACT_APP_API_KEY,
  REACT_APP_AUTH_DOMAIN,
  REACT_APP_DATABASE_URL,
  REACT_APP_PROJECT_ID,
  REACT_APP_STORAGE_BUCKET,
  REACT_APP_MESSAGING_SENDER_ID,
  REACT_APP_APP_ID
} = process.env;

/**
 * Initialize Firebase SDK
 */
firebase.initializeApp({
  apiKey: REACT_APP_API_KEY,
  authDomain: REACT_APP_AUTH_DOMAIN,
  databaseURL: REACT_APP_DATABASE_URL,
  projectId: REACT_APP_PROJECT_ID,
  storageBucket: REACT_APP_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_MESSAGING_SENDER_ID,
  appId: REACT_APP_APP_ID
});
const firestore = firebase.firestore();

export const loadAllEventsInAMonth = () => dispatch => {
  return new Promise((resolve, reject) => {
    firestore
      .collection('service')
      .get()
      .then(doc => {
        let allDocs = doc.docs;
        for (let i in allDocs) allDocs[i] = allDocs[i].data();
        dispatch({ type: LOAD_ALL_SERVICE_PROVIDERS, payload: allDocs });
        resolve();
      })
      .catch(error => {
        console.log(error);
        reject();
      });
  });
};

export const postEventInDB = (
  data,
  title,
  description,
  venue,
  serviceProdivers
) => dispatch => {
  return new Promise((resolve, reject) => {
    // API call
    dispatch({ type: POST_EVENT_IN_DB });
  });
};

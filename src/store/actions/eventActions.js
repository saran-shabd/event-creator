import * as firebase from 'firebase'
import axios from 'axios'

// load all action types
import {
  LOAD_ALL_SERVICE_PROVIDERS,
  POST_EVENT_IN_DB,
  LOAD_ALL_EVENTS_IN_A_MONTH
} from '../types/eventTypes'

// load firebase configuration from environment
const {
  REACT_APP_API_KEY,
  REACT_APP_AUTH_DOMAIN,
  REACT_APP_DATABASE_URL,
  REACT_APP_PROJECT_ID,
  REACT_APP_STORAGE_BUCKET,
  REACT_APP_MESSAGING_SENDER_ID,
  REACT_APP_APP_ID
} = process.env

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
})
const firestore = firebase.firestore()

export const loadAllServiceProviders = () => dispatch => {
  return new Promise((resolve, reject) => {
    firestore
      .collection('service')
      .get()
      .then(doc => {
        let allDocs = doc.docs
        let finalDocs = []
        for (let i in allDocs) {
          allDocs[i] = allDocs[i].data()
          finalDocs[allDocs[i].name] = allDocs[i].email
        }
        dispatch({ type: LOAD_ALL_SERVICE_PROVIDERS, payload: finalDocs })
        resolve()
      })
      .catch(error => {
        console.log(error)
        reject()
      })
  })
}

export const postEventInDB = (
  date,
  title,
  description,
  venue,
  serviceProdivers
) => dispatch => {
  return new Promise((resolve, reject) => {
    const collection = firestore.collection('events')
    collection
      .doc()
      .set({
        date,
        title,
        description,
        venue,
        serviceProdivers
      })
      .then(() => {
        // send email to all the service providers about the event
        for (let i in serviceProdivers) {
          axios
            .post(process.env.REACT_APP_EMAIL_SENDER_API_URL, {
              date,
              title,
              description,
              venue,
              handler: serviceProdivers[i].handler,
              handlerEmail: serviceProdivers[i].handlerEmail
            })
            .catch(error => console.log(error))
        }
        dispatch({ type: POST_EVENT_IN_DB })
        resolve()
      })
      .catch(error => {
        alert(error)
        reject()
      })
  })
}

export const loadAllEventsInAMonth = currDate => dispatch => {
  return new Promise((resolve, reject) => {
    const events = firestore.collection('events')
    events.where('date', '==', currDate).onSnapshot(
      snapshot => {
        const allDocs = snapshot.docs
        const finalDoc = []
        for (let i in allDocs) finalDoc.push(allDocs[i].data())

        resolve()
        dispatch({ type: LOAD_ALL_EVENTS_IN_A_MONTH, payload: finalDoc })
      },
      error => {
        console.log(error)
        reject()
      }
    )
  })
}

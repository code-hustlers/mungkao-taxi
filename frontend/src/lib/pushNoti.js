import firebase from "firebase";
export const initializeFirebase = () => {
  firebase.initializeApp({
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
  });
};

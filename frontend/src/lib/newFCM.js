import firebase from "firebase";

export const init = () => {
  var config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
  };
  firebase.initializeApp(config);
  // Retrieve Firebase Messaging object.
  const messaging = firebase.messaging();
  console.log("TCL: init -> messaging", messaging);
  // Add the public key generated from the console here.
  messaging.usePublicVapidKey(process.env.REACT_APP_PUBLIC_KEY);
  requestPermission(messaging);
};

export const requestPermission = messaging => {
  messaging
    .requestPermission()
    .then(function() {
      console.log("Notification permission granted.");
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      // ...
    })
    .catch(function(err) {
      console.log("Unable to get permission to notify.", err);
    });
};

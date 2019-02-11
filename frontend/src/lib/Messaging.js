import firebase from "firebase";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  publicVapidKey: process.env.REACT_APP_PUBLIC_VAPID_KEY
};

// Add the public key generated from the console here.
// messaging.usePublicVapidKey(
//   ""
// );

export default class Messaging {
  // 싱글톤 필요
  instance;

  constructor(_config = config) {
    if (this.instance) {
      return this.instance;
    }
    if (!firebase.apps.length) {
      firebase.initializeApp(_config);
      console.log(`[Message] Intialize! _config : ${JSON.stringify(_config)}`);
    } else {
      firebase.apps();
    }

    this.messaging = firebase.messaging();
    this.checkPublicKey();
    this.requestPermission();
    this.searchToken();
  }

  checkPublicKey() {
    this.messaging.usePublicVapidKey(config.publicVapidKey);
  }

  requestPermission() {
    this.messaging
      .requestPermission()
      .then(function() {
        console.log("Notification permission granted.");
        // TODO(developer): Retrieve an Instance ID token for use with FCM.
        // ...
      })
      .catch(function(err) {
        console.log("Unable to get permission to notify.", err);
      });
  }

  searchToken() {
    this.messaging
      .getToken()
      .then(function(currentToken) {
        if (currentToken) {
          console.log(
            "TCL: Messaging -> searchToken -> currentToken",
            currentToken
          );
          // sendTokenToServer(currentToken);
          // updateUIForPushEnabled(currentToken);
        } else {
          // Show permission request.
          console.log(
            "No Instance ID token available. Request permission to generate one."
          );
          // Show permission UI.
          // updateUIForPushPermissionRequired();
          // setTokenSentToServer(false);
        }
      })
      .catch(function(err) {
        console.log("An error occurred while retrieving token. ", err);
        // showToken('Error retrieving Instance ID token. ', err);
        // setTokenSentToServer(false);
      });
  }

  onMessage() {
    this.messaging.onMessage(function(payload) {
      console.log("Message received. ", payload);
    });
  }
}

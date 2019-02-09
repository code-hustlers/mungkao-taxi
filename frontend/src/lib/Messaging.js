import firebase from "firebase";

const config = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId
};

// Add the public key generated from the console here.
// messaging.usePublicVapidKey(
//   ""
// );

export default class Messaging {
  // 싱글톤 필요
  constructor(_config = config) {
    firebase.initializeApp(_config);
    console.log(`[Message] Intialize! _config : ${JSON.stringify(_config)}`);

    this.messaging = firebase.messaging();
    this.requestPermission();
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

  onMessage() {
    this.messaging.onMessage(function(payload) {
      console.log("Message received. ", payload);
    });
  }
}

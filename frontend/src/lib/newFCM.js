import firebase from "firebase";

let messaging;

export const init = async () => {
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
  // const messaging = firebase.messaging();
  messaging = firebase.messaging();
  console.log("TCL: init -> messaging", messaging);
  // Add the public key generated from the console here.
  messaging.usePublicVapidKey(process.env.REACT_APP_PUBLIC_KEY);
  requestPermission(messaging);
  const token = await searchCurrentRegisteredToken(messaging);
  console.log("TCL: init -> token", token);
  monitoringRefreshToken(messaging);
  onMessageForeGround(messaging);
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

export const searchCurrentRegisteredToken = (_messaging = messaging) => {
  return new Promise((resolve, reject) => {
    _messaging.onTokenRefresh(() => {
      // Get Instance ID token. Initially this makes a network call, once retrieved
      // subsequent calls to getToken will return from cache.
      _messaging
        .getToken()
        .then(function(currentToken) {
          if (currentToken) {
            // console.log("TCL: currentToken", currentToken);
            resolve(currentToken);
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
          reject(err);
          // showToken("Error retrieving Instance ID token. ", err);
          // setTokenSentToServer(false);
        });
    });
  });
};

export const monitoringRefreshToken = messaging => {
  // Callback fired if Instance ID token is updated.
  messaging.onTokenRefresh(function() {
    messaging
      .getToken()
      .then(function(refreshedToken) {
        console.log("TCL: refreshedToken", refreshedToken);
        console.log("Token refreshed.");
        // Indicate that the new Instance ID token has not yet been sent to the
        // app server.
        // setTokenSentToServer(false);
        // Send Instance ID token to app server.
        // sendTokenToServer(refreshedToken);
        // ...
      })
      .catch(function(err) {
        console.log("Unable to retrieve refreshed token ", err);
        // showToken("Unable to retrieve refreshed token ", err);
      });
  });
};

export const onMessageForeGround = messaging => {
  // Handle incoming messages. Called when:
  // - a message is received while the app has focus
  // - the user clicks on an app notification created by a service worker
  //   `messaging.setBackgroundMessageHandler` handler.
  messaging.onMessage(function(payload) {
    console.log("Message received. ", payload);
    // ...
  });
};

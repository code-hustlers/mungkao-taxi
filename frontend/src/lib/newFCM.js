import firebase from "firebase";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
};
firebase.initializeApp(config);
const messaging = firebase.messaging();
console.log("TCL: init -> messaging", messaging);

export const init = async () => {
  // Retrieve Firebase Messaging object.
  // Add the public key generated from the console here.
  messaging.usePublicVapidKey(process.env.REACT_APP_PUBLIC_KEY);
  requestPermission();
  const token = await searchCurrentRegisteredToken(messaging);
  console.log("TCL: init -> token", token);
  // 아래 함수에서 hang걸림
  // const refreshedToken = await monitoringRefreshToken(messaging);
  // console.log("TCL: init -> refreshedToken", refreshedToken);
  onMessageForeGround(messaging);
  // getAccessToken()
  //   .then(res => {
  //     console.log("TCL: init -> res", res);
  //   })
  //   .catch(error => {
  //     console.log("TCL: init -> error", error);
  //   });
};

export const requestPermission = () => {
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

export const searchCurrentRegisteredToken = messaging => {
  return new Promise((resolve, reject) => {
    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging
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
};

export const monitoringRefreshToken = async messaging => {
  return new Promise((resolve, reject) => {
    // Callback fired if Instance ID token is updated.
    messaging.onTokenRefresh(function() {
      messaging
        .getToken()
        .then(function(refreshedToken) {
          console.log("TCL: refreshedToken", refreshedToken);
          resolve(refreshedToken);
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
          reject(err);
          // showToken("Unable to retrieve refreshed token ", err);
        });
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
    const { title, body } = payload.notification;
    // ...
    new Notification(title, { body, icon: "/mungkao-taxi-logo.png" });
  });
};

import React, { Component } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import AppRouter from "./Routes/AppRouter";
import { ThemeProvider } from "styled-components";
import DefaultTheme from "./styles/theme/DefaultTheme";
import firebase from "firebase";
import { CookiesProvider } from "react-cookie";

const config = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId
};
firebase.initializeApp(config);

console.log(config);

const messaging = firebase.messaging();

console.log(messaging);

messaging.onMessage(function(payload) {
  console.log("Message received. ", payload);
});

// Add the public key generated from the console here.
// messaging.usePublicVapidKey(
//   ""
// );

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

class App extends Component {
  render() {
    return (
      <CookiesProvider>
        <ThemeProvider theme={DefaultTheme}>
          <>
            <AppRouter />
            <GlobalStyles />
          </>
        </ThemeProvider>
      </CookiesProvider>
    );
  }
}

export default App;

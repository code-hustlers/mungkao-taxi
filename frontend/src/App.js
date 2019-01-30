import React, { Component } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import AppRouter from "./Routes/AppRouter";
import { ThemeProvider } from "styled-components";
import DefaultTheme from "./styles/theme/DefaultTheme";
import firebase from "firebase";

const config = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  storageBucket: process.env.REACT_APP_storageBucket
};
firebase.initializeApp(config);

console.log(config);

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={DefaultTheme}>
        <>
          <AppRouter />
          <GlobalStyles />
        </>
      </ThemeProvider>
    );
  }
}

export default App;

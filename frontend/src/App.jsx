import React, { Component } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import AppRouter from "./Routes/AppRouter";
import { ThemeProvider } from "styled-components";
import DefaultTheme from "./styles/theme/DefaultTheme";
import { CookiesProvider } from "react-cookie";
import StoreProvider from "./store/Store";
// import Messaging from "./lib/Messaging";

class App extends Component {
  // constructor(props) {
  //   super(props);
  //   const messaging = new Messaging();
  //   console.log("TCL: App -> constructor -> messaging", messaging);
  // }

  render() {
    return (
      <CookiesProvider>
        <StoreProvider>
          <ThemeProvider theme={DefaultTheme}>
            <>
              <AppRouter />
              <GlobalStyles />
            </>
          </ThemeProvider>
        </StoreProvider>
      </CookiesProvider>
    );
  }
}

export default App;

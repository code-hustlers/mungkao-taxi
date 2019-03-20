import React, { Component } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import AppRouter from "./Routes/AppRouter";
import { ThemeProvider } from "styled-components";
import DefaultTheme from "./styles/theme/DefaultTheme";
import { CookiesProvider } from "react-cookie";
import StoreProvider from "./store/Store";

class App extends Component {
  state = {
    isSubscribed: false
  };

  componentDidMount() {}

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

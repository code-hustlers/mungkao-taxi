import React, { Component } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import AppRouter from "./Routes/AppRouter";
import { ThemeProvider } from "styled-components";
import DefaultTheme from "./styles/theme/DefaultTheme";

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

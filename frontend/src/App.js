import React, { Component } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import AppRouter from "./Routes/AppRouter";

class App extends Component {
  render() {
    return (
      <>
        <AppRouter />
        <GlobalStyles />
      </>
    );
  }
}

export default App;

import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { Signin, Home } from "../views";
import { StoreConsumer } from "../store/Store";

class AppRouter extends React.Component {
  // state = {
  //   isSignin: false
  // };

  render() {
    // const { isSignin } = this.state;

    return (
      <StoreConsumer>
        {({ state: { isSignin } }) => {
          console.log("TCL: AppRouter -> render -> isSignin", isSignin);
          return (
            <Router>
              <>
                <nav>
                  <ul>
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li>
                      <Link to="/signin/">Signin</Link>
                    </li>
                  </ul>
                </nav>

                <Route
                  exact
                  path="/"
                  render={() =>
                    isSignin ? <Home /> : <Redirect to="/signin" />
                  }
                />
                <Route
                  path="/signin/"
                  render={() => (isSignin ? <Redirect to="/" /> : <Signin />)}
                />
              </>
            </Router>
          );
        }}
      </StoreConsumer>
    );
  }
}

export default AppRouter;

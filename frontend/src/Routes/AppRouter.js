import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { Signin, Home } from "../views";
import { StoreConsumer } from "../store/Store";
import SignoutButton from "../components/SignoutButton";
import { withCookies } from "react-cookie";
import withStore from "../lib/withStore";

class AppRouter extends React.Component {
  handleSignout = () => {
    const {
      cookies,
      store: {
        actions: { setSignin }
      }
    } = this.props;
    cookies.remove("token");
    setSignin(false);
    alert("Signout!");
  };

  render() {
    const { handleSignout } = this;
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

                  <SignoutButton onClick={handleSignout}>Signout</SignoutButton>
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

export default withCookies(withStore(AppRouter));

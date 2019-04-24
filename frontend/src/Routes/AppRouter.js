import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Signin, Home, Signup } from "../views";
import { StoreConsumer } from "../store/Store";
import withStore from "../lib/withStore";
import GNB from "../components/GNB/GNB";

const AppRouter = ({
  store: {
    actions: { setSignin }
  }
}) => {
  return (
    <StoreConsumer>
      {({ state: { isSignin } }) => {
        return (
          <Router basename={process.env.PUBLIC_URL}>
            <>
              <GNB isSignin={isSignin} setSignin={setSignin} />
              <Route
                exact
                path="/"
                render={() => (isSignin ? <Home /> : <Redirect to="/signin" />)}
              />
              <Route
                path="/signin/"
                render={() => (isSignin ? <Redirect to="/" /> : <Signin />)}
              />
              <Route path="/signup/" component={Signup} />
            </>
          </Router>
        );
      }}
    </StoreConsumer>
  );
};

export default withStore(AppRouter);

import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { Signin, Home, Signup } from "../views";
import { StoreConsumer } from "../store/Store";
import SignoutButton from "../components/SignoutButton";
import { withCookies } from "react-cookie";
import withStore from "../lib/withStore";
import styled from 'styled-components';

const Nav = styled.nav`
  position: absolute;
  width: 100%;
  height: 9%;
  background-color: #fd79a8;
  z-index: 1;
`;

const Div = styled.div`
  float: left;
  padding: 1rem;
  color: #fff;
`;

const LogoImg = styled.img.attrs({ src: '/mungkao-taxi-logo.png' })`
  width: 20px;
  height: 20px;
`;

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
          return (
            <Router>
              <>
                <Nav>
                    <Div>
                      <LogoImg />
                    </Div>
                    <Link to="/" >
                      <Div>Home</Div>
                    </Link>
                    <Link to="/signin/">
                      <Div>Signin</Div>
                    </Link>
                    <Link to="/signup/">
                      <Div>Signup</Div>
                    </Link>
                  {isSignin ? (
                    <SignoutButton onClick={handleSignout}>
                      Signout
                    </SignoutButton>
                  ) : null}
                </Nav>

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
                <Route path="/signup/" component={Signup} />
              </>
            </Router>
          );
        }}
      </StoreConsumer>
    );
  }
}

export default withCookies(withStore(AppRouter));

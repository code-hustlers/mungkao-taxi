import React from "react";
import { Link } from "react-router-dom";
import { withCookies } from "react-cookie";
import { Nav, Div, LogoImg } from "./GNB.styles";
import SignoutButton from "../../components/SignoutButton";

const GNB = ({ cookies, isSignin, setSignin }) => {
  const handleSignout = () => {
    cookies.remove("token");
    setSignin(false);
    alert("Signout!");
  };
  return (
    <Nav>
      <Div>
        <LogoImg />
      </Div>
      <Link to="/">
        <Div>Home</Div>
      </Link>
      <Link to="/signin/">
        <Div>Signin</Div>
      </Link>
      <Link to="/signup/">
        <Div>Signup</Div>
      </Link>
      {isSignin ? (
        <SignoutButton onClick={handleSignout}>Signout</SignoutButton>
      ) : null}
    </Nav>
  );
};

export default withCookies(GNB);

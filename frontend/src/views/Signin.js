import React from "react";
import styled from "styled-components";
import { flexCenter, CardStyle, RaisedCardStyle } from "../styles/mixin";

const Container = styled.div`
  flex: 1;
  background: #aaa;
  ${flexCenter};
  flex-flow: column wrap;
  /* width: 500px; */
`;

const Input = styled.input`
  font-size: 1rem;
  border-bottom: 1px solid #bbb;
  color: red;
  height: 2rem;
  align-self: inherit;
  padding: 0.5rem 1rem;
`;

const CardForm = styled.form`
  ${flexCenter};
  flex-flow: column wrap;
  flex: 1;
  align-self: stretch;
  padding: 1rem;
  /* ${CardStyle}; */
  transition: 0.5s;
  &:focus,
  &:hover {
    transition: 0.5s;
    /* ${RaisedCardStyle}; */
  }
`;

const Button = styled.button`
  align-self: inherit;
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 1rem;
`;

class Signin extends React.Component {
  handleSignin = event => {
    event.preventDefault();
    alert("Signin!");
  };
  render() {
    const { handleSignin } = this;

    return (
      <Container>
        <CardForm onSubmit={handleSignin}>
          <h1>Signin</h1>
          <Input placeholder="Username" />
          <Input placeholder="Password" type="password" />
          <Button>Signin</Button>
        </CardForm>
      </Container>
    );
  }
}

export default Signin;

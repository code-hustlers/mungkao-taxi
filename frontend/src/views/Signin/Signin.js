import React from "react";
import { Container, CardForm, Input, Button } from "./Signin.styles";

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

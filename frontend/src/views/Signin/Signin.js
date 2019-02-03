import React from "react";
import { Container, CardForm, Input, Button } from "./Signin.styles";
import axios from "axios";

class Signin extends React.Component {
  state = {
    id: "",
    pw: ""
  };

  handleSignin = event => {
    const { id, pw } = this.state;
    event.preventDefault();
    axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}:${
          process.env.REACT_APP_SERVER_PORT
        }/apis/v1/login`,
        {
          id,
          pw
        }
      )
      .then(res => {
        console.log(res);
        alert("success");
      })
      .catch(err => console.error(err));
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    const { handleSignin, handleChange } = this;
    const { id, pw } = this.state;
    console.log("TCL: Signin -> render -> id, pw", id, pw);

    return (
      <Container>
        <CardForm onSubmit={handleSignin}>
          <h1>Signin</h1>
          <Input
            value={id}
            onChange={handleChange("id")}
            placeholder="Username"
          />
          <Input
            value={pw}
            onChange={handleChange("pw")}
            placeholder="Password"
            type="password"
          />
          <Button>Signin</Button>
        </CardForm>
      </Container>
    );
  }
}

export default Signin;

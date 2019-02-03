import React from "react";
import { Container, CardForm, Input, Button } from "./Signin.styles";
import axios from "axios";
import { withCookies } from "react-cookie";

class Signin extends React.Component {
  state = {
    id: "",
    pw: ""
  };

  handleSignin = async event => {
    const { id, pw } = this.state;
    const { cookies } = this.props;
    event.preventDefault();

    const {
      data: { success, token }
    } = await axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}:${
          process.env.REACT_APP_SERVER_PORT
        }/apis/v1/login`,
        {
          id,
          pw
        }
      )
      .then(res => res)
      .catch(err => console.error(err));

    console.log("TCL: Signin -> success, token", success, token);

    cookies.set("token", token, { path: "/" });
    alert("Login Success!");
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    const { handleSignin, handleChange } = this;
    const { id, pw } = this.state;
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

export default withCookies(Signin);

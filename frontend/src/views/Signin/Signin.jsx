import React from "react";
import { Container } from "./Signin.styles";
import axios from "axios";
import { withCookies } from "react-cookie";
import { withRouter } from "react-router-dom";
import withStore from "../../lib/withStore";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { CardForm } from "../../components/Card/CardForm";
import Loading from "../../components/Loading";
import { askForPermissioToReceiveNotifications } from "../../lib/pushNotifications";

class Signin extends React.Component {
  state = {
    id: "",
    pw: "",
    loading: false
  };

  handleSignin = async event => {
    const { id, pw } = this.state;
    const {
      cookies,
      history: { push },
      store: {
        actions: { setSignin }
      }
    } = this.props;
    event.preventDefault();
    this.setState({ loading: true });

    try {
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
      setSignin(true);
      alert("Login Success!");
      push("/");
    } catch (error) {
      console.error(error);
      alert("Error");
      return false;
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSignup = () => {
    const {
      history: { push }
    } = this.props;

    push("/signup");
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    const { handleSignin, handleSignup, handleChange } = this;
    const { id, pw, loading } = this.state;

    return (
      <Container>
        <Loading loading={loading} />
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
          <Button onClick={handleSignin}>Signin</Button>
          <Button type="button" variant={"primary"} onClick={handleSignup}>
            Signup
          </Button>
          <Button type="button" onClick={askForPermissioToReceiveNotifications}>
            Request Push Noti
          </Button>
        </CardForm>
      </Container>
    );
  }
}

export default withCookies(withRouter(withStore(Signin)));

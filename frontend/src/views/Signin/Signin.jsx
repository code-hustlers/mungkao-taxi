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
import {
  requestPermission,
  searchCurrentRegisteredToken,
  messaging
} from "../../lib/newFCM";
import urlB64ToUint8Array from "../../lib/urlB64ToUint8Array";
class Signin extends React.Component {
  state = {
    id: "",
    pw: "",
    loading: false,
    fcmToken: "",
    pushSubscriptionObject: null
  };

  handleSignin = async event => {
    const { id, pw, fcmToken } = this.state;
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
            pw,
            token: fcmToken
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

  handleRequestPushNoti = pushSubscriptionObject => async () => {
    console.log("TCL: pushSubscriptionObject", pushSubscriptionObject);
    this.setState({ loading: true });
    try {
      requestPermission();
      // const subscription = await requestPermission();
      // console.log("TCL: handleRequestPushNoti -> subscription", subscription);
      axios
        .post(
          `${process.env.REACT_APP_SERVER_URL}:${
            process.env.REACT_APP_SERVER_PORT
          }/push`,
          {
            data: "5555",
            subscription: pushSubscriptionObject
          }
        )
        .then(res => res)
        .catch(error => console.error(error));
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ loading: false });
    }
  };

  async componentDidMount() {
    try {
      const fcmToken = await searchCurrentRegisteredToken(messaging);
      this.setState({ fcmToken });
    } catch (error) {
      this.setState({ fcmToken: JSON.stringify(error) });
    }

    console.log(
      "TCL: App -> process.env.REACT_APP_PUBLIC_VAPID_KEY",
      process.env.REACT_APP_PUBLIC_VAPID_KEY
    );

    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/push-notification-sw.js")
        .then(swReg => {
          console.log("SW Registered: ", swReg);
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              console.log("Permission: ", permission);
              swReg.pushManager
                .subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: urlB64ToUint8Array(
                    process.env.REACT_APP_PUBLIC_VAPID_KEY
                  )
                })
                .then(pushSubscriptionObject => {
                  this.setState({ pushSubscriptionObject });
                  console.log(pushSubscriptionObject);
                })
                .catch(error => console.log("TCL: App -> error", error));
            }
          });
        })
        .catch(error => console.error("Can't register SW: ", error));
    }
  }

  render() {
    const {
      handleSignin,
      handleSignup,
      handleChange,
      handleRequestPushNoti
    } = this;
    const { id, pw, loading, fcmToken } = this.state;
    console.log(this.props);
    return (
      <Container>
        <Loading loading={loading} />
        <CardForm onSubmit={handleSignin}>
          <h1>Signin</h1>
          <h2>Token</h2>
          <p>{fcmToken}</p>
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
          {/* <Button type="button" onClick={askForPermissioToReceiveNotifications}> */}
          <Button
            type="button"
            onClick={handleRequestPushNoti(this.state.pushSubscriptionObject)}
          >
            Request Push Noti
          </Button>
        </CardForm>
      </Container>
    );
  }
}

export default withStore(withCookies(withRouter(Signin)));

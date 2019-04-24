import React from "react";
import { withCookies } from "react-cookie";

export const { Provider, Consumer: StoreConsumer } = React.createContext();

class StoreProvider extends React.Component {
  state = {
    isSignin: this.props.cookies.get("token"),
    token: "",
    pushSubscriptionObject: this.props.pushSubscriptionObject
  };
  actions = {
    setSignin: isSignin => {
      console.log("TCL: StoreProvider -> isSignin", isSignin);
      this.setState({ isSignin });
    },
    setToken: token => {
      this.setState({ token });
    },
    setState: (key, value) => {
      this.setState({ [key]: value });
    }
  };
  pushSubscriptionObject = this.props.pushSubscriptionObject;

  render() {
    const { children, ...others } = this.props;
    const { state, actions, pushSubscriptionObject } = this;
    console.log("TCL: StoreProvider -> render -> this.props", this.props);

    return (
      <Provider value={{ state, actions, pushSubscriptionObject }} {...others}>
        {children}
      </Provider>
    );
  }
}

export default withCookies(StoreProvider);

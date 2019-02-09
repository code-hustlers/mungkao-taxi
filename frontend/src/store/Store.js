import React from "react";
import { withCookies } from "react-cookie";

export const { Provider, Consumer: StoreConsumer } = React.createContext();

class StoreProvider extends React.Component {
  state = { isSignin: this.props.cookies.get("token") };
  actions = {
    setSignin: isSignin => {
      console.log("TCL: StoreProvider -> isSignin", isSignin);
      this.setState({ isSignin });
    }
  };

  render() {
    const { children } = this.props;
    const { state, actions } = this;

    return <Provider value={{ state, actions }}>{children}</Provider>;
  }
}

export default withCookies(StoreProvider);

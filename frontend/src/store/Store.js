import React from "react";

export const { Provider, Consumer: StoreConsumer } = React.createContext();

export default class StoreProvider extends React.Component {
  state = { isSignin: false };
  actions = {
    setSignin: isSignin => {
      this.setState({ isSignin });
    }
  };

  render() {
    const { children } = this.props;
    const { state, actions } = this;

    return <Provider value={{ state, actions }}>{children}</Provider>;
  }
}

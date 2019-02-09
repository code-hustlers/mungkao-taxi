import React from "react";
import { StoreConsumer } from "../store/Store";

function withStore(WrappedComponent) {
  return class extends React.Component {
    render() {
      return (
        <StoreConsumer>
          {store => (
            <WrappedComponent store={store} {...this.props}>
              {this.props.children}
            </WrappedComponent>
          )}
        </StoreConsumer>
      );
    }
  };
}
export default withStore;

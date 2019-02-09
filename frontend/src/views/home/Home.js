import React from "react";
import axios from "axios";
import { withCookies } from "react-cookie";
import { withRouter } from "react-router-dom";
import withStore from "../../lib/withStore";


class Home extends React.Component {
  render() {
    return (
      <div>
        Home
      </div>
    );
  }
}

export default withCookies(withRouter(withStore(Home)));

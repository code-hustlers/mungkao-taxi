import React from "react";
import axios from "axios";
import { withCookies } from "react-cookie";
import { withRouter } from "react-router-dom";
import withStore from "../../lib/withStore";

class Home extends React.Component {
  state = {
    userInfo: {}
  };

  componentDidMount() {
    const { handleCheck } = this;
    handleCheck();
  }

  handleCheck = async () => {
    const {
      cookies,
      store: {
        actions: { setSignin }
      }
    } = this.props;

    const token = cookies.get("token");

    await axios({
      method: "get",
      url: `${process.env.REACT_APP_SERVER_URL}:${
        process.env.REACT_APP_SERVER_PORT
      }/apis/v1/verify?token=${token}`
    })
      .then(res => {
        console.log("TCL: Home -> handleCheck -> res", res);
        this.setState({ userInfo: res.data });
      })
      .catch(() => {
        // cookies.remove("token"); // error 났다고 쿠키 지우는 로직 필요한가?
        setSignin(false);
      });
  };

  render() {
    const { userInfo } = this.state;
    console.log(userInfo);

    return (
      <div>
        <h1>Home</h1>
        <span>{userInfo.id}</span> 님, 어서오세요.
      </div>
    );
  }
}

export default withCookies(withRouter(withStore(Home)));

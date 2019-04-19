import React from "react";
import axios from "axios";
import { withCookies } from "react-cookie";
import { withRouter } from "react-router-dom";
import withStore from "../../lib/withStore";
// fullpage
import ReactFullpage from "@fullpage/react-fullpage";
import "fullpage.js/vendors/scrolloverflow";
import { searchCurrentRegisteredToken, messaging } from "../../lib/newFCM";
// Component
import OverView from "./OverView";
import Drive from "./Drive";

const fullpageProps = {
  scrollOverflow: true,
  sectionsColor: ["#fff", "#fff"],
  anchors: ["overview", "drive"]
};
const fcmTest = async () => {
  const token = await searchCurrentRegisteredToken();
  console.log("TCL: fcmTest -> token", token);
};

const FullpageWrapper = props => (
  <ReactFullpage
    {...fullpageProps}
    render={({ state, fullpageApi }) => {
      const {
        userInfo,
        drivers,
        handleSelectUser,
        userID,
        handleClick,
        calls,
        handleReject,
        isPassengerHome,
        isDriverHome,
        handleArrive
      } = props;

      return (
        <ReactFullpage.Wrapper>
          <div className="section">
            <OverView userInfo={userInfo} fcmTest={fcmTest} />
          </div>
          <div className="section">
            <Drive
              userInfo={userInfo}
              userID={userID}
              drivers={drivers}
              calls={calls}
              handleSelectUser={handleSelectUser}
              handleClick={handleClick}
              handleReject={handleReject}
              isPassengerHome={isPassengerHome}
              isDriverHome={isDriverHome}
              handleArrive={handleArrive}
            />
          </div>
        </ReactFullpage.Wrapper>
      );
    }}
  />
);

// 풀리퀘 테스트
class Home extends React.Component {
  state = {
    userInfo: {},
    drivers: [],
    calls: [],
    userID: "",
    isPassengerHome: false,
    isDriverHome: false
  };

  async componentDidMount() {
    const {
      handleCheck,
      handleGetDriver,
      handleCallList,
      handleGetCallStatus
    } = this;
    await handleCheck();
    const { userInfo } = this.state;
    const {
      store: {
        actions: { setToken }
      }
    } = this.props;

    const type =
      !userInfo.position || userInfo.position === 0 ? "passenger" : "driver";
    const token = await searchCurrentRegisteredToken(messaging);

    setToken(token);

    await handleGetCallStatus(type, userInfo.id);

    if (!userInfo.position || userInfo.position === 0) {
      await handleGetDriver();
    } else {
      await handleCallList();
    }
  }
  componentWillUnmount() {
    this.setState({ isPassengerHome: false, isDriverHome: false });
  }

  handleGetCallStatus = (type, userId) => {
    const userType = type === "driver" ? "driverId" : "userId";
    const data = {
      type: type,
      [userType]: userId
    };
    // console.log({ data });
    axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}:${
        process.env.REACT_APP_SERVER_PORT
      }/apis/v1/call/info`,
      data: data
    })
      .then(res => {
        console.log("handleGetCallStatus success : ", res);
        if (type === "passenger") {
          this.setState({
            isPassengerHome: res.data.status !== 2 ? true : false
          });
        } else if (type === "driver") {
          this.setState({ isDriverHome: res.data.status === 1 ? true : false });
        }
      })
      .catch(err => {
        console.log("handleGetCallStatus failure : ", err);
      });
  };

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
        // console.log("TCL: Home -> handleCheck -> res", res);
        this.setState({ userInfo: res.data });
      })
      .catch(() => {
        // cookies.remove("token"); // error 났다고 쿠키 지우는 로직 필요한가?
        setSignin(false);
      });
  };

  handleGetDriver = async () => {
    await axios({
      method: "get",
      url: `${process.env.REACT_APP_SERVER_URL}:${
        process.env.REACT_APP_SERVER_PORT
      }/apis/v1/driver/list`
    })
      .then(res => {
        this.setState({ drivers: res.data });
      })
      .catch(err => {
        console.log(err, "error");
      });
  };

  handleCallList = async () => {
    const { userInfo } = this.state;

    await axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}:${
        process.env.REACT_APP_SERVER_PORT
      }/apis/v1/call/list`,
      data: { id: userInfo.id }
    })
      .then(res => {
        this.setState({ calls: res.data });
        // console.log('call list success : ', res);
      })
      .catch(err => {
        console.log("call list failure : ", err);
      });
  };

  handleCallRequest = async () => {
    const { userID, userInfo } = this.state;

    const data = {
      driverId: userID,
      userId: userInfo.id,
      sPoint: "",
      destination: "",
      price: 0
    };

    await this.setState({ userID: "" });
    return axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}:${
        process.env.REACT_APP_SERVER_PORT
      }/apis/v1/call/request`,
      data: data
    })
      .then(res => {
        console.log("call API success : ", res);
        this.setState({ isPassengerHome: true });
      })
      .catch(err => {
        console.log("call API failure : ", err);
      });
  };

  handleSelectUser = userID => () => {
    this.setState({ userID });
  };

  handleClick = async e => {
    const { userID, userInfo } = this.state;
    const { handleCallRequest, handleApproval } = this;
    // console.log(userInfo.position);
    e.preventDefault();

    let userType =
      userInfo.position === 0 || !userInfo.position ? `운전자` : `탑승자`;
    let confirmMsg =
      userInfo.position === 0 || !userInfo.position
        ? `${userID}님에게 호출을 요청하시겠습니까 ?`
        : `${userID}의 요청을 승낙 하시겠습니까 ?`;
    if (userID === "") {
      alert(`${userType}를 선택하여 주십시오.`);
      return;
    }

    if (window.confirm(confirmMsg)) {
      userType === "운전자"
        ? await handleCallRequest()
        : await handleApproval();
    }
  };

  handleApproval = async e => {
    const { userID, userInfo } = this.state;
    // console.log(userID, userInfo.id);
    const data = {
      driverId: userInfo.id,
      userId: userID
    };

    await axios({
      method: "put",
      url: `${process.env.REACT_APP_SERVER_URL}:${
        process.env.REACT_APP_SERVER_PORT
      }/apis/v1/call/approval`,
      data: data
    })
      .then(res => {
        // console.log(res);
        this.setState({ isDriverHome: true });
      })
      .catch(err => {
        console.log(err);
      });
    await this.handleCallList();
    await this.setState({ userID: "" });
  };

  handleReject = async e => {
    const { userID, userInfo } = this.state;
    e.preventDefault();

    const data = {
      driverId: userInfo.id,
      userId: userID
    };

    if (userID === "") {
      alert(`탑승자를 선택하여 주십시오.`);
      return;
    }

    if (window.confirm(`${userID}의 요청을 거절 하시겠습니까?`)) {
      // reject api
      await axios({
        method: "put",
        url: `${process.env.REACT_APP_SERVER_URL}:${
          process.env.REACT_APP_SERVER_PORT
        }/apis/v1/call/reject`,
        data: data
      })
        .then(res => {
          // console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
      await this.handleCallList();
    }

    await this.setState({ userID: "" });
  };

  handleArrive = async e => {
    e.preventDefault();

    const { userInfo } = this.state;
    const flag = !userInfo.position || userInfo.position === 0 ? true : false;
    const type =
      !userInfo.position || userInfo.position === 0 ? "passenger" : "driver";
    let userId = "";
    const userType = type === "driver" ? "driverId" : "userId";

    const infoParam = {
      type: type,
      [userType]: userInfo.id
    };
    // console.log({ infoParam });

    await axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}:${
        process.env.REACT_APP_SERVER_PORT
      }/apis/v1/call/info`,
      data: infoParam
    })
      .then(res => {
        // console.log(res);
        userId = res.data.userId;
      })
      .catch(err => {
        console.log(err);
      });

    const arriveParam = {
      driverId: userInfo.id,
      userId: userId
    };
    console.log({ arriveParam });

    await axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}:${
        process.env.REACT_APP_SERVER_PORT
      }/apis/v1/call/arrive`,
      data: arriveParam
    })
      .then(() => {
        if (flag) {
          this.setState({ isPassengerHome: false });
        } else {
          this.setState({ isDriverHome: false });
        }
      })
      .catch(err => {});

    (await flag) ? this.handleGetDriver() : this.handleCallList();
  };

  render() {
    const {
      userInfo,
      drivers,
      userID,
      calls,
      isPassengerHome,
      isDriverHome
    } = this.state;
    console.log("Home.jsx : ", { isPassengerHome }, { isDriverHome });
    console.log(this.props);
    // console.log('render drivers : ', drivers);

    return (
      <div>
        <FullpageWrapper
          userInfo={userInfo}
          drivers={drivers}
          calls={calls}
          userID={userID}
          handleSelectUser={this.handleSelectUser}
          handleClick={this.handleClick}
          handleReject={this.handleReject}
          isPassengerHome={isPassengerHome}
          isDriverHome={isDriverHome}
          handleArrive={this.handleArrive}
        />
      </div>
    );
  }
}

export default withCookies(withRouter(withStore(Home)));

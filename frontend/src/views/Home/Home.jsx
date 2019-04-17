import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import { withCookies } from "react-cookie";
import { withRouter } from "react-router-dom";
import withStore from "../../lib/withStore";
// fullpage
import ReactFullpage from "@fullpage/react-fullpage";
import "fullpage.js/vendors/scrolloverflow";
import { searchCurrentRegisteredToken } from "../../lib/newFCM";
// Component
import OverView from "./OverView";
import Drive from "./Drive";
import fcmReducer from "../../reducers/fcmReducer";

const fullpageProps = {
  scrollOverflow: true,
  sectionsColor: ["#fff", "#fff"],
  anchors: ["overview", "drive"]
};
const fcmTest = async () => {
  const token = await searchCurrentRegisteredToken();
  console.log("TCL: fcmTest -> token", token);
};

const FullpageWrapper = props => {
  console.log("TCL: props", props);
  return (
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
};

const Home = props => {
  const [state, setState] = useState({
    userInfo: {},
    drivers: [],
    calls: [],
    userID: "",
    isPassengerHome: false,
    isDriverHome: false
  });

  const handleGetCallStatus = (type, userId) => {
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
          setState({
            isPassengerHome: res.data.status !== 2 ? true : false
          });
        } else if (type === "driver") {
          setState({ isDriverHome: res.data.status === 1 ? true : false });
        }
      })
      .catch(err => {
        console.log("handleGetCallStatus failure : ", err);
      });
  };

  const handleCheck = async () => {
    const {
      cookies,
      store: {
        actions: { setSignin }
      }
    } = props;

    const token = cookies.get("token");

    await axios({
      method: "get",
      url: `${process.env.REACT_APP_SERVER_URL}:${
        process.env.REACT_APP_SERVER_PORT
      }/apis/v1/verify?token=${token}`
    })
      .then(res => {
        console.log("TCL: Home -> handleCheck -> res", res);
        setState({ userInfo: res.data });
      })
      .catch(() => {
        // cookies.remove("token"); // error 났다고 쿠키 지우는 로직 필요한가?
        setSignin(false);
      });
  };

  const handleGetDriver = async () => {
    await axios({
      method: "get",
      url: `${process.env.REACT_APP_SERVER_URL}:${
        process.env.REACT_APP_SERVER_PORT
      }/apis/v1/driver/list`
    })
      .then(res => {
        setState({ drivers: res.data });
      })
      .catch(err => {
        console.log(err, "error");
      });
  };

  const handleCallList = async () => {
    const { userInfo } = state;

    await axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}:${
        process.env.REACT_APP_SERVER_PORT
      }/apis/v1/call/list`,
      data: { id: userInfo.id }
    })
      .then(res => {
        setState({ calls: res.data });
        // console.log('call list success : ', res);
      })
      .catch(err => {
        console.log("call list failure : ", err);
      });
  };

  const handleCallRequest = async () => {
    const { userID, userInfo } = state;

    const data = {
      driverId: userID,
      userId: userInfo.id,
      sPoint: "",
      destination: "",
      price: 0
    };

    await setState({ userID: "" });
    return axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}:${
        process.env.REACT_APP_SERVER_PORT
      }/apis/v1/call/request`,
      data: data
    })
      .then(res => {
        console.log("call API success : ", res);
        setState({ isPassengerHome: true });
      })
      .catch(err => {
        console.log("call API failure : ", err);
      });
  };

  const handleSelectUser = userID => () => {
    setState({ userID });
  };

  const handleClick = async e => {
    const { userID, userInfo } = state;
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

  const handleApproval = async e => {
    const { userID, userInfo } = state;
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
        setState({ isDriverHome: true });
      })
      .catch(err => {
        console.log(err);
      });
    await handleCallList();
    await setState({ userID: "" });
  };

  const handleReject = async e => {
    const { userID, userInfo } = state;
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
      await handleCallList();
    }

    await setState({ userID: "" });
  };

  const handleArrive = async e => {
    e.preventDefault();

    const { userInfo } = state;
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
          setState({ isPassengerHome: false });
        } else {
          setState({ isDriverHome: false });
        }
      })
      .catch(err => {});

    (await flag) ? handleGetDriver() : handleCallList();
  };

  // handleCheck();
  // const { userInfo } = state;
  // if (userInfo) {
  //   const type =
  //     !userInfo.position || userInfo.position === 0 ? "passenger" : "driver";
  //   handleGetCallStatus(type, userInfo.id);
  //   if (!userInfo.position || userInfo.position === 0) {
  //     handleGetDriver();
  //   } else {
  //     handleCallList();
  //   }
  // }

  useEffect(() => {
    handleCheck();
    const { userInfo } = state;
    const type =
      !userInfo.position || userInfo.position === 0 ? "passenger" : "driver";
    handleGetCallStatus(type, userInfo.id);

    if (!userInfo.position || userInfo.position === 0) {
      handleGetDriver();
    } else {
      handleCallList();
    }
  }, []);

  // async componentDidMount() {
  //   const {
  //     handleCheck,
  //     handleGetDriver,
  //     handleCallList,
  //     handleGetCallStatus
  //   } = this;
  //   await handleCheck();
  //   const { userInfo } = state;
  //   const type =
  //     !userInfo.position || userInfo.position === 0 ? "passenger" : "driver";
  //   await handleGetCallStatus(type, userInfo.id);

  //   if (!userInfo.position || userInfo.position === 0) {
  //     await handleGetDriver();
  //   } else {
  //     await handleCallList();
  //   }
  // }
  // componentWillUnmount() {
  //   setState({ isPassengerHome: false, isDriverHome: false });
  // }

  const { drivers, userID, calls, isPassengerHome, isDriverHome } = state;
  const [fcmState, dispatch] = useReducer(fcmReducer);
  console.log("TCL: render -> state", fcmState, dispatch);

  console.log("Home.jsx : ", { isPassengerHome }, { isDriverHome });

  console.log("TCL: state", state);
  return (
    <div>
      <FullpageWrapper
        userInfo={state.userInfo}
        drivers={drivers}
        calls={calls}
        userID={userID}
        handleSelectUser={handleSelectUser}
        handleClick={handleClick}
        handleReject={handleReject}
        isPassengerHome={isPassengerHome}
        isDriverHome={isDriverHome}
        handleArrive={handleArrive}
      />
    </div>
  );
};

export default withCookies(withRouter(withStore(Home)));

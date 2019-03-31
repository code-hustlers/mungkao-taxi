import React from "react";
import axios from "axios";
import { withCookies } from "react-cookie";
import { withRouter } from "react-router-dom";
import withStore from "../../lib/withStore";
import Button from "../../components/Button";
// fullpage
import ReactFullpage from '@fullpage/react-fullpage';
import 'fullpage.js/vendors/scrolloverflow';
import { CardForm } from "../../components/Card/CardForm";
import styled from 'styled-components';
import { searchCurrentRegisteredToken } from "../../lib/newFCM";

const fullpageProps = {
  scrollOverflow: true,
  sectionsColor: ['#fff', '#fff'],
  anchors: ['overview', 'actions']
}
const fcmTest = async () => {
  const token = await searchCurrentRegisteredToken();
  console.log("TCL: fcmTest -> token", token);
}

const Title = styled.div`
  text-align: center;
  font-size: 1.3rem;
  font-weight: bold;
`;

const Div = styled.div`
  &:hover {
    background: black;
    color: #fff;
  };
  ${props => props.userID === props.id ?
    `background: black;
    color: #fff;`
  : null}
`;

const FullpageWrapper = (props) => (
  <ReactFullpage
    {...fullpageProps}
    render = {({ state, fullpageApi }) => {
      const { userInfo, drivers, handleSelectUser, userID, handleClick } = props;
      console.log({userInfo}, {drivers});

      const driverElem = drivers.map(el => {
        return(el.status === 0 ?
          <CardForm key={el.id} >
            <Div onClick={handleSelectUser(el.id)} userID={userID} id={el.id}>
              <h2>{el.id}</h2>
              <span>{el.name}</span>
              <span>{el.date}</span><br/>
            </Div>
          </CardForm>
          : null);
      });

      const callElem = (
        <CardForm>
          call list
        </CardForm>
      );

      return(
        <ReactFullpage.Wrapper>
          <div className="section">
            <span style={{ color: "#8e44ad" }}>{userInfo.id}</span>
            <span>님, 어서오세요.</span>
            <button onClick={fcmTest}>FCM Test</button>
          </div>
          <div className="section">
            <div>

              {!userInfo.position || userInfo.position === 0 ? (
                <div>
                  <Title>마음에 드는 운전자를 선택하세요:D</Title>
                  {driverElem}
                  <Button onClick={handleClick} style={{width:'80%'}} >
                    call
                  </Button>
                </div>
                ) : (
                <div>
                  <Title>당신이 요청받은 콜 리스트 입니다:D</Title>
                  {callElem}
                  <Button onClick={handleClick} style={{width:'80%'}} >
                    approval
                  </Button>
                </div>
              )}

            </div>
          </div>
        </ReactFullpage.Wrapper>
      );
    }}
  />
);

class Home extends React.Component {
  state = {
    userInfo: {},
    drivers: [],
    userID: '',
  };

  componentDidMount() {
    const { handleCheck, handleGetDriver } = this;
    handleCheck();
    handleGetDriver();
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

  handleGetDriver = async () => {
      await axios({
        method: 'get',
        url: `${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/apis/v1/driver/list`
      }).then(res => {
        this.setState({ drivers: res.data });
      }).catch(err => {
        console.log(err, 'error');
      });
  }

  handleSelectUser = userID => () => {
    this.setState({ userID });
  }

  handleClick = () => {
    const { userID, userInfo } = this.state;
    console.log(userInfo.position);

    let userType = userInfo.position === 0 || !userInfo.position ? `운전자` : `탑승자`;
    let confirmMsg = userInfo.position === 0 || !userInfo.position ? `${userID}님에게 호출을 요청하시겠습니까 ?` : `${userID}의 요청을 승낙 하시겠습니까 ?`;
    if(userID === '') {
      alert(`${userType}를 선택하여 주십시오.`);
    }else if(window.confirm(confirmMsg)) {
      // message call
    }else {
      this.setState({ userID: '' });
    }
  }

  render() {
    const { userInfo, drivers, userID } = this.state;
    // console.log('render drivers : ', drivers);

    return (
      <div>
        <FullpageWrapper
          userInfo={userInfo}
          drivers={drivers}
          userID={userID}
          handleSelectUser={this.handleSelectUser}
          handleClick={this.handleClick}
        />
      </div>
    );
  }
}

export default withCookies(withRouter(withStore(Home)));

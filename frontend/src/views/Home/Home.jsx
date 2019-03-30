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

const Title = styled.h1`
  text-align: center;
`;

const Div = styled.div`
  background: ${props => props.status !== 0 ? '#eee' : '#fff'};
`;

const FullpageWrapper = (props) => (
  <ReactFullpage
    {...fullpageProps}
    render = {({ state, fullpageApi }) => {
      const { userInfo, drivers } = props;
      console.log({userInfo}, {drivers});

      const driverElem = drivers.map((el, idx) => {
        return(
          <CardForm key={idx}>
            <Div status={el.status}>
              <h2>{el.id}</h2>
              <span>{el.name}</span>
              <span>{el.date}</span><br/>
              {el.status !== 0 ? <span style={{color:'red'}}>*운전중 입니다 !</span> : null}
            </Div>
          </CardForm>
        );
      });
      return(
        <ReactFullpage.Wrapper>
          <div className="section">
            <span style={{ color: "#8e44ad" }}>{userInfo.id}</span>
            <span>님, 어서오세요.</span>
            <button onClick={fcmTest}>FCM Test</button>
          </div>
          <div className="section">
            <div>
              <Title>마음에 드는 운전자를 선택하세요:D</Title>
              {driverElem}
              {!userInfo.position || userInfo.position === 0 ?
                (<Button>
                  call
                </Button>)
                :
                (<Button>
                  approval
                </Button>)
              }
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

  render() {
    const { userInfo, drivers } = this.state;
    // console.log('render drivers : ', drivers);

    return (
      <div>
        <FullpageWrapper
          userInfo={userInfo}
          drivers={drivers}
        />
      </div>
    );
  }
}

export default withCookies(withRouter(withStore(Home)));

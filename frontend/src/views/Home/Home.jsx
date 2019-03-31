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
  ${props => props.driverID === props.id ?
    `background: black;
    color: #fff;`
  : null}
`;

const FullpageWrapper = (props) => (
  <ReactFullpage
    {...fullpageProps}
    render = {({ state, fullpageApi }) => {
      const { userInfo, drivers, handleSelectDriver, driverID, handleCall } = props;
      // console.log({userInfo}, {drivers});

      const driverElem = drivers.map(el => {
        return(el.status === 0 ?
          <CardForm key={el.id} >
            <Div onClick={handleSelectDriver(el.id)} driverID={driverID} id={el.id}>
              <h2>{el.id}</h2>
              <span>{el.name}</span>
              <span>{el.date}</span><br/>
            </Div>
          </CardForm>
          : null);
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
                (<Button onClick={handleCall} style={{width:'80%'}} >
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
    driverID: '',
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

  handleSelectDriver = driverID => () => {
    this.setState({ driverID });
  }

  handleCall = () => {
    const { driverID } = this.state;

    if(driverID === '') {
      alert('운전자를 선택하여 주십시오.');
    }else if(window.confirm(`${driverID}님에게 호출을 요청하시겠습니까 ?`)) {
      // message call
    }else {
      this.setState({ driverID: '' });
    }
  }

  handleApproval = () => {
    
  }

  render() {
    const { userInfo, drivers, driverID } = this.state;
    // console.log('render drivers : ', drivers);

    return (
      <div>
        <FullpageWrapper
          userInfo={userInfo}
          drivers={drivers}
          handleSelectDriver={this.handleSelectDriver}
          driverID={driverID}
          handleCall={this.handleCall}
        />
      </div>
    );
  }
}

export default withCookies(withRouter(withStore(Home)));

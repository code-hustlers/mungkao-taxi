import React from "react";
import axios from "axios";
import { withCookies } from "react-cookie";
import { withRouter } from "react-router-dom";
import withStore from "../../lib/withStore";
import Button from '../../components/Button';
// fullpage
import ReactFullpage from '@fullpage/react-fullpage';
import 'fullpage.js/vendors/scrolloverflow';

const fullpageProps = {
  scrollOverflow: true,
  sectionsColor: ['#fff', '#fff'],
  anchors: ['my', 'do']
};

const FullpageWrapper = (...props) => (
  <ReactFullpage
    {...fullpageProps}
    render = {({ state, fullpageApi }) => {
      const { userInfo, status } = props[0];
      console.log({userInfo}, {status});
      return(
        <ReactFullpage.Wrapper>
          <div className="section">
            <span style={{color:'#8e44ad'}}>{userInfo.id}</span>
            <span>님, 어서오세요.</span>
          </div>
          <div className="section">
            {status === 1 ?
              (<Button>
                call
              </Button>)
              :
              (<Button>
                approval
              </Button>)
            }
          </div>
        </ReactFullpage.Wrapper>
      );
    }}
  />
)

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

    return (
      <div>
        <FullpageWrapper
          userInfo={userInfo}
          status={1}
        />
      </div>
    );
  }
}

export default withCookies(withRouter(withStore(Home)));

import React, { Component } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import AppRouter from "./Routes/AppRouter";
import { ThemeProvider } from "styled-components";
import DefaultTheme from "./styles/theme/DefaultTheme";
import { CookiesProvider } from "react-cookie";
import StoreProvider from "./store/Store";
import urlB64ToUint8Array from "./lib/urlB64ToUint8Array";
// import Messaging from "./lib/Messaging";
// import firebase from "firebase";

// const config = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASE_URL,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   publicVapidKey: process.env.REACT_APP_PUBLIC_VAPID_KEY
// };
const applicationServerPublicKey = process.env.REACT_APP_PUBLIC_KEY;

class App extends Component {
  state = {
    isSubscribed: false
  };
  // constructor(props) {
  //   super(props);
  //   // const messaging = new Messaging();
  //   // console.log("TCL: App -> constructor -> messaging", messaging);

  //   // firebase.initializeApp();
  //   // const messaging = firebase.messaging();
  //   // console.log("TCL: App -> constructor -> messaging", messaging);
  // }

  // async componentDidMount() {
  // TODO : Class나 함수로 빼는건 나중에 하고 여기서 구현부터 해봐야할 듯
  // 1. Initialize firebase
  // firebase.initializeApp(config);
  // 2. 메시징 객체 검색
  // Retrieve Firebase Messaging object.
  // const messaging = firebase.messaging();
  // // 3. 앱에서 웹 사용자 인증 정보 구성
  // // Add the public key generated from the console here.
  // messaging.usePublicVapidKey(config.publicVapidKey);
  // // 4. 알림 수신 권한 요청
  // messaging
  //   .requestPermission()
  //   .then(function() {
  //     console.log("Notification permission granted.");
  //     // TODO(developer): Retrieve an Instance ID token for use with FCM.
  //     // ...
  //   })
  //   .catch(function(err) {
  //     console.log("Unable to get permission to notify.", err);
  //   });
  // // 5. 등록 토큰 액세스
  // // 5-1. 현재 등록 토큰 검색
  // try {
  //   const token = await messaging.getToken();
  //   console.log("token do usuário:", token);
  // } catch (error) {
  //   console.error(error);
  // }
  // }
  subscribeUser = swRegistration => {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      })
      .then(subscription => {
        console.log("User is subscribed:", subscription);

        this.updateSubscriptionOnServer(subscription);

        this.setState({
          isSubscribed: true
        });
        // updateBtn();
      })
      .catch(err => {
        console.log("Failed to subscribe the user: ", err);
        // updateBtn();
      });
  };

  updateSubscriptionOnServer = subscription => {
    // TODO: Send subscription to application server
    const subscriptionJson = document.querySelector(".js-subscription-json");
    const subscriptionDetails = document.querySelector(
      ".js-subscription-details"
    );

    if (subscription) {
      subscriptionJson.textContent = JSON.stringify(subscription);
      subscriptionDetails.classList.remove("is-invisible");
    } else {
      subscriptionDetails.classList.add("is-invisible");
    }
  };

  componentDidMount() {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      console.log("Service Worker and Push is supported");

      navigator.serviceWorker
        .register("service-worker.js")
        .then(swReg => {
          console.log("Service Worker is registered", swReg);
          // eslint-disable-next-line no-undef
          // swRegistration = swReg;

          // Set the initial subscription value
          swReg.pushManager.getSubscription().then(subscription => {
            this.setState({
              isSubscribed: !(subscription === null)
            });

            if (this.state.isSubscribed) {
              console.log("User IS subscribed.");
            } else {
              console.log("User is NOT subscribed.");
              this.subscribeUser(swReg);
            }
          });
        })
        .catch(error => {
          console.error("Service Worker Error", error);
        });
    } else {
      console.warn("Push messaging is not supported");
      // eslint-disable-next-line no-undef
      // pushButton.textContent = "Push Not Supported";
    }
  }

  render() {
    return (
      <CookiesProvider>
        <StoreProvider>
          <ThemeProvider theme={DefaultTheme}>
            <>
              <AppRouter />
              <GlobalStyles />
            </>
          </ThemeProvider>
        </StoreProvider>
      </CookiesProvider>
    );
  }
}

export default App;

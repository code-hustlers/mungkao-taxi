import React, { useState, useEffect } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import AppRouter from "./Routes/AppRouter";
import { ThemeProvider } from "styled-components";
import DefaultTheme from "./styles/theme/DefaultTheme";
import { CookiesProvider } from "react-cookie";
import StoreProvider from "./store/Store";
import urlB64ToUint8Array from "./lib/urlB64ToUint8Array";

const App = () => {
  const [pushSubscriptionObject, setPushSubscriptionObject] = useState();

  useEffect(() => {
    console.log(
      "TCL: App -> process.env.REACT_APP_PUBLIC_VAPID_KEY",
      process.env.REACT_APP_PUBLIC_VAPID_KEY
    );

    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/push-notification-sw.js")
        .then(swReg => {
          console.log("SW Registered: ", swReg);
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              console.log("Permission: ", permission);
              swReg.pushManager
                .subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: urlB64ToUint8Array(
                    process.env.REACT_APP_PUBLIC_VAPID_KEY
                  )
                })
                .then(pushSubscriptionObject => {
                  setPushSubscriptionObject(pushSubscriptionObject);
                  console.log(pushSubscriptionObject);
                })
                .catch(error => console.log("TCL: App -> error", error));
            }
          });
        })
        .catch(error => console.error("Can't register SW: ", error));
    }
  }, []);

  console.log("TCL: App -> pushSubscriptionObject", pushSubscriptionObject);

  return (
    <CookiesProvider>
      <StoreProvider pushSubscriptionObject={pushSubscriptionObject}>
        <ThemeProvider theme={DefaultTheme}>
          <>
            <AppRouter />
            <GlobalStyles />
          </>
        </ThemeProvider>
      </StoreProvider>
    </CookiesProvider>
  );
};

export default App;

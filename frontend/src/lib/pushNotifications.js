import firebase from "firebase";
import urlB64ToUint8Array from "./urlB64ToUint8Array";

// const config = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASE_URL,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   publicVapidKey: process.env.REACT_APP_PUBLIC_VAPID_KEY
// };
// const applicationServerPublicKey = process.env.REACT_APP_PUBLIC_KEY;
const applicationServerPublicKey =
  "BNkm32r0KSF3b4-scserhQqTgcdB5vBc-G6y5HJPLVNMUnTPgucUH2DZNNR8MD2wReGSbyqRAG8HWtU7ZLa3_Sc";

let isSubscribed = false;
let swRegistration = null;

export const requestPermission = () => {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    console.log("Service Worker and Push is supported");

    navigator.serviceWorker
      .register("push-notification-sw.js")
      // .register("service-worker.js")
      .then(swReg => {
        console.log("Service Worker is registered", swReg);
        swRegistration = swReg;

        // Set the initial subscription value
        swReg.pushManager.getSubscription().then(subscription => {
          isSubscribed = !(subscription === null);

          if (isSubscribed) {
            console.log("User IS subscribed.");
          } else {
            console.log("User is NOT subscribed.");
            // subscribeUser(swReg);
          }
        });
      })
      .catch(error => {
        console.error("Service Worker Error", error);
      });
  } else {
    console.warn("Push messaging is not supported");
    return false;
  }
};

export const subscribeUser = () => {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(function(subscription) {
      console.log("User is subscribed:", subscription);

      console.log(JSON.stringify(subscription));
      // updateSubscriptionOnServer(subscription);

      isSubscribed = true;

      // updateBtn();
    })
    .catch(function(err) {
      console.log("Failed to subscribe the user: ", err);
      // updateBtn();
    });
};

export const initializeFirebase = () => {
  firebase.initializeApp({
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
  });

  console.log("[1] : initializeFirebase");
};
// navigator.serviceWorker.register("/my-sw.js").then(registration => {
//   firebase.messaging().useServiceWorker(registration);
// });

export const askForPermissioToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging();
    await messaging.requestPermission();
    const token = await messaging.getToken();
    console.log("token do usuário:", token);

    return token;
  } catch (error) {
    console.error(error);
  }
};

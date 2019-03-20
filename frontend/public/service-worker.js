/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
// Google PWA Version

// Firebase Version.
// import firebase from "firebase";

// importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js");
// importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js");
// firebase.initializeApp({
//   messagingSenderId: ""
// });
// const messaging = firebase.messaging();
// var messaging = firebase.messaging();

// [START background_handler]
// messaging.setBackgroundMessageHandler(function(payload) {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload
//   );
//   // Customize notification here
//   var notificationTitle = "Background Message Title";
//   var notificationOptions = {
//     body: "Background Message body.",
//     icon: "/firebase-logo.png"
//   };

//   return self.registration.showNotification(
//     notificationTitle,
//     notificationOptions
//   );
// });
// [END background_handler]
self.addEventListener("install", e => {
  console.log("Installed My Service Worker!");
});

self.addEventListener("push", function(event) {
  console.log("[Service Worker] Push Received.");
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = "Push Codelab";
  const options = {
    // body: "Yay it works.",
    body: event.data.text(),
    icon: "images/icon.png",
    badge: "images/badge.png"
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function(event) {
  console.log("[Service Worker] Notification click Received.");

  event.notification.close();

  event.waitUntil(clients.openWindow("https://developers.google.com/web/"));
});

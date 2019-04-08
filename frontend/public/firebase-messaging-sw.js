/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
console.log("firebase-messaing-sw.js");
importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  messagingSenderId: "760674505097"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// 아래 코드는 service worker말고 다른 js에서 호출해야함 여기서 호출하면 에러
// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.setBackgroundMessageHandler` handler.

messaging.setBackgroundMessageHandler(function(payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  var notificationTitle = "Background Message Title";
  var notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png"
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

// Push Noti
// self.addEventListener("install", e => {
//   console.log("Installed My Service Worker!");
// });

// self.addEventListener("push", function(event) {
//   console.log("[Service Worker] Push Received.");
//   console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

//   const title = "멍카오택시 푸시 테스트";
//   const options = {
//     // body: "Yay it works.",
//     body: event.data.text(),
//     icon: "/mungkao-taxi-logo.png",
//     badge: "/mungkao-taxi-logo.png"
//   };

//   event.waitUntil(self.registration.showNotification(title, options));
// });

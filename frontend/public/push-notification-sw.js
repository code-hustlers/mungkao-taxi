/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
self.addEventListener("install", e => {
  console.log(
    "[Mungkao Service Worker] Installed Push Notification Service Worker!"
  );
});

self.addEventListener("push", function(event) {
  console.log("[Mungkao Service Worker] Push Received.");
  console.log(
    `[Mungkao Service Worker] Push had this data: "${event.data.text()}"`
  );

  const title = "멍카오 택시";
  const options = {
    body: event.data.text(),
    // icon: "./mungkao-taxi.png",
    icon: "./mungkao-taxi-logo.png",
    badge: "./mungkao-taxi-logo.png"
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function(event) {
  console.log("[Mungkao Service Worker] Notification click Received.");

  event.notification.close();
  // event.waitUntil(clients.openWindow("https://developers.google.com/web/"));
});

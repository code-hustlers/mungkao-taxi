self.addEventListener("install", e => {
  console.log("Installed My Service Worker!2333333333332222");
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

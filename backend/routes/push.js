const webpush = require("web-push");

function pushMungkao(pushSubscription) {
  console.log("TCL: pushMungkao -> pushSubscription", pushSubscription);
  // VAPID keys should only be generated only once.
  const vapidKeys = webpush.generateVAPIDKeys();

  const { SERVER_KEY } = process.env;

  webpush.setGCMAPIKey(SERVER_KEY);
  webpush.setVapidDetails(
    "matilto:qvil1127@gmail.com",
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );

  webpush.sendNotification(pushSubscription, "Your Push Payload Text");
}

module.exports = app => {
  app.get("/push", (req, res) => {
    console.log("TCL: /get");
    res.send("Ready Push!");
  });

  app.post("/push", (req, res) => {
    const { subscription } = req.body;
    console.log("TCL: req.body", req.body);
    res.send("Success Push Request!");
    pushMungkao(subscription);
  });
};

const webpush = require("web-push");

function pushMunkao() {
  // VAPID keys should only be generated only once.
  const vapidKeys = webpush.generateVAPIDKeys();

  const { API_KEY } = process.env;

  webpush.setGCMAPIKey(API_KEY);
  webpush.setVapidDetails(
    "matilto:qvil1127@gmail.com",
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );

  // This is the same output of calling JSON.stringify on a PushSubscription
  const pushSubscription = {
    endpoint:
      "https://fcm.googleapis.com/fcm/send/eD8uM6k4T8E:APA91bGRtvBCyH0mLjQ3MnegYeZ79WwBM2jalR23slKz_TL9ui5Tn6RjI_5FQHzm8RfYiMH9uEwZg_hx3mz5WY6ejIUrOWsXmvHXRAClreTYamNbORQx0eV_JLDCkcbEodw-QS6jkGqn",
    expirationTime: null,
    keys: {
      p256dh:
        "BMliYIsakstGaJh9es5CYRjePDyhDCsoM9z60J4jRFRz4Ei8WGJcvJvNAOSZgpsiWT5m7WEf2rAu5Yu33ahddQ4",
      auth: "Km4Gzxom_vyfotUQGzNjzA"
    }
  };

  webpush.sendNotification(pushSubscription, "Your Push Payload Text");
}

module.exports = app => {
  app.get("/push", (req, res) => {
    console.log("TCL: /get");
    res.send("Ready Push!");
  });

  app.post("/push", (req, res) => {
    console.log("TCL: res", res);
    console.log(req.body);
    console.log(req.body.subscription);
    res.send("Push!");
    pushMunkao();
  });
};

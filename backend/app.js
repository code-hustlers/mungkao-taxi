var exprees = require("express");
var app = exprees();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var morgan = require("morgan");
var jwt = require("jsonwebtoken");
var session = require("express-session");
const webpush = require("web-push");
require("dotenv").config();

app.use(
  session({
    secret: "MuNgkaOSessIOn",
    resave: false,
    saveUninitialized: true
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.set("jwt-secret", "MuNgkaO");

var port = process.env.PORT || 8081;

// CORS
app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST,GET,OPTIONS,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type,Accept");
  next();
});

const { DB_ID, DB_PW, DB_NAME, DB_URL } = process.env;
console.log(
  "TCL: DB_ID, DB_PW, DB_NAME, DB_URL",
  DB_ID,
  DB_PW,
  DB_NAME,
  DB_URL
);

// 몽고디비 연결
// Mongo Driver
// const MongoClient = require("mongodb").MongoClient;
// const uri = `mongodb+srv://${DB_ID}:${DB_PW}@${DB_URL}/${DB_NAME}?retryWrites=true/`;
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db(`${DB_NAME}`).collection("users");

//   console.log(collection);
//   // perform actions on the collection object
//   client.close();
// });

var db = mongoose.connection;
db.on("error", console.error);
db.once("open", () => {
  console.log("Connected mongod server");
});

mongoose
  .connect(`mongodb+srv://${DB_ID}:${DB_PW}@${DB_URL}/${DB_NAME}`, {
    useNewUrlParser: true
  })
  .then(
    data => {
      const state = data.connection._hasOpened;
      if (!state) {
        mongoose.connect(`mongodb://${DB_ID}:${DB_PW}@${DB_URL}`, {
          useNewUrlParser: true
        });
      }
    },
    err => {
      console.log(err);
    }
  );

// model import
var User = require("./models/user");

var router = require("./routes")(app, jwt, User);

var server = app.listen(port, () => {
  console.log("Express server start " + port);
});

// Web Push
app.post("/push", (req, res) => {
  console.log("TCL: res", res);
  console.log(req.body);
  console.log(req.body.subscription);
  res.send("Push!");
  pushMunkao();
});

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

var exprees = require("express");
var app = exprees();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var morgan = require("morgan");
var jwt = require("jsonwebtoken");
var session = require("express-session");
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

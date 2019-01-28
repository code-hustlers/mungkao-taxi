var exprees = require("express");
var app = exprees();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var morgan = require("morgan");
var jwt = require("jsonwebtoken");
var session = require("express-session");

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

app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST,GET,OPTIONS,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type,Accept");
  next();
});

// 몽고디비 연결
var db = mongoose.connection;
db.on("error", console.error);
db.once("open", () => {
  console.log("Connected mongod server");
});

mongoose.connect(
  "mongodb://localhost/mungkao",
  { useNewUrlParser: true }
);

// model import
var User = require("./models/user");

var router = require("./routes")(app, jwt, User);

var server = app.listen(port, () => {
  console.log("Express server start " + port);
});

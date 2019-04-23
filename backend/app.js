import fs from "fs";
import http from "http";
import https from "https";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";
import jwt from "jsonwebtoken";
import session from "express-session";
// model import
import User from "./models/user";
import Call from "./models/call";
// Routes
import { authRoutes, callRoutes } from "./routes";

const app = express();

var privateKey = fs.readFileSync("./localhost-privkey.pem", "utf8");
var certificate = fs.readFileSync("./localhost-cert.pem", "utf8");
var credentials = { key: privateKey, cert: certificate };

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);

dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

// CORS
app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST,GET,OPTIONS,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type,Accept");
  next();
});

app.use("/static", express.static("build"));

app.use(
  session({
    secret: "MuNgkaOSessIOn",
    resave: false,
    saveUninitialized: true
  })
);

app.set("jwt-secret", "MuNgkaO");

const port = process.env.PORT || 8081;

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

const db = mongoose.connection;
db.on("error", console.error);
db.once("open", () => {
  console.log("Connected mongod server");
});

mongoose.connect(`mongodb+srv://${DB_ID}:${DB_PW}@${DB_URL}/${DB_NAME}`, {
  useNewUrlParser: true,
  useCreateIndex: true
});
// .then(
//   data => {
//     const state = data.connection._hasOpened;
//     if (!state) {
//       mongoose.connect(`mongodb://${DB_ID}:${DB_PW}@${DB_URL}`, {
//         useNewUrlParser: true
//       });
//     }
//   },
//   err => {
//     console.log(err);
//   }
// );

authRoutes(app, jwt, User);
callRoutes(app, User, Call);
require("./routes/push")(app);

app.listen(port, () => {
  console.log("Express server start " + port);
});

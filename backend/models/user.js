var mongoose = require("mongoose");
var bcrypts = require("bcryptjs");
var Schema = mongoose.Schema;

const userSchema = new Schema({
  id: { type: String, unique: true, lowercase: true },
  pw: String,
  name: String,
  position: Number, // 0: 탑승자 1: 운전자
  status: Number, // 0: 대기, 1: 운전,탑승
  create_date: { type: Date, default: Date.now() },
  token: { type: String, default: "" }
});

module.exports = mongoose.model("user", userSchema);

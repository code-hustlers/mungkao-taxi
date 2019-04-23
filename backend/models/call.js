var mongoose = require("mongoose");
var bcrypts = require("bcryptjs");
var Schema = mongoose.Schema;

const callSchema = new Schema({
    driverId: String,
    userId: String,
    sPoint: String,
    destination: String,
    price: Number,
    call_date: { type: Date, default: Date.now() },
    status: Number, // 0 대기, 1 승인, 2 거절
    token: String
});

module.exports = mongoose.model("call", callSchema);

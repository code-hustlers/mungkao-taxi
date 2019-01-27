var mongoose = require('mongoose');
var bcrypts = require('bcryptjs');
var Schema = mongoose.Schema;

const userSchema = new Schema({
    id: String,
    pw: String,
    name: String,
    position: String,
    status: String,
    create_date: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('user', userSchema);
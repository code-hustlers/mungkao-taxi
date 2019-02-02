var mongoose = require('mongoose');
var bcrypts = require('bcryptjs');
var Schema = mongoose.Schema;

const userSchema = new Schema({
    id: {type: String, unique: true, lowercase: true},
    pw: String,
    name: String,
    position: Number,
    status: Number,
    create_date: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('user', userSchema);
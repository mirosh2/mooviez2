const { Schema } = require("mongoose");

const user = new Schema({
  login: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
  	type: Boolean,
  	default: false
  },
  lastLogin: {
  	type: Date,
  	default: null
  }
});

module.exports = user;
const { Schema } = require("mongoose");

const movies = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
  	type: Date,
  	default: Date.now
  },
  image: {
    type: String
  }
});

module.exports = movies;
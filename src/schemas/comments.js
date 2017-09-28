const { Schema } = require("mongoose");

const comments = new Schema({
  text: {
    type: String,
    required: true,
    unique: true
  },
  userID: {
    type: Schema.Types.ObjectId,
    required: true
  },
  movieID: {
    type: Schema.Types.ObjectId,
    required: true
  },
  published: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = comments;
const { Schema } = require("mongoose");

const likes = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    required: true
  },
  movieID: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

module.exports = likes;
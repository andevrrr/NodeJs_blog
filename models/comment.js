const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

exports.commentSchema = commentSchema;
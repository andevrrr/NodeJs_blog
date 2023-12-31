const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const { commentSchema } = require('./comment');

const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  isFeatured: {
    type: Boolean,
    default: false
},
isVisible: {
    type: Boolean,
    default: true
},
  comments: [commentSchema] 
});

module.exports = mongoose.model('Post', postSchema);

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const { commentSchema } = require('./comment');

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    inStock: {
        type: Boolean,
        required: true
    },
    comments: [commentSchema] 
});

module.exports = mongoose.model('Product', productSchema);
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
    isFeatured: {
        type: Boolean,
        default: false
    },
    isVisible: {
        type: Boolean,
        default: true
    },
    category: [
        {
          type: Schema.Types.ObjectId,
          ref: "ProductCategory",
        },
      ],
    comments: [commentSchema]
});

module.exports = mongoose.model('Product', productSchema);
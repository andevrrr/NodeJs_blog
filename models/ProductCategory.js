const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productCategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            }
        }
    ]
})

module.exports = mongoose.model('ProductCategory', productCategorySchema);
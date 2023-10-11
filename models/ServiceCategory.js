const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const serviceCategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    services: [
        {
            serviceId: {
                type: Schema.Types.ObjectId,
                ref: 'Service'
            }
        }
    ]
})

module.exports = mongoose.model('ServiceCategory', serviceCategorySchema);
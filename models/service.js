const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  category: [
    {
      type: Schema.Types.ObjectId,
      ref: "ServiceCategory",
    },
  ],
});

module.exports = mongoose.model("Service", serviceSchema);

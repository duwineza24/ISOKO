const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

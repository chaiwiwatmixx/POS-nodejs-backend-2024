const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    productName: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    amount: {
      type: String,
      required: [true, "Please enter amount"],
      trim: true,
    },
    price: {
      type: String,
      required: [true, "Please enter price"],
      trim: true,
    },
    cost: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    dateTime: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

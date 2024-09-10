const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    orderNumber: {
      type: String,
      trim: true,
    },
    table: {
      type: String,
      required: true,
      trim: true,
    },
    peopleNumber: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Schema.Types.Mixed,
      // type: String,
      trim: true,
    },
    totalPay: {
      type: String,
      trim: true,
    },
    dateTime: {
      type: String,
      required: true,
      trim: true,
    },
    statusPay: {
      type: String,
      required: true,
      trim: true,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("order", orderSchema);

module.exports = Order;

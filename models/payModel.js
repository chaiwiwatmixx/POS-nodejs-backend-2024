const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const paySchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "Please enter your email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid emaial",
      ],
    },
    payCode: {
      type: String,
      required: true,
      trim: true,
    },
    payAmount: {
      type: Number,
      required: [true, "Please enter topup amount"],
      trim: true,
    },
    package: {
      type: Schema.Types.Mixed,
      require: true,
      trim: true,
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

const Pay = mongoose.model("Pay", paySchema);

module.exports = Pay;

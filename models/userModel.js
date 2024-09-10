const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// const moment = require("moment");
const { Schema, model } = mongoose;

const userSchema = mongoose.Schema(
  {
    userCode: {
      type: String,
      require: [true, "Please enter your username"],
    },
    username: {
      type: String,
      require: [true, "Please enter your username"],
    },
    password: {
      type: String,
      require: [true, "Please enter your password"],
      minLength: [6, "Password must be 6 characters or more"],
    },
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
    phone: {
      type: String,
      require: [true, "Please enter your phone"],
      minLength: [10, "Password must be 10 characters or more"],
    },
    package: {
      type: Schema.Types.Mixed,
      require: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

//Encrypt password before saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  //hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;

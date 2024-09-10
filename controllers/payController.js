const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Pay = require("../models/payModel");

const createPay = asyncHandler(async (req, res) => {
  const { email, payAmount, package } = req.body;

  //Package
  const packages = {
    package: "Free",
    amount: 150,
  };
  if (package === "Basic") {
    packages.package = "Basic";
    packages.amount = 1500;
  } else if (package === "Pro") {
    packages.package = "Pro";
    packages.amount = 2500;
  } else if (package === "ProPlus") {
    packages.package = "ProPlus";
    packages.amount = 5000;
  }

  //Validation all
  if (!email || !payAmount || !package) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }

  //payCode
  const numberPay = await Pay.find({ email: email });
  // console.log("count = ", numberUser);
  const payCode = "Pay-" + numberPay.length;

  //datetime
  const dateTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Bangkok",
  });

  //Create Pay
  const pay = await Pay.create({
    email: email,
    payCode,
    payAmount,
    package: packages,
    dateTime,
  });

  //update package in user db
  const updatePackage = await User.findOneAndUpdate(
    email,
    {
      package: packages,
    },
    { new: true }
  );

  res.status(201).json({ pay: pay, package: updatePackage.package });
});

module.exports = createPay;

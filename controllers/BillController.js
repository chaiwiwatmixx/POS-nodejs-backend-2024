const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const User = require("../models/userModel");

const testBill = asyncHandler(async (req, res) => {
  res.status(200).json("testBill");
});

//get all bill
const getBills = asyncHandler(async (req, res) => {
  const bills = await Order.find({ user: req.user.id, statusPay: "pending" });

  res.status(200).json(bills);
});

//get bill by ID
const getBill = asyncHandler(async (req, res) => {
  const bill = await Order.findById(req.params.id);

  //Validation all
  if (!bill) {
    res.status(404);
    throw new Error("Bill not found");
  }

  if (bill.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Bill not authorized");
  }

  res.status(200).json(bill);
});

// createBill
const createBill = asyncHandler(async (req, res) => {
  const { username, table, peopleNumber, dateTime } = req.body;

  //Validation all
  if (!table || !username || !peopleNumber || !dateTime) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }

  //gen orderNumber
  const billNumber = await Order.countDocuments(req.params.id);
  const orderNumber = billNumber + 1;

  // Create Product
  const bill = await Order.create({
    user: req.user.id,
    username,
    table,
    orderNumber,
    peopleNumber,
    dateTime,
  });

  // cut bill
  // const updateBill = await User.findByIdAndUpdate(
  //   { _id: req.user.id },
  //   { package: package },
  //   { new: true, runValidators: true }
  // );

  res.status(201).json(bill);
});

//delete bill
const deleteBill = asyncHandler(async (req, res) => {
  const bill = await Order.findById(req.params.id);

  //Validation all
  if (!bill) {
    res.status(404);
    throw new Error("bill not found");
  }

  if (bill.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Product not authorized");
  }

  //delete Product
  await bill.remove();
  res.status(200).json({ message: "bill delete success." });
});

// payBill
const payBill = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const bill = await Order.findById(id);

  //Validation all
  if (!bill) {
    res.status(404);
    throw new Error("bill not found");
  }

  if (bill.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Bill not authorized");
  }

  // Create Product
  const payBill = await Order.findByIdAndUpdate(
    { _id: id },
    { statusPay: "successful" }
  );

  res.status(201).json("Payment successful");
});

module.exports = {
  createBill,
  testBill,
  getBills,
  getBill,
  deleteBill,
  payBill,
};

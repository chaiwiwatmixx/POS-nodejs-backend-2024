const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const User = require("../models/userModel");

//create and update Order
const createOrder = asyncHandler(async (req, res) => {
  const billId = req.params.id;
  const { order, totalPay } = req.body;
  const getOrder = await Order.findById(billId);

  //Validation all
  if (!order) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }

  if (getOrder.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Product not authorized");
  }

  // Create Product
  const orders = await Order.findByIdAndUpdate(
    { _id: billId },
    {
      order: order,
      totalPay: totalPay,
    }
  );


  res.status(201).json(orders);
});

module.exports = {
  createOrder,
};

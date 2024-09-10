const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const mongoose = require("mongoose");
const validateDataStat = require("../utils/validateDataStat");
const statService = require("../services/stat-service");

// Daily
const getDailyState = asyncHandler(async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.user.id); // userId from token
  const { selectedDate, period } = req.query;

  validateDataStat(userId, selectedDate, period);

  // get data stat
  const stats = await statService.statRevenueService(
    userId,
    selectedDate,
    period
  );

  if (stats.length === 0) {
    res.status(404);
    throw new Error("No statistics found");
  }

  res.status(200).json(
    stats.map((stat) => ({
      date: stat._id,
      totalOrders: stat.totalOrders,
      totalAmount: stat.totalAmount.toFixed(2),
    }))
  );
});

// Weekly
const getWeeklyStat = asyncHandler(async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.user.id); // userId from token
  const { selectedDate, period } = req.query;

  validateDataStat(userId, selectedDate, period);

  // get data stat
  const stats = await statService.statRevenueService(userId, selectedDate, period);

  if (stats.length === 0) {
    res.status(404);
    throw new Error("No statistics found");
  }

  res.status(200).json(
    stats.map((stat) => ({
      year: stat._id.year,
      week: stat._id.week,
      totalOrders: stat.totalOrders,
      totalAmount: stat.totalAmount.toFixed(2),
    }))
  );
});

// Monthly
const getMonthlyStat = asyncHandler(async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.user.id); // userId from token
  const { selectedDate, period } = req.query;

  validateDataStat(userId, selectedDate, period);

  // get data stat
  const stats = await statService.statRevenueService(userId, selectedDate, period);

  if (stats.length === 0) {
    res.status(404);
    throw new Error("No statistics found");
  }

  res.status(200).json(
    stats.map((stat) => ({
      year: stat._id.year,
      month: stat._id.month,
      totalOrders: stat.totalOrders,
      totalAmount: stat.totalAmount.toFixed(2),
    }))
  );
});

// yearly
const getYearlyStat = asyncHandler(async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.user.id); // userId from token
  const { selectedDate, period } = req.query;

  validateDataStat(userId, selectedDate, period);

  // get data stat
  const stats = await statService.statRevenueService(userId, selectedDate, period);

  if (stats.length === 0) {
    res.status(404);
    throw new Error("No statistics found");
  }

  res.status(200).json(
    stats.map((stat) => ({
      year: stat._id,
      totalOrders: stat.totalOrders,
      totalAmount: stat.totalAmount.toFixed(2),
    }))
  );
});

const dailyFoodStat = asyncHandler(async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.user.id);
  const { selectedDate, period } = req.query;

  validateDataStat(userId, selectedDate, period);

  // get data stst
  const stats = await statService.statFoodService(userId, selectedDate, period);

  if (stats.length === 0) {
    res.status(404);
    throw new Error("No statistics found for the selected period");
  }

  res.status(200).json(
    stats.map((stat) => ({
      date: stat._id.date,
      productName: stat._id.productName,
      totalQuantity: stat.totalQuantity,
      totalRevenue: stat.totalRevenue.toFixed(2),
    }))
  );
});

const monthlyFoodStat = asyncHandler(async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.user.id);
  const { selectedDate, period } = req.query;

  validateDataStat(userId, selectedDate, period);

  // get data stst
  const stats = await statService.statFoodService(userId, selectedDate, period);

  if (stats.length === 0) {
    res.status(404);
    throw new Error("No statistics found for the selected period");
  }

  res.status(200).json(
    stats.map((stat) => ({
      date: stat._id.month,
      productName: stat._id.productName,
      totalQuantity: stat.totalQuantity,
      totalRevenue: stat.totalRevenue.toFixed(2),
    }))
  );
});

const weeklyFoodStat = asyncHandler(async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.user.id);
  const { selectedDate, period } = req.query;

  validateDataStat(userId, selectedDate, period);

  // get data stst
  const stats = await statService.statFoodService(userId, selectedDate, period);

  if (stats.length === 0) {
    res.status(404);
    throw new Error("No statistics found for the selected period");
  }

  res.status(200).json(
    stats.map((stat) => ({
      date: stat._id.week,
      productName: stat._id.productName,
      totalQuantity: stat.totalQuantity,
      totalRevenue: stat.totalRevenue.toFixed(2),
    }))
  );
});

const yearlyFoodStat = asyncHandler(async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.user.id);
  const { selectedDate, period } = req.query;

  validateDataStat(userId, selectedDate, period);

  // get data stst
  const stats = await statService.statFoodService(userId, selectedDate, period);

  if (stats.length === 0) {
    res.status(404);
    throw new Error("No statistics found for the selected period");
  }

  res.status(200).json(
    stats.map((stat) => ({
      date: stat._id.year,
      productName: stat._id.productName,
      totalQuantity: stat.totalQuantity,
      totalRevenue: stat.totalRevenue.toFixed(2),
    }))
  );
});

module.exports = {
  getDailyState,
  dailyFoodStat,
  getWeeklyStat,
  getMonthlyStat,
  getYearlyStat,
  monthlyFoodStat,
  weeklyFoodStat,
  yearlyFoodStat,
};

// const getFoodState = asyncHandler(async (req, res) => {
//   const { period } = req.params;
//   const userId = mongoose.Types.ObjectId(req.user.id);

//   if (!userId) {
//     res.status(400);
//     throw new Error("UserId not found. Please log in.");
//   }

//   if (!period) {
//     res.status(400);
//     throw new Error("Period not found");
//   }

//   // Set a time period for group
//   let groupId;
//   if (period === "daily") {
//     groupId = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
//   } else if (period === "weekly") {
//     groupId = {
//       year: { $year: "$createdAt" },
//       week: { $isoWeek: "$createdAt" },
//     };
//   } else if (period === "monthly") {
//     groupId = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
//   } else if (period === "yearly") {
//     groupId = { $dateToString: { format: "%Y", date: "$createdAt" } };
//   } else {
//     res.status(400);
//     throw new Error("Invalid period");
//   }

//   const stats = await Order.aggregate([
//     { $match: { user: userId } },
//     { $unwind: "$order" },
//     {
//       $group: {
//         _id: {
//           date: groupId,
//           productName: "$order.productName",
//         },
//         totalQuantity: { $sum: "$order.quantity" },
//         totalRevenue: {
//           $sum: {
//             $multiply: [
//               "$order.quantity",
//               { $toDouble: "$order.unofficialPrice" },
//             ],
//           },
//         },
//       },
//     },
//     {
//       $sort: { "_id.date": 1, "_id.productName": 1 },
//     },
//   ]);

//   res.status(200).json(
//     stats.map((stat) => ({
//       date: stat._id.date,
//       productName: stat._id.productName,
//       totalQuantity: stat.totalQuantity,
//       totalRevenue: stat.totalRevenue.toFixed(2),
//     }))
//   );
// });

const Order = require("../models/orderModel");

const statRevenueService = (userId, selectedDate, period) => {
  let groupId;
  let sort;
  const endDate = new Date(selectedDate);
  const startDate = new Date(endDate);

  if (period === "daily") {
    startDate.setDate(endDate.getDate() - 14); // selectedDate - 14
    groupId = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
    sort = { _id: 1 };
  } else if (period === "weekly") {
    startDate.setDate(endDate.getDate() - 7 * 11); // 12 weeks
    groupId = {
      year: { $year: "$createdAt" },
      week: { $isoWeek: "$createdAt" },
    };
    sort = { "_id.year": 1, "_id.week": 1 };
  } else if (period === "monthly") {
    startDate.setMonth(endDate.getMonth() - 11); // 12 months
    groupId = {
      year: { $year: "$createdAt" },
      month: { $month: "$createdAt" },
    };
    sort = { "_id.year": 1, "_id.month": 1 };
  } else if (period === "yearly") {
    startDate.setFullYear(endDate.getFullYear() - 4); // 5 years
    groupId = { $year: "$createdAt" };
    sort = { _id: 1 };
  } else {
    throw new Error("Invalid period specified");
  }

  return Order.aggregate([
    {
      $match: {
        user: userId,
        createdAt: { $gte: startDate, $lte: endDate }, // filter startDate -> endDate
      },
    },
    {
      $group: {
        _id: groupId,
        totalOrders: { $sum: 1 },
        totalAmount: { $sum: { $toDouble: "$totalPay" } },
      },
    },
    {
      $sort: sort,
    },
  ]);
};

const statFoodService = (userId, selectedDate, period) => {
  let groupId;
  const selectDate = new Date(selectedDate);
  let startDate;

  if (period === "daily") {
    startDate = new Date(selectDate);
    groupId = {
      date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      productName: "$order.productName",
    };
  } else if (period === "weekly") {
    startDate = new Date(selectDate);
    startDate.setDate(selectDate.getDate() - 6); // 1 weeks ย้อนกลับ 6 วันเพื่อให้ได้ 1 สัปดาห์เต็ม
    groupId = {
      week: { $isoWeek: "$createdAt" },
      productName: "$order.productName",
    };
  } else if (period === "monthly") {
    startDate = new Date(selectDate.getFullYear(), selectDate.getMonth(), 1); // months วันที่ 1 ของเดือน
    groupId = {
      month: { $month: "$createdAt" },
      productName: "$order.productName",
    };
  } else if (period === "yearly") {
    startDate = new Date(selectDate.getFullYear(), 0, 1); // years วันที่ 1 มกราคมของปีนั้น
    groupId = {
      year: { $year: "$createdAt" },
      productName: "$order.productName",
    };
  } else {
    throw new Error("Invalid period specified");
  }

  let startOfDay = new Date(startDate.setUTCHours(0, 0, 0, 0)); //00:00:00
  let endOfDay = new Date(selectDate.setUTCHours(23, 59, 59, 999)); //23:59:59

  console.log("startDate = ", startDate);
  console.log("startOfDay = ", startOfDay);
  console.log("endOfDay = ", endOfDay);

  return Order.aggregate([
    {
      $match: { user: userId, createdAt: { $gte: startOfDay, $lte: endOfDay } },
    },
    { $unwind: "$order" },
    {
      $group: {
        _id: groupId,
        totalQuantity: { $sum: "$order.quantity" },
        totalRevenue: {
          $sum: {
            $multiply: [
              "$order.quantity",
              { $toDouble: "$order.unofficialPrice" },
            ],
          },
        },
      },
    },
    {
      $sort: { totalQuantity: -1 },
    },
  ]);
};
module.exports = { statRevenueService, statFoodService };


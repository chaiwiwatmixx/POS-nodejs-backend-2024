const express = require("express");
const {
  getDailyState,
  dailyFoodStat,
  getWeeklyStat,
  getMonthlyStat,
  getYearlyStat,
  monthlyFoodStat,
  weeklyFoodStat,
  yearlyFoodStat,
} = require("../controllers/stateController");
const protect = require("../middleWare/authMiddleware");
const Route = express.Router();

Route.get("/daily", protect, getDailyState);
Route.get("/week", protect, getWeeklyStat);
Route.get("/month", protect, getMonthlyStat);
Route.get("/year", protect, getYearlyStat);
Route.get("/food/daily", protect, dailyFoodStat);
Route.get("/food/weekly", protect, weeklyFoodStat);
Route.get("/food/monthly", protect, monthlyFoodStat);
Route.get("/food/yearly", protect, yearlyFoodStat);

module.exports = Route;

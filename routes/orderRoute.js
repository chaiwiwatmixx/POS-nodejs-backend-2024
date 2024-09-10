const express = require("express");
const protect = require("../middleWare/authMiddleware");
const { createOrder } = require("../controllers/OrderController");
const router = express.Router();

router.post("/:id", protect, createOrder);

module.exports = router;

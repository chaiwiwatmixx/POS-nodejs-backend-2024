const express = require("express");
const protect = require("../middleWare/authMiddleware");
const createPay = require("../controllers/payController");
const router = express.Router();

router.post("/", createPay);

module.exports = router;

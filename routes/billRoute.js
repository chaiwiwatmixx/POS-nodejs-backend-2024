const express = require("express");
const protect = require("../middleWare/authMiddleware");
const {
  createBill,
  testBill,
  getBills,
  getBill,
  deleteBill,
  payBill,
} = require("../controllers/BillController");
const router = express.Router();

router.post("/", protect, createBill);
router.put("/:id", protect, payBill);
router.get("/", protect, getBills);
router.get("/:id", protect, getBill);
router.delete("/:id", protect, deleteBill);

module.exports = router;

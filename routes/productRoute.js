const express = require("express");
const protect = require("../middleWare/authMiddleware");
const { upload } = require("../utils/fileUpload");
const {
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  allProduct,
} = require("../controllers/ProductController");
const router = express.Router();

router.post("/", protect, upload.single("image"), addProduct);
router.get("/", protect, allProduct);
router.get("/:id", protect, getProduct);
router.patch("/:id", protect, upload.single("image"), updateProduct);
router.delete("/:id", protect, deleteProduct);
module.exports = router;

const express = require("express");
const {
  register,
  login,
  logout,
  getUser,
  loginStatus,
  ChangePassword,
  ForgotPassword,
  ResetPassword,
} = require("../controllers/userController");
const protect = require("../middleWare/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/getuser", protect, getUser);
router.get("/status", loginStatus);
router.patch("/", protect, ChangePassword);
router.post("/forgot", ForgotPassword);
router.put("//:resetToken", ResetPassword);

module.exports = router;

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const sendEmail = require("../utils/sendEmail");
const { checkUserExiste } = require("../services/user-service");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1D" });
};

//Register
const register = asyncHandler(async (req, res) => {
  const { username, password, email, phone } = req.body;

  //package
  const package = {
    package: "Free",
    amount: 150,
  };

  console.log(package);

  //Validation all
  if (!username || !email || !password || !phone || !package) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }

  // Check if user email already exists
  const userExiste = await User.findOne({ email, phone });

  if (userExiste) {
    res.status(400);
    throw new Error("Email has already been registered");
  }

  //Validation all
  if (password.length < 6 || phone.length < 10) {
    res.status(400);
    throw new Error(
      "Password must be 6 characters or more and Phone must be 10 characters or more"
    );
  }

  //UserCode
  const numberUser = await User.find({});
  // console.log("count = ", numberUser);
  const userCode = "POS-" + numberUser.length;

  // Create new user
  const user = await User.create({
    userCode,
    username,
    password,
    email,
    phone,
  });

  //Generate Token
  const token = generateToken(user._id);

  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //1day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, userCode, username, email, phone } = user;
    res.status(201).json({
      _id,
      userCode,
      username,
      email,
      phone,
      package,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//Login
const login = asyncHandler(async (req, res) => {
  const { password, email } = req.body;
  console.log(email);

  //Validation all
  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter your email and password");
  }

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found, please signup");
  }
  // Check Password is correct
  passwordIsCorrect = await bcrypt.compare(password, user.password);

  //Generate Token
  const token = generateToken(user._id);

  // Send HTTP-only cookie
  if (passwordIsCorrect) {
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });
  }

  if (user && passwordIsCorrect) {
    const { _id, username, email, phone } = user;
    res.status(200).json({
      _id,
      username,
      email,
      phone,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

//Logout
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Log out successfully" });
});

//Get User Data
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, username, email, phone } = user;
    res.status(200).json({
      _id,
      username,
      email,
      phone,
    });
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});

//Login status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  // Verify Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

//Change Password
const ChangePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, password } = req.body;

  if (!user) {
    res.status(400);
    throw new Error("User not found Please signup");
  }

  //Validate
  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Please enter old password and new password");
  }

  // check if old password matches new password in DB
  passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  //Save new password
  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send("Password changed successfully");
  } else {
    res.status(400);
    throw new Error("Old password is incorrect");
  }
});

//Forgot Password
const ForgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }

  // Delete token if it exists in DB
  const token = await Token.findOne({ userId: user.id });
  if (token) {
    await token.deleteOne();
  }

  // Create Reset Token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  // console.log(resetToken);

  // Hash token before saving to DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Save Token to DB
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), // thirty minutes
  }).save();

  // Construct Reset Url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // Send Email
  const message = `
    <h2>Hello${user.username}<h2/>
    <p>Please use the url below to reset your password</p>
    <p>this reset link is valid for only 30minutes.</p>

    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

    <p>Regards...</p>
    <p>Fastbot Team</p>
  `;

  const subject = "Password Reset Request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    res.status(500);
    throw new Error("Unable to send email Please try again");
  }
});

//Reset Password
const ResetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  // Hash token, then compare to Token in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Find token in DB
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token");
  }

  //Find user
  const user = await User.findOne({ _id: userToken.userId });
  user.password = password;
  await user.save();
  res.status(200).json({
    message: "Password Reset Successful, Please Login",
  });
});

module.exports = {
  register,
  login,
  logout,
  getUser,
  loginStatus,
  ChangePassword,
  ForgotPassword,
  ResetPassword,
};

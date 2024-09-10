const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const payRoute = require("./routes/payRoute");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const billRoute = require("./routes/billRoute");
const stateRoute = require("./routes/stateRoute");
const errorHandler = require("./middleWare/errorMiddleware");
const path = require("path");

const app = express();

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

//Routes Middleware
app.use("/api/users", userRoute);
app.use("/api/pay", payRoute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);
app.use("/api/bill", billRoute);
app.use("/api/state", stateRoute);
// app.get("/", (req, res) => {
//   res.send("Test");
// });

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

// Connect to DB and start server
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

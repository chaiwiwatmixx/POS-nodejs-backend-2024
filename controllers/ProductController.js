const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");

//add product
const addProduct = asyncHandler(async (req, res) => {
  const { productName, description, category, amount, price, cost } = req.body;

  console.log(req.body);

  //Validation all
  if (!productName || !amount || !price) {
    res.status(400);
    throw new Error("Please fill out all fields");
  }

  //Handle Image upload
  let imgDate = {};
  if (req.file) {
    imgData = {
      fileName: req.file.filename, // Use the generated filename
      // fileType: req.file.mimetype,
      // fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }
  console.log(imgData.fileName);

  //datetime
  const dateTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Bangkok",
  });

  //Create Product
  const product = await Product.create({
    user: req.user.id,
    productName,
    description,
    category,
    amount,
    price,
    cost,
    image: imgData.fileName,
    dateTime,
  });

  res.status(201).json(product);
});

//all product
const allProduct = asyncHandler(async (req, res) => {
  const getProducts = await Product.find({ user: req.user.id }).sort(
    "-createdAt"
  );

  res.status(200).json(getProducts);
});

//get by#id
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  //Validation all
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Product not authorized");
  }

  res.status(200).json(product);
});

//update Product
const updateProduct = asyncHandler(async (req, res) => {
  const { productName, description, category, amount, price, cost } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id);

  //Validation all
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Product not authorized");
  }

  //Handle Image upload
  let imgData = "";
  if (req.file) {
    console.log("req.file = ", req.file);
    imgData = req.file.filename; // Use the generated filename
  }

  //datetime
  const dateTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Bangkok",
  });

  //Create Product
  const updateProduct = await Product.findByIdAndUpdate(
    { _id: id },
    {
      productName,
      description,
      category,
      amount,
      price,
      cost,
      image: imgData.length === 0 ? product?.image : imgData,
      dateTime,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json(updateProduct);
});

//delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  //Validation all
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Product not authorized");
  }

  //delete Product
  await product.remove();
  res.status(200).json({ message: "Product delete success." });
});

module.exports = {
  addProduct,
  allProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};



const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const productStore = require("../data/products");


exports.getAllProducts = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Products fetched successfully.",
    data: productStore.getAllProducts(),
  });
});


exports.getProductById = asyncHandler(async (req, res) => {
  const product = productStore.findProductById(req.params.id);
  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  res.status(200).json({
    success: true,
    message: "Product fetched successfully.",
    data: product,
  });
});


exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, price } = req.validatedBody;

  const product = productStore.createProduct({ name, description, price });

  res.status(201).json({
    success: true,
    message: "Product created successfully.",
    data: product,
  });
});


exports.updateProduct = asyncHandler(async (req, res) => {
  const product = productStore.updateProduct(req.params.id, req.validatedBody);
  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully.",
    data: product,
  });
});


exports.deleteProduct = asyncHandler(async (req, res) => {
  const deleted = productStore.deleteProduct(req.params.id);
  if (!deleted) {
    throw new AppError("Product not found.", 404);
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully.",
    data: null,
  });
});
// productController: CRUD operations against the in-memory product store.
// Access control happens in the routes (authenticate + authorize), so these
// handlers only deal with "how" not "who is allowed".

const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const productStore = require("../data/products");

/**
 * GET /api/products
 * List all products. Admin and user allowed.
 */
exports.getAllProducts = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Products fetched successfully.",
    data: productStore.getAllProducts(),
  });
});

/**
 * GET /api/products/:id
 * Fetch a single product, 404 when it does not exist.
 */
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

/**
 * POST /api/products  (admin only)
 */
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, price } = req.validatedBody;

  const product = productStore.createProduct({ name, description, price });

  res.status(201).json({
    success: true,
    message: "Product created successfully.",
    data: product,
  });
});

/**
 * PUT /api/products/:id  (admin only)
 */
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

/**
 * DELETE /api/products/:id  (admin only)
 */
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
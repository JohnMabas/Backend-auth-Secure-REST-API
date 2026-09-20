// productRoutes: all product routes require authentication.
// Writes (POST/PUT/DELETE) additionally require the "admin" role,
// so a normal user receives 403 Forbidden on those.

const express = require("express");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");
const {
  validateCreateProduct,
  validateUpdateProduct,
} = require("../validators/productValidator");
const productController = require("../controllers/productController");

const router = express.Router();

// Every product route needs a valid token; then per-route role checks.
router.use(authenticate);

// Reads: admin and user allowed (public-ish once logged in).
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Writes: admin only -> user gets 403.
router.post(
  "/",
  authorize("admin"),
  validate(validateCreateProduct),
  productController.createProduct
);

router.put(
  "/:id",
  authorize("admin"),
  validate(validateUpdateProduct),
  productController.updateProduct
);

router.delete("/:id", authorize("admin"), productController.deleteProduct);

module.exports = router;
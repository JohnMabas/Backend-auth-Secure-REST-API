
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

router.use(authenticate);

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

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
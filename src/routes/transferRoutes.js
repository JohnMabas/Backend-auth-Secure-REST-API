const express = require("express");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/authenticate");
const { validateTransfer } = require("../validators/authValidator");
const transferController = require("../controllers/transferController");

const router = express.Router();

router.post("/", authenticate, validate(validateTransfer), transferController.makeTransfer);

module.exports = router;
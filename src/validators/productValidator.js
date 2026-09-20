// productValidator: validates and sanitizes product request bodies.

const AppError = require("../utils/AppError");

/**
 * Validate the payload for creating a product.
 * Rules:
 *  - name: required non-empty string
 *  - description: string (optional, may be empty)
 *  - price: number >= 0
 * Non-string/other unexpected field types are rejected.
 */
function validateCreateProduct(body) {
  if (body.name === undefined || typeof body.name !== "string") {
    throw new AppError("name must be a non-empty string.", 400);
  }
  const name = body.name.trim();
  if (name.length === 0) {
    throw new AppError("name cannot be empty.", 400);
  }

  if (body.description !== undefined && typeof body.description !== "string") {
    throw new AppError("description must be a string.", 400);
  }
  const description = typeof body.description === "string" ? body.description : "";

  if (
    body.price === undefined ||
    typeof body.price !== "number" ||
    isNaN(body.price)
  ) {
    throw new AppError("price must be a number.", 400);
  }
  if (body.price < 0) {
    throw new AppError("price must be a number greater than or equal to 0.", 400);
  }

  // Only the allowed fields are forwarded to the controller.
  return { name, description, price: body.price };
}

/**
 * Validate the payload for updating a product (same rules, fields optional).
 */
function validateUpdateProduct(body) {
  // At least one recognized field must be present.
  if (
    body.name === undefined &&
    body.description === undefined &&
    body.price === undefined
  ) {
    throw new AppError("Provide at least one field to update (name, description or price).", 400);
  }

  const updates = {};

  if (body.name !== undefined) {
    if (typeof body.name !== "string") {
      throw new AppError("name must be a non-empty string.", 400);
    }
    const name = body.name.trim();
    if (name.length === 0) {
      throw new AppError("name cannot be empty.", 400);
    }
    updates.name = name;
  }

  if (body.description !== undefined) {
    if (typeof body.description !== "string") {
      throw new AppError("description must be a string.", 400);
    }
    updates.description = body.description;
  }

  if (body.price !== undefined) {
    if (typeof body.price !== "number" || isNaN(body.price)) {
      throw new AppError("price must be a number.", 400);
    }
    if (body.price < 0) {
      throw new AppError("price must be a number greater than or equal to 0.", 400);
    }
    updates.price = body.price;
  }

  return updates;
}

module.exports = {
  validateCreateProduct,
  validateUpdateProduct,
};
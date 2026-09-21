
const AppError = require("../utils/AppError");


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

  return { name, description, price: body.price };
}


function validateUpdateProduct(body) {
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
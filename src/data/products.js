// In-memory product store, seeded with 3 sample products.
// NOTE: data is lost on server restart (see README "Known limitations").

// A single in-memory "table" of products.
const products = [
  {
    id: 1,
    name: "Wireless Mouse",
    description: "A comfortable ergonomic wireless mouse with silent clicks.",
    price: 19.99,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard with brown switches.",
    price: 79.5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "USB-C Monitor Hub",
    description: "8-in-1 docking station for laptop connectivity.",
    price: 49.0,
    createdAt: new Date().toISOString(),
  },
];

// Next id starts AFTER the seeded products so there are no collisions.
let nextProductId = products.length + 1;

/**
 * Return a copy of every product (safe: no object mutation from callers).
 * @returns {object[]}
 */
function getAllProducts() {
  return products;
}

/**
 * Find one product by id.
 * @param {number} id
 * @returns {object | undefined}
 */
function findProductById(id) {
  return products.find((product) => product.id === Number(id));
}

/**
 * Create and store a new product.
 * @param {{name: string, description: string, price: number}} productData
 * @returns {object} the stored product
 */
function createProduct({ name, description, price }) {
  const product = {
    id: nextProductId++,
    name,
    description,
    price,
    createdAt: new Date().toISOString(),
  };
  products.push(product);
  return product;
}

/**
 * Update an existing product by id.
 * @param {number} id
 * @param {{name?: string, description?: string, price?: number}} updates
 * @returns {object | undefined} the updated product, or undefined if not found
 */
function updateProduct(id, updates) {
  const product = findProductById(id);
  if (!product) return undefined;
  // Only overwrite the fields that were actually provided.
  if (updates.name !== undefined) product.name = updates.name;
  if (updates.description !== undefined) product.description = updates.description;
  if (updates.price !== undefined) product.price = updates.price;
  return product;
}

/**
 * Remove a product by id.
 * @param {number} id
 * @returns {boolean} true when a product was removed, false when not found
 */
function deleteProduct(id) {
  const index = products.findIndex((product) => product.id === Number(id));
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
}

module.exports = {
  products,
  getAllProducts,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
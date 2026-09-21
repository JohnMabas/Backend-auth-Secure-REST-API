
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

let nextProductId = products.length + 1;


function getAllProducts() {
  return products;
}


function findProductById(id) {
  return products.find((product) => product.id === Number(id));
}


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


function updateProduct(id, updates) {
  const product = findProductById(id);
  if (!product) return undefined;
  if (updates.name !== undefined) product.name = updates.name;
  if (updates.description !== undefined) product.description = updates.description;
  if (updates.price !== undefined) product.price = updates.price;
  return product;
}


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
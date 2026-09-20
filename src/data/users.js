// In-memory user store.
// NOTE: This is intentionally NOT a real database. All data is lost when the
// server restarts. In production you would replace these arrays with a real
// database and an ORM/query builder.

// A single in-memory "table" of users.
const users = [];

// Sequential id generator so every new record gets a unique id.
let nextUserId = 1;

/**
 * Create a new user and add it to the store.
 * @param {{name: string, email: string, password: string, role: string}} userData
 * @returns {object} the stored user object (with hashed password, but no is returned to clients)
 */
function createUser({ name, email, password, role }) {
  const user = {
    id: nextUserId++,
    name,
    email,
    password, // already hashed by the controller for this user
    role,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}

/**
 * Find a user by its exact email address.
 * @param {string} email
 * @returns {object | undefined}
 */
function findUserByEmail(email) {
  return users.find((user) => user.email === email);
}

/**
 * Find a user by its numeric id.
 * @param {number} id
 * @returns {object | undefined}
 */
function findUserById(id) {
  return users.find((user) => user.id === Number(id));
}

module.exports = {
  users,
  createUser,
  findUserByEmail,
  findUserById,
};

const users = [];

let nextUserId = 1;


function createUser({ name, email, password, role }) {
  const user = {
    id: nextUserId++,
    name,
    email,
    password, 
    role,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}


function findUserByEmail(email) {
  return users.find((user) => user.email === email);
}


function findUserById(id) {
  return users.find((user) => user.id === Number(id));
}

module.exports = {
  users,
  createUser,
  findUserByEmail,
  findUserById,
};
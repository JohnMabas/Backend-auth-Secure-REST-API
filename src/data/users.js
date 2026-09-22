const AppError = require("../utils/AppError");

const users = [];

let nextUserId = 1;


function generateAccountNumber() {
  let accountNumber;
  do {
    accountNumber = String(Math.floor(1000000000 + Math.random() * 9000000000));
  } while (findUserByAccountNumber(accountNumber));
  return accountNumber;
}


function createUser({ name, email, password }) {
  const user = {
    id: nextUserId++,
    name,
    email,
    password,
    accountNumber: generateAccountNumber(),
    pin: null,
    balance: 0,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}


function findUserByEmail(email) {
  return users.find((user) => user.email === email);
}


function findUserByAccountNumber(accountNumber) {
  return users.find((user) => user.accountNumber === accountNumber);
}


function findUserById(id) {
  return users.find((user) => user.id === Number(id));
}


function setUserPin(id, pin) {
  const user = findUserById(id);
  if (!user) {
    throw new AppError("User not found.", 404);
  }
  user.pin = pin;
  return user;
}


function deposit(id, amount) {
  const user = findUserById(id);
  if (!user) {
    throw new AppError("User not found.", 404);
  }
  user.balance += amount;
  return user;
}


function transfer(senderId, recipient, amount) {
  const sender = findUserById(senderId);
  if (!sender) {
    throw new AppError("User not found.", 404);
  }
  if (sender.balance < amount) {
    throw new AppError("Insufficient balance.", 400);
  }
  sender.balance -= amount;
  recipient.balance += amount;
}

module.exports = {
  users,
  createUser,
  findUserByEmail,
  findUserByAccountNumber,
  findUserById,
  setUserPin,
  deposit,
  transfer,
};
# Banking System

A beginner-friendly banking REST API built with Node.js and Express.js.

## Features

- Register and login (JWT auth)
- View balance
- Deposit funds
- Create and update a 4-digit PIN
- Transfer money to other users (requires PIN)

## Getting Started

1. Copy `.env.example` to `.env` and set a strong `JWT_SECRET`.
2. Install dependencies: `npm install`
3. Start the server: `npm run dev` (or `npm start`)

## API

| Method | Endpoint              | Auth | Description                      |
| ------ | --------------------- | ---- | -------------------------------- |
| POST   | /api/auth/register    | No   | Register a user                  |
| POST   | /api/auth/login       | No   | Login, returns JWT               |
| GET    | /api/account/balance  | Yes  | View your balance                |
| POST   | /api/account/deposit  | Yes  | Add funds to your account        |
| POST   | /api/account/pin      | Yes  | Create a PIN                     |
| PATCH  | /api/account/pin      | Yes  | Update PIN (needs current PIN)   |
| POST   | /api/transfer         | Yes  | Transfer to another user by email|

Send authenticated requests with header: `Authorization: Bearer <token>`

Pins are stored as bcrypt hashes; passwords are hashed with bcrypt.# Banking-System
# Banking-System

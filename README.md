# Backend Auth Secure REST API

A beginner-friendly **Authentication, Authorization and Secure REST API** built
with **Node.js + Express.js**. It uses JSON Web Tokens (JWT), bcrypt password
hashing, role-based access control, and several security best practices.

Data is stored **in memory** (arrays) for learning purposes — no database, no
ORM. Everything resets when the server restarts.

---

## Tech Stack

| Concern            | Package              |
| ------------------ | -------------------- |
| Web framework      | `express`            |
| Password hashing   | `bcryptjs`           |
| Token signing      | `jsonwebtoken`        |
| Environment vars   | `dotenv`             |
| Request rate limit | `express-rate-limit` |
| Security headers   | `helmet`             |
| Dev auto-reload    | `nodemon`            |

Images:

- [Node.js](https://nodejs.org/) **18+** (uses global `fetch` features below
  only in the optional test snippet).

---

## Installation

```bash
npm install
```

## Configuration

Copy the example environment file and fill in real values:

```bash
cp .env.example .env
```

`.env` variables:

| Variable         | Required | Default    | Description                                         |
| ---------------- | -------- | ---------- | --------------------------------------------------- |
| `PORT`           | no       | `5000`     | Port the server listens on                          |
| `JWT_SECRET`     | **yes**  | —          | Secret used to sign/verify JWTs. The app **exits** if missing. Use a long random string. |
| `JWT_EXPIRES_IN` | no       | `1h`       | Token lifetime (e.g. `1h`, `7d`)                    |
| `NODE_ENV`       | no       | `development` | `development` or `production`                     |

> Never commit `.env` to git. A `.gitignore` already excludes it.

## Start the server

```bash
# development (auto-restart on changes)
npm run dev

# production style
npm start
```

You should see:

```
Server running in development mode at http://localhost:5000
```

Health check: `GET /` → `{ "success": true, "message": "API is running." }`

---

## Response Shape

Every response uses one consistent JSON shape:

```json
{ "success": true, "message": "done", "data": { ... } }
```

Errors:

```json
{ "success": false, "message": "what went wrong" }
```

Password hashes are **never** stored in plain text and **never** returned in
any response.

---

## REST endpoints

| Method | URL                    | Auth  | Role(s)        | Description                |
| ------ | ---------------------- | ----- | -------------- | -------------------------- |
| POST   | `/api/auth/register`   | No    | —              | Register a new user        |
| POST   | `/api/auth/login`      | No    | —              | Login, get a JWT           |
| GET    | `/api/products`        | Bearer | `user`, `admin` | List all products          |
| GET    | `/api/products/:id`    | Bearer | `user`, `admin` | Get one product            |
| POST   | `/api/products`        | Bearer | `admin`        | Create a product           |
| PUT    | `/api/products/:id`    | Bearer | `admin`        | Update a product           |
| DELETE | `/api/products/:id`    | Bearer | `admin`        | Delete a product           |

### Access control matrix

| Action                  | Admin | User  |
| ----------------------- | ----- | ----- |
| Register / Login        | ✅    | ✅    |
| View products           | ✅    | ✅    |
| Add / Update / Delete   | ✅    | ❌ 403 |

### Payloads & rules

**`POST /api/auth/register`** — `{ name, email, password, role }`

- `name`: non-empty string, 2–50 characters.
- `email`: valid format; trimmed + lowercased.
- `password` (min 6 chars) must contain **all** of: uppercase, lowercase,
  number, special character. *Valid example: `Peter@123` — invalid: `peter123`.*
  Each failed rule returns its own specific message.
- `role`: exactly `user` or `admin`.
- Only the four allowed fields are read; extra fields are ignored and
  non-string values are rejected (object/array injection protection).

**`POST /api/auth/login`** — `{ email, password }` → `{ token, user }`

Both missing-user and wrong-password return the identical message
`Invalid credentials.` (401) so attackers can't enumerate emails.

**Products** — `{ name, description, price }`

- `name`: required non-empty string.
- `description`: string (optional).
- `price`: number `>= 0`.

---

## Status codes used

| Code | Meaning                                             |
| ---- | --------------------------------------------------- |
| 200  | Success (fetch/update/delete)                       |
| 201  | Created (register, create product)                  |
| 400  | Validation error / missing field / wrong type       |
| 401  | Missing/expired/invalid token, or bad credentials   |
| 403  | Authenticated but role not allowed                  |
| 404  | Route or product not found                          |
| 409  | Duplicate email                                     |
| 429  | Rate limited                                        |
| 500  | Internal error (generic message only)               |

---

## Security features

- **Password hashing** — bcrypt, 10 salt rounds.
- **JWT** — signed with `JWT_SECRET`, expires per `JWT_EXPIRES_IN`.
- **helmet** sets secure HTTP headers.
- **JSON body limit** `express.json({ limit: "10kb" })`.
- **Input validation & sanitization** on every body before controllers run.
- **Rate limiting**:
  - general limiter: **100 requests / 15 min / IP** on all routes;
  - auth limiter: **10 requests / 15 min / IP** on `/api/auth/*` → `429`.
- **Request logger** — logs `METHOD URL - statusCode - time` on response
  finish. Never logs passwords, tokens or bodies.
- **Central error handler** — operational errors return their own code;
  unknown errors return a generic `500 "Something went wrong"` while the real
  error is logged only on the server.
- **JWT_SECRET guard** — the app exits with a clear message if it is missing.

---

## Testing step-by-step

### 0. Start the server

```bash
npm run dev
```

### 1. Register an admin

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Admin","email":"admin@test.com","password":"Admin@123","role":"admin"}'
```

Expected: `201`, `data` contains the user **without** a password field.

### 2. Register a normal user

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob User","email":"user@test.com","password":"User@123","role":"user"}'
```

Expected: `201`.

Try a weak password to see the specific error:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob","email":"bob2@test.com","password":"peter123","role":"user"}'
```

Expected: `400` with a specific message like
`"password must contain at least one uppercase letter."`

Also try to re-register `admin@test.com` → `409`.

### 3. Login as both users

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin@123"}'

curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"User@123"}'
```

Expected: `200`, with `data.token` (JWT) and `data.user`. Save both tokens.

Wrong password / unknown email:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Wrong@123"}'
```

Expected: `401` `{ "success": false, "message": "Invalid credentials." }`.

### 4. Products with NO token

```bash
curl http://localhost:5000/api/products
```

Expected: `401`.

### 5. Products with USER token (read OK, write forbidden)

```bash
# list products -> 200
curl http://localhost:5000/api/products -H "Authorization: Bearer <USER_TOKEN>"

# create product -> 403 Forbidden
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer <USER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Nope","description":"x","price":1}'
```

### 6. Products with ADMIN token (full access)

```bash
# list -> 200
curl http://localhost:5000/api/products -H "Authorization: Bearer <ADMIN_TOKEN>"

# create -> 201
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Webcam","description":"1080p USB webcam","price":59.99}'

# update -> 200 (adjust the :id to one that exists, e.g. 1)
curl -X PUT http://localhost:5000/api/products/1 \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"price":49.99}'

# delete -> 200
curl -X DELETE http://localhost:5000/api/products/1 \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### 7. Invalid token

```bash
curl http://localhost:5000/api/products -H "Authorization: Bearer not.a.real.token"
```

Expected: `401` `{ "success": false, "message": "Invalid token." }`.

### 8. Unknown route

```bash
curl http://localhost:5000/api/does-not-exist
```

Expected: `404`.

### 9. Rate limiting

Fire >10 requests per 15 min at `/api/auth/login` — later requests return
`429` with the standard JSON shape.

---

## Folder structure

```
├── src/
│   ├── config/env.js               # env loading + JWT_SECRET guard
│   ├── data/users.js               # in-memory users (no DB)
│   ├── data/products.js            # in-memory products, seeded x3
│   ├── middleware/
│   │   ├── authenticate.js         # Bearer token verification (401)
│   │   ├── authorize.js            # role-based access control (403)
│   │   ├── rateLimiter.js          # general + strict auth limiters
│   │   ├── logger.js               # response logger (no secrets)
│   │   ├── validate.js             # runs validators -> req.validatedBody
│   │   └── errorHandler.js         # central error middleware
│   ├── validators/
│   │   ├── authValidator.js        # register/login rules
│   │   └── productValidator.js     # product rules
│   ├── controllers/
│   │   ├── authController.js       # register + login logic
│   │   └── productController.js    # product CRUD logic
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth
│   │   └── productRoutes.js        # /api/products
│   ├── utils/
│   │   ├── AppError.js             # error class with statusCode
│   │   └── asyncHandler.js         # try/catch-free async wrappers
│   ├── app.js                      # middleware order + mounting
│   └── server.js                   # entry point
├── .env.example
├── .gitignore
└── package.json
```

Middleware order in `app.js`:
`helmet → express.json(10kb) → logger → general rate limiter → routes
(strict limiter on /api/auth) → 404 → errorHandler`.

---

## Known limitations

- **Data is lost on server restart.** Users and products live in in-memory
  arrays; restarting the server resets everything. A real database
  (Postgres/MySQL/MongoDB) would persist it.
- **The client chooses its own role at registration.** This is insecure and
  only for learning how role-based access control works. In production, roles
  would be assigned server-side by an admin after verification.
- **Single JWT only.** Production systems typically use short-lived access
  tokens plus refresh tokens (stored securely server-side) for better security
  and logout support.
- **No refresh / logout / email verification / password reset.** Out of scope
  for this learning project.
- The rate limiter counts by IP; behind a proxy you would configure
  `X-Forwarded-For` trust settings.
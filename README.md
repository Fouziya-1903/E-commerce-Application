# E-commerce Application (REST API)

A backend REST API for an online store, built with **Node.js, Express and MongoDB (Mongoose)**. Customers can browse products, keep a cart and place orders; sellers can add products. Orders are processed inside a **MongoDB transaction**, so stock is never oversold and a failed order leaves no partial changes.

Interactive API documentation is available through **Swagger UI** at `/api-docs`.

## Features

- **Authentication:** sign up, sign in and reset password. Passwords are hashed with bcrypt, and sessions use JWT (valid for 1 hour).
- **Roles:** every account is either a `customer` or a `seller`. Only sellers can add products and categories.
- **Products:** list, view one, filter by price range and category, rate, and upload an image. Categories and products are linked many-to-many.
- **Cart:** add, view, update quantity and remove items.
- **Orders:** placing an order runs one transaction that checks and reduces stock, calculates the total, saves the order and clears the cart. If anything fails, everything rolls back.
- **Likes:** like a product or a category.
- **Security and reliability:** `helmet` security headers, rate limiting on the user endpoints, password redaction in request logs, centralised error handling with a custom `ApplicationError`, and MongoDB indexes.

## Tech stack

| Area | Tools |
|---|---|
| Runtime / framework | Node.js (ES modules), Express 5 |
| Database | MongoDB with Mongoose (transactions require a replica set; MongoDB Atlas works out of the box) |
| Auth | jsonwebtoken, bcrypt |
| Uploads | multer |
| Docs | swagger-ui-express |
| Logging / security | winston, helmet, express-rate-limit, cors |

## Project structure

```
index.js                  App entry point: middleware, routes, error handling
swagger.json              Base Swagger document (each feature has its own *.swagger.json)
src/
  config/mongoose.js      Database connection
  error-handler/          ApplicationError class
  middlewares/            jwt (auth + role check), logger, file upload
  features/
    user/                 routes, controller, repository, schema
    product/              products, categories, reviews
    cart/
    order/
    like/
uploads/                  Uploaded product images (not committed)
```

Each feature follows the same layering: **routes -> controller -> repository -> schema**.

## Getting started

**Prerequisites:** Node.js 18 or newer and a MongoDB database (a free MongoDB Atlas cluster works).

```bash
git clone https://github.com/Fouziya-1903/E-commerce-Application.git
cd E-commerce-Application
npm install
cp .env.example .env     # then edit .env with your own values
npm run dev              # or: npm start
```

The server runs at `http://localhost:3000` and the docs at `http://localhost:3000/api-docs`.

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `DB_url` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Long random string used to sign tokens |
| `PORT` | No | Port to listen on (default `3000`) |
| `CORS_ORIGIN` | No | Allowed browser origin (default `*`) |

## Authentication

1. Create an account with `POST /api/users/signUp` and log in with `POST /api/users/signIn`. The response is a JWT.
2. Send it on protected requests in the `Authorization` header (`Authorization: <token>` or `Authorization: Bearer <token>`).
3. In Swagger UI, click **Authorize**, paste the token and confirm.

Passwords must have at least 8 characters, with an uppercase letter, a lowercase letter, a number and a special character (`@$!%*?&`).

## API overview

All routes except `signUp` and `signIn` require a token.

| Method | Endpoint | Who | Description |
|---|---|---|---|
| POST | `/api/users/signUp` | Public | Register (`name`, `email`, `password`, `type`) |
| POST | `/api/users/signIn` | Public | Log in, returns a JWT |
| PUT | `/api/users/resetPassword` | Any user | Body: `newPassword` |
| GET | `/api/products` | Any user | List all products |
| GET | `/api/products/:id` | Any user | Get one product |
| GET | `/api/products/filter` | Any user | Query: `minPrice`, `maxPrice`, `category` |
| GET | `/api/products/averageProductPrice` | Any user | Average price per category |
| POST | `/api/products` | **Seller** | Add a product (multipart form with image) |
| POST | `/api/products/addCategory` | **Seller** | Add a category |
| POST | `/api/products/rate` | Any user | Body: `productId`, `ratings` (uses the logged-in user) |
| POST | `/api/cart` | Any user | Query: `productId`, `quantity` |
| GET | `/api/cart` | Any user | View your cart |
| PUT | `/api/cart/update` | Any user | Query: `productId`, `quantity` |
| POST | `/api/cart/delete` | Any user | Query: `cartItemId` |
| POST | `/api/orders` | Any user | Place an order from your cart |
| POST | `/api/like` | Any user | Body: `id`, `type` (`Product` or `Category`) |
| GET | `/api/like` | Any user | Query: `id`, `type` |

## How an order works

`POST /api/orders` starts a MongoDB session and, inside one transaction:

1. Loads the user's cart items.
2. For each item, runs a conditional update that reduces `inStock` only if enough stock remains. Two simultaneous orders cannot both take the last item.
3. Calculates the total with an aggregation that joins the cart with product prices.
4. Saves the order and empties the cart.

If any step fails, such as insufficient stock, the transaction is aborted and nothing is changed.

## Security notes

- Never commit `.env`. Use `.env.example` as the template.
- Request bodies are logged to `logs.txt` with `password`, `newPassword` and `token` fields redacted.
- The user endpoints are rate limited (50 requests per 15 minutes per IP).
- Set `CORS_ORIGIN` to your frontend's URL before deploying.

## Roadmap

- Automated tests (Jest and Supertest)
- Store the product price on each order item at purchase time
- Order history and order status endpoints
- Pagination for the product list
- Request validation with express-validator
- A React frontend

## Author

Fouziya Shaik

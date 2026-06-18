# CrispyBite Backend

CrispyBite is a fictional fast-food ordering backend built for students learning full-stack development. It does not use real KFC logos, trademarks, copyrighted images, or official menu assets.

The backend teaches how a real ordering API is structured: users authenticate with JWT, passwords are hashed with bcrypt, menu data is stored in MariaDB/MySQL, customers place orders from carts, restaurant staff process orders, riders update deliveries, and admins manage the system.

## What Students Will Learn

- How to organize an Express project into routes, controllers, middleware, config, and database files.
- How to connect Node.js to MariaDB/MySQL with `mysql2/promise`.
- How registration and login work with hashed passwords.
- How JWT authentication protects private API routes.
- How role-based authorization separates customer, staff, rider, and admin features.
- How carts become orders using a database transaction.
- How order tracking history is stored in a separate table.
- How Multer handles food image uploads.

## Tech Stack

- Node.js
- Express.js
- MariaDB/MySQL
- JWT with `jsonwebtoken`
- bcrypt for password hashing
- Multer for image uploads
- `mysql2/promise` for SQL queries
- `dotenv` for environment variables

## Prerequisites

Install these before running the project:

- Node.js 18 or newer
- npm
- MariaDB or MySQL
- A SQL client, such as the `mysql` command line, TablePlus, MySQL Workbench, or phpMyAdmin

Check your versions:

```bash
node -v
npm -v
mysql --version
```

## Folder Structure

```text
crispybite-backend/
  config/
    db.js                  Database connection pool
  controllers/
    authController.js       Register, login, current user
    menuController.js       Categories and menu items
    cartController.js       Customer cart operations
    orderController.js      Checkout, order history, cancellation
    staffOrderController.js Staff order workflow
    riderController.js      Rider delivery workflow
    trackingController.js   Order tracking timeline
    adminController.js      Users, orders, stats, admin menu
  middleware/
    authMiddleware.js       JWT verification
    roleMiddleware.js       Role checks
    uploadMiddleware.js     Multer image upload config
  routes/
    *.js                    Express endpoint definitions
  uploads/
    food-images/            Uploaded food images
  database/
    schema.sql              Tables, relationships, constraints
    seed.sql                Sample learning data
  server.js                 Express app entry point
  .env.example              Example environment variables
```

## Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

Default values:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=crispybite_db
DB_PORT=3306
JWT_SECRET=crispybite_student_secret
PORT=5000
```

Do not hardcode database credentials in source files. The backend reads them from `.env` in `config/db.js`.

## Database Setup

The schema file creates the database and all tables. The seed file inserts sample users, menu categories, menu items, carts, orders, payments, notifications, and order tracking rows.

Run these commands from the backend folder:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p crispybite_db < database/seed.sql
```

If your database password is `root`, MariaDB/MySQL may ask for it after each command. If your local password is different, update `.env`.

Important: `schema.sql` drops and recreates the CrispyBite tables. Do not run it against important production data.

## Install and Run

```bash
npm install
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

Test that it is running:

```bash
curl http://localhost:5000/
```

Expected response:

```json
{"message":"CrispyBite API is running."}
```

## Default Login Accounts

All seeded accounts use password:

```text
password123
```

| Role | Email |
| --- | --- |
| Admin | `admin@crispybite.test` |
| Customer | `customer@crispybite.test` |
| Restaurant Staff | `staff@crispybite.test` |
| Delivery Rider | `rider@crispybite.test` |

## API Endpoint Summary

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Menu and categories:

- `GET /api/menu`
- `GET /api/menu/:id`
- `POST /api/menu`
- `PUT /api/menu/:id`
- `DELETE /api/menu/:id`
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`

Cart:

- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items/:id`
- `DELETE /api/cart/items/:id`
- `DELETE /api/cart/clear`

Customer orders:

- `POST /api/orders`
- `GET /api/orders/my-orders`
- `GET /api/orders/:id`
- `PUT /api/orders/:id/cancel`

Staff orders:

- `GET /api/staff/orders`
- `PUT /api/staff/orders/:id/accept`
- `PUT /api/staff/orders/:id/reject`
- `PUT /api/staff/orders/:id/preparing`
- `PUT /api/staff/orders/:id/ready`
- `PUT /api/staff/orders/:id/assign-rider`

Rider:

- `GET /api/rider/orders`
- `PUT /api/rider/orders/:id/picked-up`
- `PUT /api/rider/orders/:id/on-the-way`
- `PUT /api/rider/orders/:id/delivered`

Tracking and admin:

- `GET /api/tracking/order/:orderId`
- `GET /api/admin/stats`
- `GET /api/admin/users`
- `GET /api/admin/orders`
- `GET /api/admin/menu`
- `PUT /api/admin/users/:id/status`

## Example Login Request

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@crispybite.test","password":"password123"}'
```

The response includes a `token`. Use that token on protected requests:

```http
Authorization: Bearer your_token_here
```

## Authentication Flow

1. A user registers or logs in.
2. The backend checks the email and bcrypt password hash.
3. The backend signs a JWT containing the user id and role.
4. Protected routes use `authMiddleware.js` to verify the JWT.
5. The middleware loads the active user from the database and sets `req.user`.

## Role-Based Access Control

Role checks live in `middleware/roleMiddleware.js`.

- Customers can manage carts and place orders.
- Staff can process restaurant orders and manage menu items.
- Riders can update assigned delivery orders.
- Admins can view system statistics and manage users, menu, and orders.

This is the same security idea used in production applications: authentication answers "who are you?" and authorization answers "what are you allowed to do?"

## Food Image Uploads

Menu create and update routes accept multipart form data with an `image` field. Multer saves uploaded files in:

```text
uploads/food-images/
```

The database stores the public path, such as:

```text
/uploads/food-images/filename.jpg
```

The Express server exposes the `uploads` folder with static file hosting.

## Order Status Flow

Orders can move through these statuses:

```text
Pending
Accepted
Rejected
Preparing
Ready for Pickup
Assigned to Rider
Picked Up
On the Way
Delivered
Completed
Cancelled
```

Customers can cancel only before preparation starts. Staff update restaurant statuses. Riders update delivery statuses.

## Order Tracking History

The `orders` table stores the current status. The `order_tracking` table stores the history.

Whenever a status changes, the backend inserts a tracking row with:

- `order_id`
- `status`
- `description`
- `updated_by`
- `created_at`

This makes it possible to display a timeline and audit how the order moved through the system.

## Suggested Learning Path

1. Read `server.js` to see how Express middleware and routes are mounted.
2. Read `config/db.js` to understand the database pool.
3. Read `middleware/authMiddleware.js` and `middleware/roleMiddleware.js`.
4. Use `authController.js` to learn registration, login, bcrypt, and JWT.
5. Use `cartController.js` and `orderController.js` to learn how checkout converts cart rows into order rows.
6. Use `staffOrderController.js` and `riderController.js` to learn workflow updates.
7. Inspect `database/schema.sql` to connect the JavaScript code to the database design.

## Troubleshooting

If port `5000` is already in use, change `PORT` in `.env`.

If login fails after seeding, confirm the seed ran:

```bash
mysql -u root -p crispybite_db -e "SELECT id, email, role, status FROM users;"
```

If the backend cannot connect to the database, check:

- MariaDB/MySQL is running.
- `.env` has the correct username and password.
- `crispybite_db` exists.
- The backend was restarted after editing `.env`.

## Useful Commands

```bash
npm run dev        # Start with nodemon
npm start          # Start with node
npm run check      # Syntax-check server.js
npm audit          # Check dependency advisories
```

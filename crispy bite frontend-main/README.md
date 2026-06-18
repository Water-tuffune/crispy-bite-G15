# CrispyBite Frontend

CrispyBite is a fictional React food ordering app built for students learning full-stack development. It connects to the CrispyBite Express backend and supports customer, restaurant staff, delivery rider, and admin workflows.

This frontend uses a fictional brand only. It does not use real KFC logos, trademarks, copyrighted images, or official menu assets.

## What Students Will Learn

- How to build a React app with Vite.
- How to organize pages, layouts, components, context, services, and utilities.
- How React Router handles public routes, protected routes, and role-based dashboards.
- How Axios connects the frontend to an Express API.
- How JWT tokens are stored in `localStorage` and attached to API requests.
- How a cart flow works across menu, cart, and checkout pages.
- How staff, rider, and admin dashboards call different backend endpoints.
- How order tracking data becomes a visible timeline.

## Tech Stack

- ReactJS
- React Router
- Axios
- Bootstrap
- Vite
- JavaScript
- lucide-react icons

## Prerequisites

Install these before running the project:

- Node.js 18 or newer
- npm
- The CrispyBite backend running on `http://localhost:5000`

Check your versions:

```bash
node -v
npm -v
```

## Folder Structure

```text
crispybite-frontend/
  src/
    components/
      Navbar.jsx             Role-aware navigation
      ProtectedRoute.jsx     Requires login
      RoleBasedRoute.jsx     Requires a specific role
      FoodCard.jsx           Menu item card
      CartItem.jsx           Cart row
      OrderStatusBadge.jsx   Status label
      TrackingTimeline.jsx   Order history timeline
      LoadingSpinner.jsx     Loading state
      AlertMessage.jsx       Success/error messages
    context/
      AuthContext.jsx        Login state and auth actions
      CartContext.jsx        Cart state and cart actions
    layouts/
      PublicLayout.jsx       Public page wrapper
      DashboardLayout.jsx    Logged-in dashboard wrapper
    pages/
      public/                Home, menu, details, login, register
      customer/              Cart, checkout, orders, tracking
      staff/                 Staff order and menu management
      rider/                 Assigned deliveries
      admin/                 Stats, users, menu, orders, categories
    services/
      api.js                 Shared Axios instance
      authService.js         Auth API calls
      menuService.js         Menu/category API calls
      cartService.js         Cart API calls
      orderService.js        Order/staff/rider API calls
      trackingService.js     Tracking API calls
      adminService.js        Admin API calls
    utils/
      formatCurrency.js
      formatDate.js
    App.jsx                  React Router setup
    main.jsx                 React entry point
```

## Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Default value:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

If your backend uses a different port, update `VITE_API_BASE_URL`.

## Install and Run

Run these commands from the frontend folder:

```bash
npm install
npm run dev
```

Vite usually starts at:

```text
http://localhost:5173
```

If that port is busy, Vite prints the next available port in the terminal.

## Full Project Startup Order

Start the backend first:

```bash
cd ../crispybite-backend
cp .env.example .env
mysql -u root -p < database/schema.sql
mysql -u root -p crispybite_db < database/seed.sql
npm install
npm run dev
```

Then start the frontend in another terminal:

```bash
cd ../crispybite-frontend
cp .env.example .env
npm install
npm run dev
```

Open the Vite URL in your browser and log in with one of the seeded accounts.

## Default Login Accounts

All seeded accounts use password:

```text
password123
```

| Role | Email | First screen after login |
| --- | --- | --- |
| Admin | `admin@crispybite.test` | `/admin` |
| Customer | `customer@crispybite.test` | `/customer` |
| Restaurant Staff | `staff@crispybite.test` | `/staff` |
| Delivery Rider | `rider@crispybite.test` | `/rider` |

## Page and Route Guide

Public routes:

- `/`: Home page with featured meals.
- `/about`: Project purpose and role overview.
- `/menu`: Search and filter menu items.
- `/menu/:id`: View food item details.
- `/login`: Login form.
- `/register`: Customer registration form.

Customer routes:

- `/customer`: Customer dashboard with order summary.
- `/customer/cart`: View, update, remove, or clear cart items.
- `/customer/checkout`: Choose pickup or delivery and place an order.
- `/customer/orders`: View order history.
- `/customer/orders/:id`: View order details and cancel eligible orders.
- `/customer/track/:id`: View order tracking timeline.

Staff routes:

- `/staff`: Staff dashboard.
- `/staff/incoming`: Accept or reject pending orders.
- `/staff/orders`: Mark orders as preparing or ready and assign riders.
- `/staff/menu`: View, edit, and delete menu items.
- `/staff/menu/add`: Add menu item with image upload.
- `/staff/menu/:id/edit`: Edit a menu item.

Rider routes:

- `/rider`: Rider dashboard.
- `/rider/deliveries`: View assigned delivery orders.
- `/rider/deliveries/:id`: Mark delivery as picked up, on the way, or delivered.

Admin routes:

- `/admin`: System statistics and popular menu items.
- `/admin/users`: Activate or deactivate users.
- `/admin/menu`: Add and delete menu items.
- `/admin/orders`: View all orders.
- `/admin/categories`: Create and update categories.

## Authentication and Route Protection

`AuthContext.jsx` stores the logged-in user and exposes:

- `login`
- `register`
- `logout`
- `user`
- `isAuthenticated`

The JWT token is saved in `localStorage` using the key:

```text
crispybite_token
```

`ProtectedRoute.jsx` blocks dashboard routes when there is no logged-in user.

`RoleBasedRoute.jsx` blocks a logged-in user from opening dashboards for another role. For example, a customer cannot open `/admin`.

## API Service Files

The shared Axios setup is in `src/services/api.js`. It reads the token from `localStorage` and adds this header automatically:

```http
Authorization: Bearer token_here
```

Feature-specific service files keep API calls easy to find:

- `authService.js`: login, register, current user
- `menuService.js`: menu items and categories
- `cartService.js`: cart operations
- `orderService.js`: customer, staff, and rider order actions
- `trackingService.js`: order tracking history
- `adminService.js`: admin stats, users, orders, menu

## Cart and Checkout Flow

1. Customer logs in.
2. Customer opens `/menu`.
3. Customer clicks Add on available menu items.
4. `CartContext.jsx` calls the backend cart endpoints and refreshes cart state.
5. Customer opens `/customer/cart` to update quantities or remove items.
6. Customer opens `/customer/checkout`.
7. Customer chooses pickup or delivery.
8. Backend creates order rows, order item rows, payment row, and first tracking row.
9. Cart is cleared after successful checkout.

## Order Tracking Timeline

The timeline on `/customer/track/:id` and rider delivery details comes from the backend `order_tracking` table.

Each status update adds a new tracking event. The frontend displays those events in chronological order using `TrackingTimeline.jsx`.

## Suggested Learning Path

1. Read `src/main.jsx` to see how React starts.
2. Read `src/App.jsx` to understand routing.
3. Read `AuthContext.jsx` to understand login state.
4. Read `api.js` to understand Axios interceptors.
5. Follow a customer flow from `Menu.jsx` to `Cart.jsx` to `Checkout.jsx`.
6. Follow a staff flow in `IncomingOrders.jsx` and `ManageOrders.jsx`.
7. Follow a rider flow in `DeliveryDetails.jsx`.
8. Follow an admin flow in `AdminDashboard.jsx` and `ManageUsers.jsx`.

## Troubleshooting

If menu data does not load:

- Confirm the backend is running.
- Confirm `VITE_API_BASE_URL` points to the backend.
- Confirm the database was seeded.
- Check the browser console and backend terminal for errors.

If login fails:

- Use one of the seeded emails.
- Use password `password123`.
- Confirm backend `/api/auth/login` is reachable.

If the mobile navbar does not open:

- Confirm Bootstrap JavaScript is imported in `src/main.jsx`.

## Useful Commands

```bash
npm run dev       # Start local development server
npm run build     # Create production build in dist/
npm run preview   # Preview the production build
npm audit         # Check dependency advisories
```

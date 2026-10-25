# ShopNest — Full-Stack MERN E-Commerce Platform

ShopNest is a production-style, enterprise-grade e-commerce web application inspired by the user experience of modern retail platforms like Amazon, Flipkart, and Myntra. Engineered with the MERN stack (MongoDB Atlas, Express.js, React.js, Node.js), ShopNest provides a complete online shopping workflow: product discovery, multi-criteria filtering, persistent carts and wishlists, coupon verification, multi-step checkout, Razorpay test mode payment verification, order tracking with status timelines, and a dedicated role-protected Admin Console.

---

## Architecture & Technology Stack

### Frontend
- **Framework & Tooling**: React.js 18+ with Vite
- **Routing**: React Router DOM v7
- **Styling**: Modern CSS3 Custom Design System with CSS variables, accessible contrast, responsive breakpoints (Desktop, Tablet, Mobile), subtle commercial shadows, and smooth transitions
- **State Management**: Context API (`AuthContext`, `CartContext`, `WishlistContext`) with automated `localStorage` persistence and server synchronization
- **Icons**: Lucide React
- **HTTP Client**: Axios with centralized request/response interceptors

### Backend
- **Runtime & Framework**: Node.js & Express.js
- **Database & ODM**: MongoDB Atlas with Mongoose schemas, text search indexing, and resilient fallback
- **Authentication**: JSON Web Tokens (JWT) & `bcryptjs` password hashing (salt rounds: 12)
- **Authorization**: Role-Based Access Control (RBAC) protecting customer and administrative endpoints
- **Payments**: Razorpay test mode integration with server-side HMAC-SHA256 cryptographic signature verification & development simulator
- **Security & Validation**: Server-side price recalculation, stock reservation, input sanitization, and centralized error handling middleware

---

## Directory Structure

```
ShopNest - Ecom MERN/
├── backend/
│   ├── config/
│   │   └── db.js                 # Resilient MongoDB Atlas / local connection logic
│   ├── controllers/
│   │   ├── adminController.js    # Store analytics, metrics, customer lists
│   │   ├── authController.js     # User registration, login, profile, addresses
│   │   ├── couponController.js   # Coupon validation and admin CRUD
│   │   ├── orderController.js    # Order lifecycle, stock deductions, status updates
│   │   ├── paymentController.js  # Razorpay order generation & signature verification
│   │   ├── productController.js  # Search, filter, sorting, pagination, catalog CRUD
│   │   └── reviewController.js   # Product ratings, review submission, verified purchase checks
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & admin guard
│   │   └── errorMiddleware.js    # 404 handler and centralized error responder
│   ├── models/
│   │   ├── Category.js           # Categories with slugs and item counts
│   │   ├── Coupon.js             # Discount codes with validation and redemption rules
│   │   ├── Order.js              # Order schemas, line snapshots, status history
│   │   ├── product.js            # Product schemas with text indexes & specifications
│   │   ├── Review.js             # Product reviews with verified purchase flags
│   │   └── User.js               # Customer accounts, hashed passwords, addresses, wishlist
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── couponRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── productRoutes.js
│   ├── seed.js                   # Seed script for realistic products, admin, and demo user
│   ├── server.js                 # Express application entry point (Port 5000)
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Navbar, Footer, AnnouncementBar, ProductCard, LoadingSkeleton
│   │   │   └── home/             # HeroBanner, CategoryGrid, PromoBanner, Newsletter
│   │   ├── context/              # AuthContext, CartContext, WishlistContext
│   │   ├── pages/                # Home, Shop, Deals, ProductDetails, Cart, Wishlist, Checkout, Orders, Profile, AdminDashboard, Login, Register
│   │   ├── services/             # Axios API client with interceptors
│   │   ├── App.jsx               # Route definitions and context provider tree
│   │   ├── main.jsx              # Application bootstrap
│   │   └── index.css             # ShopNest design system
│   ├── vite.config.js            # Vite configuration and proxy setup
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas cluster URI (or a running local MongoDB instance on `mongodb://127.0.0.1:27017/shopnest`)

### 2. Environment Configuration

#### Backend Configuration
Create or verify `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shopnest?retryWrites=true&w=majority
JWT_SECRET=shopnest_jwt_super_secret_production_key_2026
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

#### Frontend Configuration
Create `frontend/.env` (optional, defaults to `http://localhost:5000/api`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### 3. Database Seeding

Populate the MongoDB database with realistic products across Electronics, Fashion, Footwear, Accessories, Home & Living, Beauty, Sports, and Books, along with default test accounts and promotional coupons:

```bash
# From workspace root
node backend/seed.js
```

#### Seeded Test Credentials:
- **Administrator**:
  - Email: `admin@shopnest.com`
  - Password: `Admin@123456`
  - Access: Full access to `/admin` Store Management Console
- **Demo Customer**:
  - Email: `customer@shopnest.com`
  - Password: `Customer@123456`
  - Access: Customer storefront, saved addresses, orders history
- **Promotional Coupons**:
  - `SAVE10`: 10% off cart subtotal (max cap ₹2,000)
  - `SHOP500`: Flat ₹500 discount on orders above ₹2,000
  - `FESTIVE50`: 15% festive discount on orders above ₹1,500

---

### 4. Running the Application

Open two separate terminal windows:

#### Terminal 1 — Backend API Server
```bash
cd backend
node server.js
```
*Backend runs on: `http://localhost:5000` (Health check at `http://localhost:5000/api/health`)*

#### Terminal 2 — Frontend Client
```bash
cd frontend
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

---

## Core Application Workflows

### 1. Customer Shopping Workflow
1. **Browse & Search**: Customers browse categorized departments, use the debounced search bar, or explore curated sections (Featured, Trending, Bestsellers, Deals).
2. **Refine & Filter**: On the Shop catalogue page (`/shop`), users filter products simultaneously by category, brand, price slider/inputs, star rating, and in-stock status, with dynamic sorting (Price Low/High, Rating, Newest) and pagination.
3. **Product Inspection**: The Product Details page (`/product/:id`) displays multi-image galleries, live inventory status, specifications, customer ratings with verified purchase badges, a PIN code serviceability checker, and related products.
4. **Cart & Wishlist**: Real-time persistent state prevents ordering quantities greater than available inventory. Customers apply verified coupon codes (`SAVE10`, `SHOP500`, `FESTIVE50`) with live discount recalculation.
5. **Multi-Step Checkout**:
   - Step 1: Select saved delivery address or enter a new validated shipping address.
   - Step 2: Choose Cash on Delivery or Razorpay Test Mode.
   - The backend validates item availability, decrements inventory stock, recalculates shipping and discounts server-side, and produces an order reference.
6. **Order Tracking & Invoices**: Customers view active and historical orders at `/orders`, track shipment progression across a defined status timeline (Pending → Confirmed → Processing → Shipped → Delivered), cancel eligible orders, and view or print official invoices.

### 2. Admin Management Workflow
1. **Protected Access**: Route and backend API guards restrict `/admin` exclusively to users with `role: "admin"`.
2. **Overview & Analytics**: Live revenue calculation from paid orders, total order volume, customer counts, active catalog count, recent order table, and automated low-stock warnings (items with ≤ 5 units).
3. **Product CRUD**: Admins can search products, create new items with specifications and image URLs, edit pricing/inventory, and delete products.
4. **Order Processing**: Real-time status dropdowns allow admins to update order statuses (`Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`) with automated inventory adjustments.
5. **Coupon Engine**: Admins can create new percentage or fixed discount coupons, set minimum order amounts and expiry dates, and toggle active/disabled states.

---

## REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Server health status |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Customer | Fetch current authenticated profile |
| `PUT` | `/api/auth/profile` | Customer | Update name, phone, or password |
| `POST` | `/api/auth/address` | Customer | Add saved delivery address |
| `DELETE` | `/api/auth/address/:id` | Customer | Remove saved delivery address |
| `POST` | `/api/auth/wishlist/:id` | Customer | Toggle product in user wishlist |
| `GET` | `/api/products` | Public | Query products with filters, sorting & pagination |
| `GET` | `/api/products/featured`| Public | Fetch curated featured & bestselling products |
| `GET` | `/api/products/:id` | Public | Fetch product details, reviews & related items |
| `POST` | `/api/products/:id/reviews` | Customer | Submit verified customer product review |
| `POST` | `/api/products` | Admin | Create new product |
| `PUT` | `/api/products/:id` | Admin | Update existing product |
| `DELETE` | `/api/products/:id` | Admin | Delete product and associated reviews |
| `POST` | `/api/coupons/validate` | Public | Validate coupon code against cart subtotal |
| `GET` | `/api/coupons` | Admin | List all promotional coupons |
| `POST` | `/api/coupons` | Admin | Create new coupon code |
| `POST` | `/api/orders` | Customer | Place order with server price & stock validation |
| `GET` | `/api/orders/my-orders` | Customer | Retrieve authenticated customer's orders |
| `GET` | `/api/orders/:id` | Customer/Admin | Get detailed order snapshot |
| `PATCH`| `/api/orders/:id/cancel`| Customer/Admin | Cancel order and restore inventory stock |
| `GET` | `/api/orders` | Admin | List all store orders with status filters |
| `PATCH`| `/api/orders/:id/status`| Admin | Update order status & delivery timestamps |
| `POST` | `/api/payments/create-order` | Customer | Generate Razorpay order |
| `POST` | `/api/payments/verify` | Customer | Verify HMAC-SHA256 signature and mark order paid |
| `GET` | `/api/admin/dashboard` | Admin | Retrieve aggregate revenue & store KPIs |

---

## Technical Highlights for Interviews

1. **Defensive Price Recalculation**:
   - Client-side cart totals and discount amounts are *never* trusted for order placement. The backend retrieves the authoritative price from MongoDB, checks inventory, verifies coupon constraints, and calculates final totals server-side.
2. **Race-Condition & Overselling Protection**:
   - Stock counts are decremented when orders are confirmed. If a customer cancels an eligible order, inventory is restored automatically.
3. **Cryptographic Payment Integrity**:
   - Razorpay payments verify the server-side HMAC-SHA256 hash `razorpay_order_id + "|" + razorpay_payment_id` against the configured secret key before marking any order as paid.
4. **Database Resilience**:
   - The connection manager (`backend/config/db.js`) attempts primary MongoDB Atlas connection and gracefully falls back to local MongoDB if client network IP whitelist blocks occur, guaranteeing zero development downtime.


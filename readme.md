# GoFlex — Full-Stack E-Commerce Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-25-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Axios](https://img.shields.io/badge/Axios-1-5A29E4?logo=axios&logoColor=white)](https://axios-http.com/)

> A modern full-stack e-commerce platform built with the MERN stack, featuring authentication, product management, persistent shopping carts, order processing, admin management, and SSLCommerz online payments.

**[🚀 Live Demo](https://goflex-kappa.vercel.app)**

**[📦 GitHub Repository](https://github.com/tawhidtasin77/GoFlex)**

---

## 📌 Overview

**GoFlex** is a full-stack e-commerce application built using the **MERN stack — MongoDB, Express.js, React, and Node.js**.

The application provides a complete online shopping workflow, including product discovery, authentication, cart management, checkout, order processing, online payment integration, and administrative management.

The project follows a **client-server architecture** with a React-based frontend and a RESTful Express.js backend.

---

## ✨ Features

### 🛍️ Customer Features

- Browse and explore products
- Product details
- Featured products
- Product categories
- Category-based product filtering
- Shopping cart
- Persistent cart storage
- User-specific cart persistence
- Guest cart support
- User registration and login
- OTP-based email verification
- User authentication
- User profile management
- Protected routes
- Checkout
- Order creation
- Order management
- Online payment
- Payment success/failure/cancellation handling
- Payment IPN handling
- Responsive user interface
- Toast notifications

### 🔐 Authentication & Authorization

- User registration
- User login/logout
- Cookie-based authentication
- Protected resources
- Current-user authentication
- Admin authorization
- OTP verification
- Password hashing
- User-specific data management

### 💳 Payment System

GoFlex integrates **SSLCommerz** for online payments.

The payment system supports:

- Payment session creation
- SSLCommerz gateway redirection
- Successful payment handling
- Failed payment handling
- Cancelled payment handling
- IPN processing
- Payment verification
- Transaction ID tracking
- Duplicate payment verification prevention

### 👨‍💼 Admin Features

The application includes a dedicated admin section for platform management.

- Admin dashboard
- Product management
- Add products
- Update products
- Delete products
- Order management
- User management
- View customer orders
- Monitor order and payment information

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Development and build tool |
| React Router | Client-side routing |
| Redux Toolkit | Global state management |
| React Redux | Redux integration |
| Tailwind CSS | Styling |
| Axios | API communication |
| AOS | Scroll animations |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| JWT / Cookies | Authentication |
| Nodemailer | Email and OTP delivery |
| Cloudinary | Image/media management |
| SSLCommerz | Online payment gateway |

## Development Tools

- Git
- GitHub
- VS Code
- Postman
- Ngrok
- npm

---

# 🏗️ Architecture

GoFlex follows a **client-server architecture**.

```text
                    ┌─────────────────────┐
                    │       Frontend      │
                    │     React + Vite    │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │       Backend       │
                    │  Node.js + Express  │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
                 ▼             ▼             ▼
            ┌─────────┐   ┌──────────┐  ┌────────────┐
            │ MongoDB │   │Cloudinary│  │ SSLCommerz │
            └─────────┘   └──────────┘  └────────────┘
```

### Frontend Flow

```text
React Components
       │
       ▼
React Router
       │
       ▼
Context / Redux Toolkit
       │
       ▼
Axios API Layer
       │
       ▼
Express REST API
```

### Backend Flow

```text
Request
   │
   ▼
Express Router
   │
   ▼
Middleware
   │
   ▼
Controller
   │
   ▼
Service Layer
   │
   ▼
Mongoose Model
   │
   ▼
MongoDB
```

---

# 📂 Project Structure

```text
GoFlex/
│
├── backend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── templates/
│   │   ├── utils/
│   │   │
│   │   ├── app.js
│   │   ├── constants.js
│   │   ├── env.js
│   │   └── index.js
│   │
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── admin/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── utils/
│   │   │
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── Layout.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── index.html
│   ├── package-lock.json
│   └── package.json
│
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

---

# 🔑 Core Modules

## Authentication

GoFlex provides a complete authentication workflow:

```text
Register
   ↓
Email / OTP Verification
   ↓
Login
   ↓
Authenticated Session
   ↓
Protected Resources
```

Authentication state is managed using **React Context**, while Redux Toolkit handles application-level cart state.

---

## 🛒 Shopping Cart

The cart system supports persistent and user-specific cart storage.

Authenticated users have an isolated cart based on their user ID:

```text
cartItems_<userId>
```

This prevents different users from sharing the same locally stored cart.

Guest users can also maintain a cart locally.

---

## 📦 Order Management

The checkout process follows this workflow:

```text
Cart
 ↓
Checkout
 ↓
Create Order
 ↓
Create Payment
 ↓
SSLCommerz Gateway
 ↓
Payment Verification
 ↓
Order Confirmation
```

Orders contain information such as:

- Products
- Quantities
- Prices
- Total amount
- Customer address
- Order information
- Payment information

---

# 💳 Payment Flow

GoFlex uses **SSLCommerz** for online payment processing.

```text
Customer
    │
    ▼
Checkout
    │
    ▼
Create Order
    │
    ▼
Create Payment Session
    │
    ▼
SSLCommerz Gateway
    │
    ├──────────────► Success
    │
    ├──────────────► Failure
    │
    ├──────────────► Cancellation
    │
    └──────────────► IPN
                         │
                         ▼
                  Payment Verification
                         │
                         ▼
                  Update Payment Status
```

The backend handles the different SSLCommerz callback scenarios and verifies payment status before completing the payment workflow.

---

# 🌐 API Overview

The backend exposes RESTful APIs under:

```text
/api/v1
```

## Users

```text
/api/v1/users
```

Responsible for:

- Registration
- Login
- Logout
- OTP verification
- Current user
- User management
- Authentication-related operations

## Products

```text
/api/v1/products
```

Responsible for:

- Creating products
- Fetching products
- Fetching featured products
- Fetching individual products
- Updating products
- Deleting products
- Product categories

## Orders

```text
/api/v1/orders
```

Responsible for:

- Creating orders
- Retrieving orders
- Managing orders
- Admin order operations

## Payments

```text
/api/v1/payments
```

Responsible for:

- Creating payment sessions
- Payment success callback
- Payment failure callback
- Payment cancellation callback
- IPN processing
- Payment verification

> Endpoint names may vary depending on the final backend route configuration.

---

# 🚀 Getting Started

Follow the steps below to run GoFlex locally.

## Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB
- Git

You will also need credentials/configuration for:

- MongoDB
- Cloudinary
- SSLCommerz
- SMTP/email provider

---

## 1. Clone the Repository

```bash
git clone https://github.com/tawhidtasin77/GoFlex.git
cd GoFlex
```

---

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

# 🔐 Environment Variables

GoFlex requires environment variables for database access, authentication, email, media storage, payment processing, and frontend/backend communication.

```text
backend/.env
```

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=access_token_secret
ACCESS_TOKEN_EXPIRY=access_token_expiry

REFRESH_TOKEN_SECRET=refresh_token_secret
REFRESH_TOKEN_EXPIRY=refresh_token_expiry

CLOUDINARY_CLOUD_NAME=cloudinary_cloud_name
CLOUDINARY_API_KEY=cloudinary_api_key
CLOUDINARY_API_SECRET=cloudinary_api_secret

NODE_ENV=development

EMAIL_USER=smtp_host
EMAIL_PASS=smtp_pass

ADMIN_EMAIL=admin_email

SSLCOMMERZ_STORE_ID=store_id
SSLCOMMERZ_STORE_PASSWORD=store_password
SSLCOMMERZ_IS_LIVE=false

BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

---

# ▶️ Running the Application

## Start the Backend

From the `backend` directory:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

## Start the Frontend

From the `frontend` directory:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

# 🧪 API Testing

The backend APIs can be tested using **Postman**.

Typical workflow:

```text
Register
   ↓
Verify OTP
   ↓
Login
   ↓
Get Current User
   ↓
Browse Products
   ↓
Add Products to Cart
   ↓
Create Order
   ↓
Create Payment
   ↓
Verify Payment
```

During local payment testing, a tunneling service such as **Ngrok** can be used to expose the local backend to SSLCommerz callbacks.

---

# 🔒 Security

GoFlex follows several security practices, including:

- Environment-based secret management
- Cookie-based authentication
- Protected routes
- Role-based authorization
- Server-side validation
- Centralized error handling
- CORS configuration
- Password hashing
- Payment verification
- Separation of frontend and backend responsibilities

---

# 🧩 State Management

GoFlex uses different state-management approaches depending on the responsibility.

## React Context

Authentication state is managed through React Context.

```text
AuthContext
 ├── Current User
 ├── Login
 ├── Logout
 └── Authentication Loading State
```

## Redux Toolkit

Redux Toolkit manages the shopping cart.

```text
Redux Store
   │
   └── Cart Slice
        ├── Add to Cart
        ├── Update Cart
        ├── Remove Item
        ├── Clear Cart
        └── User-specific persistence
```

This separation keeps authentication and cart responsibilities organized.

---

# 📊 Application Workflow

```text
                    GoFlex
                       │
        ┌──────────────┴──────────────┐
        │                             │
      User                          Admin
        │                             │
        ▼                             ▼
   Browse Products              Admin Dashboard
        │                             │
        ▼                    ┌────────┼────────┐
   Product Details           │        │        │
        │                    ▼        ▼        ▼
        ▼                 Products  Orders   Users
      Cart
        │
        ▼
    Checkout
        │
        ▼
     Order
        │
        ▼
    SSLCommerz
        │
        ▼
Payment Verification
        │
        ▼
Order Confirmation
```

---

# 🧠 Key Learning Outcomes

Building GoFlex provided practical experience with:

- MERN stack development
- REST API architecture
- React component architecture
- React Router
- React Context API
- Redux Toolkit
- Authentication and authorization
- Cookie-based authentication
- MongoDB data modeling
- Mongoose
- Image/media uploads
- Cloudinary integration
- Email/OTP verification
- Payment gateway integration
- Order processing
- Admin dashboards
- API error handling
- Environment configuration
- Git/GitHub workflow
- Payment callback testing
- Frontend/backend deployment

---

# 📄 License

This project is currently available for educational and portfolio purposes.

---

# 👨‍💻 Author

**Tawhid Islam Tasin**

- GitHub: [@tawhidtasin77](https://github.com/tawhidtasin77)

- LinkedIn: [Tawhid Islam Tasin](https://bd.linkedin.com/in/tawhid-islam-tasin)

---

## ⭐ Show Your Support

If you found this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

Built with using the MERN Stack.
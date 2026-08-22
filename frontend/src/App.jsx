import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import Layout from "./Layout.jsx";

import Shop from "./pages/Shop.jsx";
import ProductDetail from "./pages/ProductDetails.jsx"
import Cart from "./pages/Cart.jsx";
import Profile from "./pages/Profile.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyOTP from "./pages/VerifyOTP.jsx";

// Admin pages
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AddProduct from "./admin/AddProduct.jsx"
import AdminProducts from "./admin/AdminProducts.jsx";
import EditProduct from "./admin/EditProduct.jsx";
import AdminOrders from "./admin/AdminOrders.jsx";
import AdminUsers from "./admin/AdminUsers.jsx";

import "./App.css";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>

        {/* ==================== PUBLIC ROUTES ==================== */}

        <Route index element={<Home />} />

        <Route path="shop" element={<Shop />} />

        <Route
          path="product/:id"
          element={<ProductDetail />}
        />

        <Route path="cart" element={<Cart />} />

        <Route path="profile" element={<Profile />} />

        {/* ==================== AUTH ROUTES ==================== */}

        <Route path="login" element={<Login />} />

        <Route path="register" element={<Register />} />

        <Route path="verify-otp" element={<VerifyOTP />} />

        {/* ==================== ADMIN ROUTES ==================== */}

        <Route
          path="admin"
          element={<AdminDashboard />}
        />

        <Route
          path="admin/add-product"
          element={<AddProduct />}
        />

        <Route
          path="admin/products"
          element={<AdminProducts />}
        />

        <Route
          path="admin/edit-product/:id"
          element={<EditProduct />}
        />

        <Route
          path="admin/orders"
          element={<AdminOrders />}
        />

        <Route
          path="admin/users"
          element={<AdminUsers />}
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
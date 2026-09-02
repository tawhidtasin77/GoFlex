import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";

import Home from "./pages/Home.jsx";
import Layout from "./Layout.jsx";
import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";

import ProductDetail from "./pages/ProductDetails.jsx";

import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyOTP from "./pages/VerifyOTP.jsx";

import Checkout from "./pages/Checkout.jsx";

import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentFail from "./pages/PaymentFail.jsx";
import PaymentCancel from "./pages/PaymentCancel.jsx";

import About from "./pages/About.jsx";
import ReturnPolicy from "./pages/ReturnPolicy.jsx";
import RequestReturn from "./pages/RequestReturn.jsx";
import Disclaimer from "./pages/Disclaimer.jsx";

import AdminDashboard from "./admin/AdminDashboard.jsx";
import AddProduct from "./admin/AddProduct.jsx";
import AdminProducts from "./admin/AdminProducts.jsx";
import AdminOrders from "./admin/AdminOrders.jsx";
import AdminUsers from "./admin/AdminUsers.jsx";
import EditProduct from "./admin/EditProduct.jsx";
import AdminReturnRequests from "./admin/AdminReturnRequests.jsx";

import "./App.css";

const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>

        {/* Home */}
        <Route index element={<Home />} />

        {/* Shop */}
        <Route
          path="shop"
          element={<Shop />}
        />

        {/* Product Details */}
        <Route
          path="product/:id"
          element={<ProductDetail />}
        />

        {/* Cart */}
        <Route
          path="cart"
          element={<Cart />}
        />

        {/* Checkout */}
        <Route
          path="checkout"
          element={<Checkout />}
        />

        {/* User */}
        <Route
          path="profile"
          element={<Profile />}
        />

        {/* Authentication */}
        <Route
          path="login"
          element={<Login />}
        />

        <Route
          path="register"
          element={<Register />}
        />

        <Route
          path="verify-otp"
          element={<VerifyOTP />}
        />

        {/* Payment */}
        <Route
          path="payment-success"
          element={<PaymentSuccess />}
        />

        <Route
          path="payment-fail"
          element={<PaymentFail />}
        />

        <Route
          path="payment-cancel"
          element={<PaymentCancel />}
        />

        {/* Static Pages */}
        <Route
          path="about"
          element={<About />}
        />

        <Route
          path="return-policy"
          element={<ReturnPolicy />}
        />

        <Route
          path="request-return"
          element={<RequestReturn />}
        />

        <Route
          path="disclaimer"
          element={<Disclaimer />}
        />

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
          path="admin/orders"
          element={<AdminOrders />}
        />

        <Route
          path="admin/users"
          element={<AdminUsers />}
        />

        <Route
          path="admin/edit-product/:id"
          element={<EditProduct />}
        />

        <Route
          path="admin/returns"
          element={<AdminReturnRequests />}
        />

      </Route>
    )
  );

function App() {
  return <RouterProvider router={router} />;
}

export default App;
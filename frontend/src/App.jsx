import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import Layout from "./Layout.jsx";
import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";
// import ProductDetail from "./pages/ProductDetail.jsx";
import ProductDetail from "./pages/ProductDetails.jsx"
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyOTP from "./pages/VerifyOTP.jsx";
import Checkout from "./pages/Checkout.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";

import AdminDashboard from "./admin/AdminDashboard.jsx";
import AddProduct from "./admin/AddProduct.jsx";
import AdminProducts from "./admin/AdminProducts.jsx";
import AdminOrders from "./admin/AdminOrders.jsx";
import AdminUsers from "./admin/AdminUsers.jsx";
import EditProduct from "./admin/EditProduct.jsx";

import "./App.css";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>

        <Route index element={<Home />} />

        <Route path="shop" element={<Shop />} />

        <Route
          path="product/:id"
          element={<ProductDetail />}
        />

        <Route path="cart" element={<Cart />} />

        <Route path="checkout" element={<Checkout />} />

        <Route path="profile" element={<Profile />} />

        <Route path="login" element={<Login />} />

        <Route path="register" element={<Register />} />

        <Route path="verify-otp" element={<VerifyOTP />} />

        <Route
          path="payment-success"
          element={<PaymentSuccess />}
        />

        <Route path="admin" element={<AdminDashboard />} />

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

      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
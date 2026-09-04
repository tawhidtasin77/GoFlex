import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import "../App.css"
import { api } from "../api/api";

const Checkout = () => {
  const { user } = useContext(AuthContext);

  const cartItems = useSelector(
    (state) => state.cart.cartItems
  );

  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    country: "Bangladesh",
  });

  const [loading, setLoading] = useState(false);

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      navigate("/cart");
      return;
    }

    try {
      setLoading(true);

      const orderResponse = await api.post("/orders", {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        address,
      });

      const order = orderResponse.data.data;

      const paymentResponse = await api.post(
        "/payments/create",
        {
          orderId: order._id,
        }
      );

      const paymentData = paymentResponse.data.data;

      if (!paymentData?.gatewayPageURL) {
        throw new Error(
          "Payment gateway URL was not received."
        );
      }

      window.location.href =
        paymentData.gatewayPageURL;
    } catch (error) {
      console.error("Checkout error:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while processing your order.";

      // alert(message);

      {<div role="alert" className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{message}</span>
      </div>}


    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-gray-100 px-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Login Required
        </h1>

        <p className="mt-2 text-gray-500">
          Please login before proceeding to checkout.
        </p>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-6 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Checkout
          </h1>

          <p className="mt-2 text-gray-500">
            Complete your shipping information and proceed
            to payment.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-xl bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="mb-6 text-xl font-semibold text-gray-800">
                Shipping Address
              </h2>

              <div className="space-y-5">

                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={address.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={address.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    required
                    autoComplete="tel"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="street"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Street Address
                  </label>

                  <input
                    id="street"
                    name="street"
                    type="text"
                    value={address.street}
                    onChange={handleChange}
                    placeholder="House, road, area"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={address.city}
                      onChange={handleChange}
                      placeholder="Dhaka"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="postalCode"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Postal Code
                    </label>

                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      value={address.postalCode}
                      onChange={handleChange}
                      placeholder="1200"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>

                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={address.country}
                    onChange={handleChange}
                    required
                    readOnly
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 outline-none"
                  />
                </div>

              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  cartItems.length === 0
                }
                className="mt-8 w-full cursor-pointer rounded-lg bg-orange-500 px-6 py-3.5 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400 lg:hidden"
              >
                {loading
                  ? "Processing..."
                  : "Proceed to Payment"}
              </button>
            </form>
          </div>

          <div>
            <div className="rounded-xl bg-white p-6 shadow-sm">

              <h2 className="mb-6 text-xl font-semibold text-gray-800">
                Order Summary
              </h2>

              <div className="space-y-4">

                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4"
                  >
                    <div className="min-w-0">
                      <h3 className="truncate font-medium text-gray-800">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>

                      <p className="text-sm text-gray-500">
                        ৳{Number(item.price).toFixed(2)} each
                      </p>
                    </div>

                    <p className="whitespace-nowrap font-semibold text-gray-800">
                      ৳
                      {(
                        Number(item.price) *
                        item.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                ))}

              </div>

              <div className="mt-6 border-t border-gray-200 pt-5">

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-800">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-orange-500">
                    ৳{totalPrice.toFixed(2)}
                  </span>
                </div>

              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={
                  loading ||
                  cartItems.length === 0
                }
                className="mt-6 hidden w-full rounded-lg bg-orange-500 px-6 py-3.5 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400 lg:block"
              >
                {loading
                  ? "Processing..."
                  : "Proceed to Payment"}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-gray-500">
                You will be redirected to SSLCommerz to
                securely complete your payment.
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
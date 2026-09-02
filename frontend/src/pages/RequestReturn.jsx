import React, {
  useContext,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router";

import { AuthContext } from "../context/AuthContext";

import { api } from "../api/api";

import Toast from "../components/Toast";


const RequestReturn = () => {

  const {
    user,
    loading: authLoading,
  } = useContext(AuthContext);

  const navigate = useNavigate();


  const [orderId, setOrderId] =
    useState("");

  const [order, setOrder] =
    useState(null);

  const [selectedProductId, setSelectedProductId] =
    useState("");

  const [reason, setReason] =
    useState("");

  const [message, setMessage] =
    useState("");


  const [loadingOrder, setLoadingOrder] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [toast, setToast] =
    useState(null);

  const handleFindOrder = async () => {

    if (!orderId.trim()) {

      setToast({
        type: "error",
        message:
          "Please enter your Order ID.",
      });

      return;
    }


    try {

      setLoadingOrder(true);

      setOrder(null);

      setSelectedProductId("");


      const response =
        await api.get(
          `/returns/order/${orderId.trim()}`
        );


      const foundOrder =
        response.data.data;


      if (!foundOrder) {

        setToast({
          type: "error",
          message:
            "Order not found.",
        });

        return;
      }


      setOrder(foundOrder);


    } catch (error) {

      console.error(
        "Find order error:",
        error
      );


      setToast({
        type: "error",
        message:
          error.response?.data?.message ||
          "Could not find this order or order not delivered yet.",
      });

    } finally {

      setLoadingOrder(false);

    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!user) {

      navigate("/login");

      return;
    }


    if (!order) {

      setToast({
        type: "error",
        message:
          "Please find your order first.",
      });

      return;
    }


    if (!selectedProductId) {

      setToast({
        type: "error",
        message:
          "Please select the product you want to return.",
      });

      return;
    }


    if (!reason) {

      setToast({
        type: "error",
        message:
          "Please select a reason for the return.",
      });

      return;
    }


    try {

      setLoading(true);


      const response =
        await api.post(
          "/returns/request",
          {
            orderId:
              orderId.trim(),

            productId:
              selectedProductId,

            reason,

            message:
              message.trim(),
          }
        );


      setToast({
        type: "success",
        message:
          response.data.message ||
          "Return request submitted successfully.",
      });


      // Reset form
      setOrderId("");

      setOrder(null);

      setSelectedProductId("");

      setReason("");

      setMessage("");

      setTimeout(() => {

        navigate("/profile");

      }, 3000);


    } catch (error) {

      console.error(
        "Return request error:",
        error
      );


      setToast({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to submit return request.",
      });

    } finally {

      setLoading(false);

    }
  };

  if (authLoading) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">

        <p className="text-orange-500">
          Loading...
        </p>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-300">

      {/* Toast */}

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          duration={3000}
          onClose={() =>
            setToast(null)
          }
        />
      )}


      <div className="mx-auto max-w-2xl">


        <Link
          to="/return-policy"
          className="mb-6 inline-block text-sm font-medium text-zinc-400 transition hover:text-orange-500"
        >
          ← Back to Return Policy
        </Link>


        <div className="mb-8">

          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/10 text-3xl ring-1 ring-orange-500/20">
            ↩️
          </div>


          <h1 className="text-3xl font-bold text-white">
            Request a Return
          </h1>


          <p className="mt-3 leading-6 text-zinc-400">
            Enter your Order ID, select the
            product you want to return, and
            tell us why.
          </p>

        </div>


        {!user ? (

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">

            <div className="mb-4 text-4xl">
              🔐
            </div>


            <h2 className="text-xl font-bold text-white">
              Login Required
            </h2>


            <p className="mt-3 text-zinc-400">
              You need to login before
              submitting a return request.
            </p>


            <Link
              to="/login"
              className="mt-6 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Login
            </Link>

          </div>

        ) : (

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl sm:p-8"
          >

            <div className="mb-6">

              <label
                htmlFor="orderId"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Order ID
              </label>


              <div className="flex gap-2">

                <input
                  id="orderId"
                  type="text"
                  value={orderId}
                  onChange={(e) =>
                    setOrderId(
                      e.target.value
                    )
                  }
                  placeholder="Enter your Order ID"
                  required
                  className="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />


                <button
                  type="button"
                  onClick={handleFindOrder}
                  disabled={loadingOrder}
                  className="cursor-pointer shrink-0 rounded-lg bg-zinc-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loadingOrder
                    ? "Finding..."
                    : "Find Order"}

                </button>

              </div>


              <p className="mt-2 text-xs text-zinc-500">
                You can find your Order ID
                in your order history.
              </p>

            </div>

            {order && (

              <div className="mb-6">

                <div className="mb-3 flex items-center justify-between">

                  <h2 className="text-sm font-semibold text-zinc-300">
                    Select Product to Return
                  </h2>


                  <span className="text-xs text-green-500">
                    ✓ Order found
                  </span>

                </div>


                <div className="space-y-3">

                  {order.items?.map(
                    (item, index) => {

                      const product =
                        item.product;

                      const productId =
                        product?._id ||
                        item.productId ||
                        item.product;


                      const productName =
                        product?.name ||
                        item.name ||
                        "Product";


                      const productImage =
                        product?.image ||
                        item.image ||
                        null;


                      return (

                        <button
                          type="button"
                          key={
                            productId ||
                            index
                          }
                          onClick={() =>
                            setSelectedProductId(
                              productId?.toString() ||
                              ""
                            )
                          }
                          className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                            selectedProductId ===
                            productId?.toString()
                              ? "border-orange-500 bg-orange-500/10"
                              : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                          }`}
                        >


                          {/* Product Image */}

                          {productImage ? (

                            <img
                              src={productImage}
                              alt={productName}
                              className="h-16 w-16 rounded-lg object-cover"
                            />

                          ) : (

                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-2xl">
                              📦
                            </div>

                          )}


                          {/* Product Info */}

                          <div className="min-w-0 flex-1">

                            <h3 className="truncate font-semibold text-white">
                              {productName}
                            </h3>


                            <p className="mt-1 text-sm text-zinc-500">

                              Quantity:{" "}
                              {item.quantity ||
                                1}

                            </p>

                          </div>

                          <div
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                              selectedProductId ===
                              productId?.toString()
                                ? "border-orange-500 bg-orange-500"
                                : "border-zinc-600"
                            }`}
                          >

                            {selectedProductId ===
                              productId?.toString() && (

                              <span className="text-xs text-white">
                                ✓
                              </span>

                            )}

                          </div>


                        </button>

                      );

                    }
                  )}

                </div>


                {!order.items?.length && (

                  <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-500">
                    No products were found
                    in this order.
                  </div>

                )}

              </div>

            )}

            <div className="mb-6">

              <label
                htmlFor="reason"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Reason for Return
              </label>


              <select
                id="reason"
                value={reason}
                onChange={(e) =>
                  setReason(
                    e.target.value
                  )
                }
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              >

                <option value="">
                  Select a reason
                </option>

                <option value="Product is damaged">
                  Product is damaged
                </option>

                <option value="Wrong product received">
                  Wrong product received
                </option>

                <option value="Product is defective">
                  Product is defective
                </option>

                <option value="Product does not match description">
                  Product does not match description
                </option>

                <option value="Changed my mind">
                  Changed my mind
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

            <div className="mb-6">

              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >

                Additional Message

                <span className="ml-2 text-xs text-zinc-500">
                  (Optional)
                </span>

              </label>


              <textarea
                id="message"
                rows="5"
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                placeholder="Provide any additional information about your return..."
                className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />

            </div>

            <div className="mb-6 rounded-xl border border-orange-500/20 bg-orange-500/10 p-4">

              <h3 className="mb-2 font-semibold text-orange-500">
                Important
              </h3>


              <ul className="space-y-1 text-sm leading-6 text-zinc-300">

                <li>
                  • Enter your own Order ID.
                </li>

                <li>
                  • Select the product from
                  your order.
                </li>

                <li>
                  • You don't need to enter
                  a Product ID manually.
                </li>

                <li>
                  • Your request will be
                  reviewed by the GoFlex
                  admin team.
                </li>

              </ul>

            </div>

            <button
              type="submit"
              disabled={
                loading ||
                !order ||
                !selectedProductId
              }
              className="cursor-pointer w-full rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading
                ? "Submitting Request..."
                : "Submit Return Request"}

            </button>


          </form>

        )}

      </div>

    </div>
  );
};


export default RequestReturn;
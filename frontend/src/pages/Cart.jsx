import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import {
  removeFromCart,
  addToCart,
} from "../redux/cartSlice";

const Cart = () => {
  const cartItems = useSelector(
    (state) => state.cart.cartItems
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (item, quantity) => {
    if (quantity < 1) {
      return;
    }

    dispatch(
      addToCart({
        ...item,
        quantity,
      })
    );
  };

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Shopping Cart
          </h1>

          <p className="mt-2 text-gray-500">
            Review your products before checkout.
          </p>
        </div>

        {cartItems.length === 0 ? (

          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl bg-white px-6 shadow-sm">

            <div className="mb-4 text-5xl">
              🛒
            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              Your cart is empty
            </h2>

            <p className="mt-2 text-gray-500">
              Add some products before checking out.
            </p>

            <Link
              to="/shop"
              className="mt-6 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Go Shopping
            </Link>

          </div>

        ) : (

          <div className="grid gap-8 lg:grid-cols-3">

            <div className="space-y-4 lg:col-span-2">

              {cartItems.map((item) => (

                <div
                  key={item.productId}
                  className="flex flex-col gap-5 rounded-xl bg-white p-5 shadow-sm sm:flex-row"
                >

                  <div className="flex h-32 w-full shrink-0 items-center justify-center rounded-lg bg-gray-50 sm:w-32">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full rounded-lg object-contain p-2"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-lg font-bold text-orange-500">
                          ৳{Number(item.price).toFixed(2)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(item.productId)
                        }
                        className="text-sm hover:cursor-pointer font-medium text-red-500 transition hover:text-red-600"
                      >
                        Remove
                      </button>

                    </div>

                    <div className="mt-auto flex items-center justify-between pt-5">

                      <div className="flex items-center rounded-lg border border-gray-300">

                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateQuantity(
                              item,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity === 1}
                          className="cursor-pointer px-4 py-2 text-lg text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                        >
                          −
                        </button>

                        <span className="min-w-10 border-x border-gray-300 px-3 py-2 text-center font-medium text-gray-800">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateQuantity(
                              item,
                              item.quantity + 1
                            )
                          }
                          className="cursor-pointer px-4 py-2 text-lg text-gray-700 transition hover:bg-gray-100"
                        >
                          +
                        </button>

                      </div>

                      <p className="font-semibold text-gray-800">
                        ৳
                        {(
                          Number(item.price) *
                          item.quantity
                        ).toFixed(2)}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

            <div className="h-fit rounded-xl bg-white p-6 shadow-sm">

              <h2 className="text-xl font-semibold text-gray-800">
                Cart Summary
              </h2>

              <div className="mt-6 border-t border-gray-200 pt-5">

                <div className="flex items-center justify-between">

                  <span className="text-lg font-medium text-gray-600">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-orange-500">
                    ৳{totalPrice.toFixed(2)}
                  </span>

                </div>

              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="cursor-pointer mt-6 w-full rounded-lg bg-orange-500 px-6 py-3.5 font-semibold text-white transition hover:bg-orange-600"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/shop"
                className="mt-3 block w-full rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold !text-black transition hover:bg-gray-50"
              >
                Continue Shopping
              </Link>

            </div>

          </div>

        )}

      </div>
    </div>
  );
};

export default Cart;
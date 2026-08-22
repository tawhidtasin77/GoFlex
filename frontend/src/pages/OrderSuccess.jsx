import React from "react";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-2xl sm:p-12">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
          <span className="text-5xl text-green-500">✓</span>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Payment Successful!
        </h1>

        <p className="mb-8 text-base leading-7 text-zinc-400 sm:text-lg">
          Thank you for your order. Your payment has been successfully
          received, and we will process your order shortly.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/orders"
            className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            View My Orders
          </Link>

          <Link
            to="/shop"
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-6 py-3 font-semibold text-white transition hover:bg-zinc-700"
          >
            Continue Shopping
          </Link>
        </div>

        <p className="mt-6 text-xs text-zinc-500">
          Thank you for choosing GoFlex.
        </p>

      </div>
    </div>
  );
};

export default OrderSuccess;
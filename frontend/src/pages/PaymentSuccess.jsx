import React from "react";
import { Link, useSearchParams } from "react-router";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();

  const transactionId =
    searchParams.get("transactionId");

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-5 py-10 text-white">

      <div className="w-full max-w-lg rounded-3xl border border-green-500/20 bg-zinc-900 p-8 text-center shadow-2xl sm:p-10">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl font-bold text-white">
            ✓
          </div>

        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-green-500">
          GoFlex Payment
        </p>

        <h1 className="text-3xl font-black text-white sm:text-4xl">
          Payment Successful!
        </h1>

        <p className="mt-4 leading-7 text-zinc-400">
          Thank you for your purchase. Your payment has been successfully
          processed and your order has been confirmed.
        </p>

        {transactionId && (
          <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-left">

            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Transaction ID
            </p>

            <p className="mt-2 break-all text-sm text-zinc-300">
              {transactionId}
            </p>

          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">

          <Link
            to="/shop"
            className="flex-1 rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Continue Shopping
          </Link>

          <Link
            to="/"
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-5 py-3 font-semibold text-white transition hover:bg-zinc-700"
          >
            Go to Home
          </Link>

        </div>

      </div>

    </main>
  );
};

export default PaymentSuccess;
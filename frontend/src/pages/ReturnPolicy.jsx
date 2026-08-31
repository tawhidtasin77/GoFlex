import React from "react";
import { Link } from "react-router";

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-300">
      <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl sm:p-10">
        
        <div className="mb-8 border-b border-zinc-800 pb-6">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/10 text-3xl ring-1 ring-orange-500/20">
            ↩️
          </div>

          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Return & Refund Policy
          </h1>

          <p className="mt-3 leading-7 text-zinc-400">
            Learn about GoFlex returns and refunds. If your order meets the
            requirements below, you can submit a return request.
          </p>
        </div>

        <p className="mb-8 leading-8">
          At{" "}
          <span className="font-semibold text-orange-500">
            GoFlex
          </span>
          , we aim to provide quality products and a reliable shopping
          experience. If you are not satisfied with your purchase, you may
          request a return within{" "}
          <span className="font-semibold text-white">
            30 days
          </span>{" "}
          of receiving your order, subject to the conditions below.
        </p>

        <section className="mb-7">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-orange-500">
            <span>1.</span>
            Eligibility for Returns
          </h2>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5">
            <p className="leading-8">
              To be eligible for a return, the product must be unused and in
              the same condition in which it was received. The product should
              also remain in its original packaging where applicable. Proof of
              purchase or order information may be required.
            </p>
          </div>
        </section>

        <section className="mb-7">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-orange-500">
            <span>2.</span>
            Refund Processing
          </h2>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5">
            <p className="leading-8">
              Once the returned product is received and inspected, GoFlex will
              notify you about the approval or rejection of your refund
              request. If approved, the refund will be processed through the
              applicable payment method. The time required for the refund to
              appear in your account may depend on the payment provider.
            </p>
          </div>
        </section>

        <section className="mb-7">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-orange-500">
            <span>3.</span>
            Non-Returnable Products
          </h2>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5">
            <p className="leading-8">
              Certain products may not be eligible for return, including
              products that have been used, damaged after delivery, modified,
              or otherwise altered from their original condition.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-orange-500">
            <span>4.</span>
            Return Shipping
          </h2>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-5">
            <p className="leading-8">
              Depending on the reason for the return, the customer may be
              responsible for return shipping costs. If the product was
              delivered incorrectly or arrived damaged, GoFlex may provide
              appropriate assistance regarding the return process.
            </p>
          </div>
        </section>

        <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                Need to return a product?
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
                If your order meets our return requirements, submit a return
                request and our team will review it.
              </p>
            </div>

            <Link
              to="/request-return"
              className="shrink-0 rounded-lg bg-orange-500 px-6 py-3 text-center font-semibold text-white transition hover:bg-orange-600"
            >
              Request a Return
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-zinc-800 pt-5">
          <p className="text-sm italic text-zinc-500">
            This Return & Refund Policy is intended for the GoFlex portfolio
            project and may be updated as the platform evolves.
          </p>
        </div>

      </div>
    </div>
  );
};

export default ReturnPolicy;
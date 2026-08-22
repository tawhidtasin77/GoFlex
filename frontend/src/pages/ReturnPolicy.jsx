import React from "react";

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-300">
      <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl sm:p-10">
        <h1 className="mb-6 border-b border-zinc-800 pb-5 text-3xl font-bold text-white sm:text-4xl">
          Return & Refund Policy
        </h1>

        <p className="mb-6 leading-8">
          At <span className="font-semibold text-orange-500">GoFlex</span>, we
          aim to provide quality products and a reliable shopping experience.
          If you are not satisfied with your purchase, you may request a
          return within 30 days of receiving your order, subject to the
          conditions below.
        </p>

        <section className="mb-7">
          <h2 className="mb-3 text-xl font-semibold text-orange-500">
            1. Eligibility for Returns
          </h2>

          <p className="leading-8">
            To be eligible for a return, the product must be unused and in the
            same condition in which it was received. The product should also
            remain in its original packaging where applicable. Proof of
            purchase or order information may be required.
          </p>
        </section>

        <section className="mb-7">
          <h2 className="mb-3 text-xl font-semibold text-orange-500">
            2. Refund Processing
          </h2>

          <p className="leading-8">
            Once the returned product is received and inspected, GoFlex will
            notify you about the approval or rejection of your refund request.
            If approved, the refund will be processed through the applicable
            payment method. The time required for the refund to appear in your
            account may depend on the payment provider.
          </p>
        </section>

        <section className="mb-7">
          <h2 className="mb-3 text-xl font-semibold text-orange-500">
            3. Non-Returnable Products
          </h2>

          <p className="leading-8">
            Certain products may not be eligible for return, including
            products that have been used, damaged after delivery, modified,
            or otherwise altered from their original condition.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold text-orange-500">
            4. Return Shipping
          </h2>

          <p className="leading-8">
            Depending on the reason for the return, the customer may be
            responsible for return shipping costs. If the product was
            delivered incorrectly or arrived damaged, GoFlex may provide
            appropriate assistance regarding the return process.
          </p>
        </section>

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
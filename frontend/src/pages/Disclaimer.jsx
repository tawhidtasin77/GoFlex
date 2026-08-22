import React from "react";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-zinc-300">
      <div className="mx-auto max-w-4xl">

        {/* =========================
            HEADER
        ========================== */}

        <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">

          <div className="mb-4 inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400">
            Legal Information
          </div>

          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Disclaimer
          </h1>

          <p className="mt-4 leading-7 text-zinc-400">
            Please read this disclaimer carefully before using the GoFlex
            website.
          </p>

        </div>


        {/* =========================
            CONTENT
        ========================== */}

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl sm:p-8">

          {/* Introduction */}

          <p className="leading-7 text-zinc-400">
            GoFlex is a full-stack e-commerce project created for
            educational, demonstration, and portfolio purposes. The
            website demonstrates common e-commerce functionality including
            product browsing, shopping cart management, user
            authentication, order management, and online payment
            integration.
          </p>


          {/* 1. Educational Project */}

          <section className="mt-8">

            <h2 className="mb-3 text-xl font-semibold text-orange-500">
              1. Educational & Portfolio Project
            </h2>

            <p className="leading-7 text-zinc-400">
              GoFlex is primarily a demonstration project and is not
              intended to represent a production commercial marketplace.
              Product information, prices, images, and other content may
              be used for demonstration purposes and may not represent
              actual products available for purchase.
            </p>

          </section>


          {/* 2. Product Information */}

          <section className="mt-8">

            <h2 className="mb-3 text-xl font-semibold text-orange-500">
              2. Product Information
            </h2>

            <p className="leading-7 text-zinc-400">
              Product names, descriptions, prices, stock quantities,
              categories, and images displayed on GoFlex may be sample or
              demonstration data. This information should not be considered
              an accurate representation of real-world products or
              availability.
            </p>

          </section>


          {/* 3. Payment */}

          <section className="mt-8">

            <h2 className="mb-3 text-xl font-semibold text-orange-500">
              3. Payment Processing
            </h2>

            <p className="leading-7 text-zinc-400">
              GoFlex uses the SSLCommerz payment gateway for payment
              integration. The currently deployed project may use the
              SSLCommerz Sandbox environment for testing and demonstration.
              Transactions performed through the sandbox environment are
              test transactions and do not represent real financial
              purchases.
            </p>

          </section>


          {/* 4. Personal Information */}

          <section className="mt-8">

            <h2 className="mb-3 text-xl font-semibold text-orange-500">
              4. Personal Information
            </h2>

            <p className="leading-7 text-zinc-400">
              Users should avoid submitting sensitive or unnecessary
              personal information while interacting with the demonstration
              version of GoFlex. Any information entered into the platform
              is handled as part of the application's demonstration
              functionality.
            </p>

          </section>


          {/* 5. External Services */}

          <section className="mt-8">

            <h2 className="mb-3 text-xl font-semibold text-orange-500">
              5. Third-Party Services
            </h2>

            <p className="leading-7 text-zinc-400">
              GoFlex may rely on third-party services such as SSLCommerz
              and Cloudinary. These services operate independently from
              GoFlex and are subject to their own terms, policies, and
              availability.
            </p>

          </section>


          {/* 6. Availability */}

          <section className="mt-8">

            <h2 className="mb-3 text-xl font-semibold text-orange-500">
              6. Website Availability
            </h2>

            <p className="leading-7 text-zinc-400">
              Because GoFlex is a portfolio and development project, some
              features may be changed, unavailable, removed, or modified
              without prior notice. The application may also contain
              technical limitations or temporary errors.
            </p>

          </section>


          {/* 7. External Links */}

          <section className="mt-8">

            <h2 className="mb-3 text-xl font-semibold text-orange-500">
              7. External Links
            </h2>

            <p className="leading-7 text-zinc-400">
              GoFlex may contain links to external websites or services.
              GoFlex does not control the content, availability, or policies
              of external websites and is not responsible for their
              practices.
            </p>

          </section>


          {/* 8. No Warranty */}

          <section className="mt-8">

            <h2 className="mb-3 text-xl font-semibold text-orange-500">
              8. No Warranty
            </h2>

            <p className="leading-7 text-zinc-400">
              GoFlex is provided as a demonstration application. No
              guarantee is made regarding the accuracy, reliability,
              availability, or suitability of the information and
              functionality provided by the platform.
            </p>

          </section>


          {/* Final Notice */}

          <div className="mt-10 rounded-xl border border-orange-500/20 bg-orange-500/5 p-5">

            <p className="text-sm italic leading-6 text-zinc-400">
              By using the GoFlex demonstration website, you acknowledge
              that this platform is intended primarily for educational and
              portfolio purposes and that certain data and payment
              functionality may operate in a testing environment.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Disclaimer;
import React, { useEffect } from "react";
import { Link } from "react-router";
import AOS from 'aos';
import 'aos/dist/aos.css';


const About = () => {

  useEffect(() => {
    AOS.init();
  }, [])
  

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-6xl">

        <section className="mb-16 text-center">

          <div className="mb-6 inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400">
            About GoFlex
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Shopping Made{" "}
            <span className="text-orange-500">
              Simple
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            GoFlex is a modern e-commerce platform built to make online
            shopping simple, secure, and convenient. Discover quality
            products, enjoy a smooth shopping experience, and get your
            orders delivered to your doorstep.
          </p>

        </section>

        <section className="mb-16 grid items-center gap-10 lg:grid-cols-2">

          {/* Left */}

          <div>

            <h2 className="text-3xl font-bold sm:text-4xl">
              What is{" "}
              <span className="text-orange-500">
                GoFlex?
              </span>
            </h2>

            <p className="mt-6 leading-7 text-zinc-400">
              GoFlex is a full-stack e-commerce platform designed with
              both customers and administrators in mind. Our goal is to
              provide a clean, fast, and reliable shopping experience.
            </p>

            <p className="mt-4 leading-7 text-zinc-400">
              From browsing products and managing your cart to placing
              orders and completing secure online payments, GoFlex brings
              the complete shopping journey together in one platform.
            </p>

            <Link
              to="/shop"
              className="mt-8 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Start Shopping
            </Link>

          </div>


          {/* Right */}

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-orange-500/10 text-3xl">
              🛍️
            </div>

            <h3 className="text-2xl font-semibold">
              Everything You Need
            </h3>

            <p className="mt-4 leading-7 text-zinc-400">
              Browse products, add your favorites to the cart, manage
              quantities, place orders, and pay securely through
              SSLCommerz.
            </p>

          </div>

        </section>

        <section data-aos="fade-up" className="mb-16">

          <div className="mb-10 text-center">

            <h2 className="text-3xl font-bold sm:text-4xl">
              Why Choose{" "}
              <span className="text-orange-500">
                GoFlex?
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
              We've designed GoFlex around the things that matter most
              when shopping online.
            </p>

          </div>


          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:-translate-y-1 hover:border-orange-500/40">

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10 text-2xl">
                🚀
              </div>

              <h3 className="text-lg font-semibold">
                Fast Experience
              </h3>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Enjoy a smooth and responsive shopping experience from
                browsing products to checkout.
              </p>

            </div>


            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:-translate-y-1 hover:border-orange-500/40">

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10 text-2xl">
                🔒
              </div>

              <h3 className="text-lg font-semibold">
                Secure Payments
              </h3>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Complete your online payments securely through the
                SSLCommerz payment gateway.
              </p>

            </div>


            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:-translate-y-1 hover:border-orange-500/40">

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10 text-2xl">
                📦
              </div>

              <h3 className="text-lg font-semibold">
                Easy Ordering
              </h3>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Add products to your cart, manage quantities, and place
                your order with just a few simple steps.
              </p>

            </div>


            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:-translate-y-1 hover:border-orange-500/40">

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10 text-2xl">
                💻
              </div>

              <h3 className="text-lg font-semibold">
                Modern Platform
              </h3>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Built as a modern full-stack application with a focus
                on performance, security, and usability.
              </p>

            </div>

          </div>

        </section>

        <section data-aos="fade-up" className="mb-16 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 sm:p-10">

          <div className="text-center">

            <h2 className="text-3xl font-bold">
              Built with Modern{" "}
              <span className="text-orange-500">
                Technology
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
              GoFlex is built as a full-stack MERN e-commerce application
              with modern tools and technologies.
            </p>

          </div>


          <div className="mt-8 flex flex-wrap justify-center gap-3">

            {[
              "MongoDB",
              "Express.js",
              "React",
              "Node.js",
              "Mongoose",
              "Redux Toolkit",
              "Tailwind CSS",
              "SSLCommerz",
              "Cloudinary",
            ].map((technology) => (

              <span
                key={technology}
                className="rounded-full border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-300"
              >
                {technology}
              </span>

            ))}

          </div>

        </section>


        <section data-aos="fade-up" className="rounded-2xl border border-orange-500/20 bg-orange-500/10 px-6 py-12 text-center sm:px-10">

          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to Start Shopping?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Explore our products and find something you'll love.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-block rounded-lg bg-orange-500 px-8 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Explore Products
          </Link>

        </section>

      </div>
    </div>
  );
};

export default About;
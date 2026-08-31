import React from "react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/5 bg-zinc-950 px-5 py-8 sm:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">

        <div className="text-center sm:text-left">
          <Link to="/">
            <h3 className="mb-2 text-xl font-bold text-white">
              Go<span className="text-orange-500">Flex</span>
            </h3>
          </Link>

          <p className="text-sm text-zinc-400">
            Premium E-Commerce Platform.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm sm:justify-start">
          <Link
            to="/about"
            className="text-zinc-400 transition hover:text-orange-500"
          >
            About Us
          </Link>

          <Link
            to="/return-policy"
            className="text-zinc-400 transition hover:text-orange-500"
          >
            Return Policy
          </Link>

          <Link
            to="/disclaimer"
            className="text-zinc-400 transition hover:text-orange-500"
          >
            Disclaimer
          </Link>
        </div>

        <div className="text-center text-sm text-zinc-500 sm:text-right">
          © {new Date().getFullYear()} GoFlex.
          <br className="sm:hidden" /> All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
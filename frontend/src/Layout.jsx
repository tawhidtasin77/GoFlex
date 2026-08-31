import React from "react";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router";
import Footer from "./components/Footer";
import ScrollToTop from "./utils/ScrollToTop";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <ScrollToTop />

      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
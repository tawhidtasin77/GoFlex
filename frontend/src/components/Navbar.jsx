import React, { useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "text-orange-500"
        : "text-zinc-400 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/90 shadow-lg shadow-black/20 backdrop-blur-xl">
      <nav className="!mx-auto flex h-[72px] w-full max-w-11/12 items-center justify-between px-5">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 ring-1 ring-orange-500/20">
            <span className="text-xl font-black text-orange-500">
              G
            </span>
          </div>

          <span className="text-2xl font-bold tracking-tight text-white">
            Go<span className="text-orange-500">Flex</span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">

          <NavLink
            to="/shop"
            className={navLinkClass}
          >
            Shop
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative flex items-center gap-2 text-sm font-medium transition-colors ${
                isActive
                  ? "text-orange-500"
                  : "text-zinc-400 hover:text-white"
              }`
            }
          >
            Cart

            {cartItems.length > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] font-bold text-white">
                {cartItems.length}
              </span>
            )}
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/profile"
                className={navLinkClass}
              >
                Hi, {user.name}
              </NavLink>

              {user.role === "admin" && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                      isActive
                        ? "border-orange-500/40 bg-orange-500/10 text-orange-500"
                        : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-orange-500/40 hover:text-orange-500"
                    }`
                  }
                >
                  Admin
                </NavLink>
              )}

              <button
                onClick={handleLogout}
                className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-sm font-medium text-red-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Login
            </NavLink>
          )}

        </div>
      </nav>
    </header>
  );
};

export default Navbar;
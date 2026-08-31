import React, { useContext, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navigate = useNavigate();

  // Open logout confirmation modal
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  // Confirm logout
  const confirmLogout = () => {
    logout();
    setMenuOpen(false);
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  // Cancel logout
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${isActive
      ? "text-orange-500"
      : "text-zinc-400 hover:text-white"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/95 shadow-lg shadow-black/20 backdrop-blur-xl">
        <nav className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">


          <Link
            to="/"
            onClick={closeMenu}
            className="flex shrink-0 items-center gap-2"
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




          <div className="hidden items-center gap-6 lg:flex">

            <NavLink
              to="/shop"
              className={navLinkClass}
            >
              Shop
            </NavLink>


            {/* Cart */}

            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative flex items-center gap-2 text-sm font-medium transition-colors ${isActive
                  ? "text-orange-500"
                  : "text-zinc-400 hover:text-white"
                }`
              }
            >
              <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
              </svg>


              {cartItems.length > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] font-bold text-white">
                  {cartItems.length}
                </span>
              )}
            </NavLink>


            {/* Logged In User */}

            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className={navLinkClass}
                >
                  Hi, {user.name}
                </NavLink>


                {/* Admin */}

                {user.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${isActive
                        ? "border-orange-500/40 bg-orange-500/10 text-orange-500"
                        : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-orange-500/40 hover:text-orange-500"
                      }`
                    }
                  >
                    Admin
                  </NavLink>
                )}

                <button
                  onClick={handleLogoutClick}
                  className="rounded-lg border hover:cursor-pointer border-red-500/20 bg-red-500/5 px-3 py-1.5 text-sm font-medium text-red-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
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

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-white transition hover:border-orange-500/50 hover:text-orange-500 lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>

            ) : (

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>

            )}
          </button>

        </nav>

        {menuOpen && (
          <div className="border-t border-white/5 bg-zinc-950 lg:hidden">

            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">


              <NavLink
                to="/shop"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-sm font-medium transition ${isActive
                    ? "bg-orange-500/10 text-orange-500"
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  }`
                }
              >
                Shop
              </NavLink>


              <NavLink
                to="/cart"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition ${isActive
                    ? "bg-orange-500/10 text-orange-500"
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  }`
                }
              >
                <span>Cart</span>

                {cartItems.length > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-500 px-2 text-xs font-bold text-white">
                    {cartItems.length}
                  </span>
                )}
              </NavLink>


              {user ? (
                <>
                  <div className="my-2 border-t border-zinc-800" />


                  <NavLink
                    to="/profile"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `rounded-lg px-4 py-3 text-sm font-medium transition ${isActive
                        ? "bg-orange-500/10 text-orange-500"
                        : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                      }`
                    }
                  >
                    Hi, {user.name}
                  </NavLink>

                  {user.role === "admin" && (
                    <NavLink
                      to="/admin"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `rounded-lg px-4 py-3 text-sm font-medium transition ${isActive
                          ? "bg-orange-500/10 text-orange-500"
                          : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                        }`
                      }
                    >
                      Admin Dashboard
                    </NavLink>
                  )}


                  <button
                    onClick={handleLogoutClick}
                    className="mt-2 w-full rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-left text-sm font-medium text-red-400 transition cursor-pointer hover:bg-red-500/10 hover:text-red-300"
                  >
                    Logout
                  </button>

                </>
              ) : (
                <>
                  <div className="my-2 border-t border-zinc-800" />

                  <NavLink
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-lg bg-orange-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:cursor-pointer hover:bg-orange-600"
                  >
                    Login
                  </NavLink>
                </>
              )}

            </div>

          </div>
        )}

      </header>

      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={cancelLogout}
        >
          <div
            className="w-full max-w-md animate-[fadeIn_0.2s_ease-out] rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Icon */}

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"
                />
              </svg>

            </div>


            <div className="mt-5 text-center">

              <h2 className="text-xl font-bold text-white">
                Logout Confirmation
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Are you sure you want to logout from your GoFlex account?
              </p>

            </div>

            <div className="mt-7 flex gap-3">

              <button
                type="button"
                onClick={cancelLogout}
                className="hover:cursor-pointer flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmLogout}
                className="hover:cursor-pointer flex-1 rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Yes, Logout
              </button>

            </div>

          </div>
        </div>
      )}

    </>
  );
};

export default Navbar;
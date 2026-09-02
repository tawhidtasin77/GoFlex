import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router";

import { AuthContext } from "../context/AuthContext";
import { api } from "../api/api";

const Profile = () => {
  const {
    user,
    logout,
    loading: authLoading,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] =
    useState(true);

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  const [logoutLoading, setLogoutLoading] =
    useState(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    const fetchMyOrders = async () => {
      try {
        setOrdersLoading(true);

        const response = await api.get(
          "/orders/my-orders"
        );

        setOrders(
          response.data.data || []
        );
      } catch (error) {
        console.error(
          "Failed to fetch orders:",
          error
        );

        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchMyOrders();
  }, [
    user,
    authLoading,
    navigate,
  ]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    if (logoutLoading) {
      return;
    }

    setShowLogoutModal(false);
  };

  const handleConfirmLogout = async () => {
    try {
      setLogoutLoading(true);

      await logout();

      setShowLogoutModal(false);

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      setLogoutLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-orange-500" />

          <p className="text-zinc-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/10 text-green-500 border border-green-500/20";

      case "shipped":
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20";

      case "processing":
        return "bg-orange-500/10 text-orange-500 border border-orange-500/20";

      case "cancelled":
        return "bg-red-500/10 text-red-500 border border-red-500/20";

      default:
        return "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl sm:p-8">

          <div className="flex flex-col justify-between gap-6 border-b border-zinc-800 pb-8 sm:flex-row sm:items-start">

            <div>
              <h1 className="mb-5 text-3xl font-bold text-white">
                My Profile
              </h1>

              <div className="space-y-2 text-zinc-400">

                <p>
                  <span className="font-semibold text-zinc-300">
                    Name:
                  </span>{" "}
                  {user.name}
                </p>

                <p>
                  <span className="font-semibold text-zinc-300">
                    Email:
                  </span>{" "}
                  {user.email}
                </p>

              </div>

              <span className="mt-4 inline-block rounded-lg bg-orange-500/10 px-3 py-1.5 text-sm font-semibold uppercase text-orange-500">
                Account Type: {user.role}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogoutClick}
              className="rounded-lg bg-red-500 px-5 py-2.5 font-semibold text-white transition hover:cursor-pointer hover:bg-red-600 active:scale-95"
            >
              Logout
            </button>

          </div>

          <div className="mt-8">

            <h2 className="mb-5 text-2xl font-semibold text-orange-500">
              Order History
            </h2>

            {ordersLoading ? (

              <div className="flex min-h-32 items-center justify-center">
                <p className="text-zinc-400">
                  Fetching your orders...
                </p>
              </div>

            ) : orders.length === 0 ? (

              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 text-center">

                <p className="mb-5 text-zinc-400">
                  You haven't placed any orders yet.
                </p>

                <Link
                  to="/shop"
                  className="inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
                >
                  Start Shopping
                </Link>

              </div>

            ) : (

              <div className="space-y-4">

                {orders.map((order) => (

                  <div
                    key={order._id}
                    className="flex flex-col justify-between gap-5 rounded-xl border border-zinc-800 bg-zinc-950 p-5 sm:flex-row sm:items-center"
                  >

                    <div className="space-y-2">

                      <p className="text-sm text-zinc-500">
                        Order ID:

                        <span className="ml-2 break-all text-zinc-300">
                          {order._id}
                        </span>
                      </p>

                      <p className="text-sm text-zinc-500">
                        Placed On:

                        <span className="ml-2 text-zinc-300">
                          {new Date(
                            order.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </p>

                      <p className="text-sm text-zinc-500">
                        Total:

                        <span className="ml-2 font-semibold text-green-500">
                          ৳
                          {Number(
                            order.totalAmount
                          ).toFixed(2)}
                        </span>
                      </p>

                      <p className="text-sm text-zinc-500">
                        Payment:

                        <span className="ml-2 font-medium text-zinc-300">
                          {order.paymentStatus}
                        </span>
                      </p>

                    </div>

                    <div>

                      <span
                        className={`inline-block rounded-full px-4 py-2 text-sm font-semibold capitalize ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </div>

      {showLogoutModal && (

        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={handleCancelLogout}
        >

          <div
            className="w-full max-w-md animate-in fade-in zoom-in-95 rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl duration-200"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

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

              <h3 className="text-xl font-bold text-white">
                Logout from GoFlex?
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Are you sure you want to logout
                from your account? You will need
                to login again to access your
                profile.
              </p>

            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">

              <button
                type="button"
                onClick={handleCancelLogout}
                disabled={logoutLoading}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-5 py-2.5 font-semibold text-zinc-300 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={logoutLoading}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
              >

                {logoutLoading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                )}

                {logoutLoading
                  ? "Logging out..."
                  : "Yes, Logout"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Profile;
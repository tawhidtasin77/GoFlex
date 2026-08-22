import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api/api";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const response = await api.get("/orders/my-orders");

        setOrders(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);

        if (error.response?.status === 401) {
          logout();
          navigate("/login");
        }

        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate, logout]);

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      logout();
      navigate("/login");
    }
  };

  if (!user) {
    return null;
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/10 text-green-500";

      case "shipped":
        return "bg-blue-500/10 text-blue-500";

      case "processing":
        return "bg-orange-500/10 text-orange-500";

      case "cancelled":
        return "bg-red-500/10 text-red-500";

      default:
        return "bg-yellow-500/10 text-yellow-500";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        {/* Profile Card */}

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
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-5 py-2.5 font-semibold text-white transition hover:bg-red-600"
            >
              Logout
            </button>

          </div>


          {/* Order History */}

          <div className="mt-8">

            <h2 className="mb-5 text-2xl font-semibold text-orange-500">
              Order History
            </h2>

            {loading ? (
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
                          ৳{Number(order.totalAmount).toFixed(2)}
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
    </div>
  );
};

export default Profile;
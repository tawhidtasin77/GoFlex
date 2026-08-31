import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api/api";

const AdminOrders = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);

        const response = await api.get("/orders");

        const orderData = response.data.data;

        setOrders(Array.isArray(orderData) ? orderData : []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);

        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, authLoading, navigate]);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingOrder(id);

      const response = await api.put(`/orders/${id}/status`, {
        status,
      });

      const updatedOrder = response.data.data;

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === id
            ? {
                ...order,
                ...updatedOrder,
              }
            : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/10 text-green-400 ring-green-500/20";

      case "shipped":
        return "bg-blue-500/10 text-blue-400 ring-blue-500/20";

      case "processing":
        return "bg-orange-500/10 text-orange-400 ring-orange-500/20";

      case "pending":
        return "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20";

      case "cancelled":
        return "bg-red-500/10 text-red-400 ring-red-500/20";

      default:
        return "bg-zinc-800 text-zinc-400 ring-zinc-700";
    }
  };

  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-500/10 text-green-400 ring-green-500/20";

      case "PENDING":
        return "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20";

      case "FAILED":
        return "bg-red-500/10 text-red-400 ring-red-500/20";

      case "CANCELLED":
        return "bg-orange-500/10 text-orange-400 ring-orange-500/20";

      case "REFUNDED":
        return "bg-purple-500/10 text-purple-400 ring-purple-500/20";

      default:
        return "bg-zinc-800 text-zinc-400 ring-zinc-700";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-orange-500" />

          <p className="text-sm text-zinc-500">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="mb-5 text-sm font-medium text-zinc-400 transition hover:text-orange-500"
          >
            ← Back to Dashboard
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-2xl ring-1 ring-orange-500/20">
              🚚
            </div>

            <div>
              <p className="text-sm font-medium text-orange-500">
                GoFlex Admin
              </p>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Manage Orders
              </h1>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-zinc-500">
            View customer orders, payment status, and update their delivery
            status.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/20">

          <div className="flex flex-col gap-3 border-b border-zinc-800 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-white">
                All Orders
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                {orders.length}{" "}
                {orders.length === 1 ? "order" : "orders"} found
              </p>
            </div>

            <div className="rounded-lg bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-500 ring-1 ring-orange-500/20">
              {orders.length} Total
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-3xl">
                📦
              </div>

              <h3 className="text-lg font-semibold text-white">
                No Orders Yet
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                Customer orders will appear here once someone purchases
                a product from GoFlex.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">

                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/50">

                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-zinc-500">
                      ORDER ID
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-zinc-500">
                      CUSTOMER
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-zinc-500">
                      TOTAL
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-zinc-500">
                      DATE
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-zinc-500">
                      PAYMENT
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-zinc-500">
                      STATUS
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-zinc-800 transition hover:bg-zinc-800/30"
                    >

                      <td className="px-6 py-5">
                        <span className="font-mono text-sm text-zinc-300">
                          #{order._id.substring(0, 8)}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div>
                          <p className="font-medium text-white">
                            {order.user?.name || "Deleted User"}
                          </p>

                          {order.user?.email && (
                            <p className="mt-1 text-xs text-zinc-500">
                              {order.user.email}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="font-semibold text-orange-500">
                          ৳{Number(order.totalAmount || 0).toFixed(2)}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div>
                          <p className="text-sm text-zinc-300">
                            {new Date(
                              order.createdAt
                            ).toLocaleDateString()}
                          </p>

                          <p className="mt-1 text-xs text-zinc-600">
                            {new Date(
                              order.createdAt
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </td>

                      {/* PAYMENT STATUS */}
                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getPaymentStatusStyle(
                            order.paymentStatus
                          )}`}
                        >
                          {formatStatus(order.paymentStatus)}
                        </span>
                      </td>

                      {/* ORDER STATUS */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {formatStatus(order.status)}
                          </span>

                          <select
                            value={order.status}
                            disabled={updatingOrder === order._id}
                            onChange={(e) =>
                              updateStatus(
                                order._id,
                                e.target.value
                              )
                            }
                            className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="pending">
                              Pending
                            </option>

                            <option value="processing">
                              Processing
                            </option>

                            <option value="shipped">
                              Shipped
                            </option>

                            <option value="delivered">
                              Delivered
                            </option>

                            <option value="cancelled">
                              Cancelled
                            </option>
                          </select>

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>

        {orders.length > 0 && (
          <div className="mt-5 flex items-center gap-2 text-xs text-zinc-600">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Changes to order status are saved immediately.
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminOrders;
import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { api } from "../api/api";
import Toast from "../components/Toast";

const AdminReturnRequests = () => {
  const {
    user,
    loading: authLoading,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const [returnRequests, setReturnRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [updatingId, setUpdatingId] =
    useState(null);

  const [toast, setToast] =
    useState(null);

  const fetchReturnRequests = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/return-request"
      );

      setReturnRequests(
        response.data.data || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch return requests:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        navigate("/login");
        return;
      }

      if (
        error.response?.status === 403
      ) {
        navigate("/");
        return;
      }

      setToast({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to load return requests.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "admin") {
      navigate("/");
      return;
    }

    fetchReturnRequests();
  }, [
    user,
    authLoading,
  ]);

  const updateStatus = async (
    id,
    status
  ) => {
    try {
      setUpdatingId(id);

      const response = await api.patch(
        `/return-request/${id}/status`,
        {
          status,
        }
      );

      const updatedReturn =
        response.data.data;

      setReturnRequests((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
              ...item,
              ...updatedReturn,
            }
            : item
        )
      );

      setToast({
        type: "success",
        message:
          response.data.message ||
          `Return request ${status} successfully.`,
      });
    } catch (error) {
      console.error(
        "Failed to update return status:",
        error
      );

      setToast({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to update return request.",
      });
    } finally {
      setUpdatingId(null);
    }
  };


  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-BD",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-400 ring-1 ring-green-500/20";

      case "rejected":
        return "bg-red-500/10 text-red-400 ring-1 ring-red-500/20";

      default:
        return "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20";
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <p className="text-orange-500">
          Loading...
        </p>
      </div>
    );
  }


  if (
    !user ||
    user.role !== "admin"
  ) {
    return null;
  }


  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-8">

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="mb-2 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 ring-1 ring-orange-500/20">
                <span className="text-xl">
                  ↩️
                </span>
              </div>

              <div>

                <p className="text-sm font-medium text-orange-500">
                  GoFlex Admin
                </p>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Return Requests
                </h1>

              </div>

            </div>

            <p className="mt-3 text-zinc-400">
              Review and manage customer return requests.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/admin")
            }
            className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-orange-500 hover:text-orange-500"
          >
            ← Dashboard
          </button>

        </div>

        {/* STATS */}

        <div className="mb-8 grid gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-500">
              Total Requests
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {returnRequests.length}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-400">
              {
                returnRequests.filter(
                  (item) =>
                    item.status ===
                    "pending"
                ).length
              }
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-500">
              Approved
            </p>

            <p className="mt-2 text-3xl font-bold text-green-400">
              {
                returnRequests.filter(
                  (item) =>
                    item.status ===
                    "approved"
                ).length
              }
            </p>
          </div>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="space-y-5">

            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="h-72 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900"
                />
              )
            )}

          </div>

        ) : returnRequests.length === 0 ? (

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-12 text-center">

            <div className="mb-4 text-5xl">
              ↩️
            </div>

            <h2 className="text-xl font-bold text-white">
              No Return Requests
            </h2>

            <p className="mt-2 text-zinc-500">
              There are currently no customer return requests.
            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {returnRequests.map(
              (request) => (

                <div
                  key={request._id}
                  className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl"
                >

                  {/* CARD HEADER */}

                  <div className="flex flex-col gap-4 border-b border-zinc-800 p-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <p className="text-xs uppercase tracking-wider text-zinc-500">
                        Return Request
                      </p>

                      <p className="mt-1 break-all font-mono text-sm text-zinc-300">
                        {request._id}
                      </p>

                    </div>

                    <span
                      className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusClass(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>

                  </div>

                  {/* CARD BODY */}

                  <div className="grid gap-6 p-5 lg:grid-cols-3">

                    {/* CUSTOMER */}

                    <div>

                      <h3 className="mb-3 text-sm font-semibold text-orange-500">
                        Customer
                      </h3>

                      <div className="space-y-2 text-sm">

                        <p>
                          <span className="text-zinc-500">
                            Name:
                          </span>{" "}
                          <span className="text-zinc-200">
                            {request.user?.name ||
                              "N/A"}
                          </span>
                        </p>

                        <p className="break-all">
                          <span className="text-zinc-500">
                            Email:
                          </span>{" "}
                          <span className="text-zinc-200">
                            {request.user?.email ||
                              "N/A"}
                          </span>
                        </p>

                      </div>

                    </div>

                    {/* ORDER / PRODUCT */}

                    <div>

                      <h3 className="mb-3 text-sm font-semibold text-orange-500">
                        Order & Product
                      </h3>

                      <div className="space-y-3 text-sm">

                        <div>

                          <p className="text-zinc-500">
                            Order ID
                          </p>

                          <p className="mt-1 break-all font-mono text-xs text-zinc-300">
                            {request.order?._id ||
                              request.order ||
                              "N/A"}
                          </p>

                        </div>

                        <div className="flex items-center gap-3">

                          {request.product
                            ?.image && (
                              <img
                                src={
                                  request.product
                                    .image
                                }
                                alt={
                                  request.product
                                    .name ||
                                  "Product"
                                }
                                className="h-14 w-14 rounded-lg object-cover"
                              />
                            )}

                          <div>

                            <p className="font-medium text-zinc-200">
                              {request.product
                                ?.name ||
                                "Product unavailable"}
                            </p>

                            {request.product
                              ?.price !==
                              undefined && (
                                <p className="mt-1 text-sm text-zinc-500">
                                  ৳
                                  {
                                    request
                                      .product
                                      .price
                                  }
                                </p>
                              )}

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* REQUEST INFO */}

                    <div>

                      <h3 className="mb-3 text-sm font-semibold text-orange-500">
                        Request Information
                      </h3>

                      <div className="space-y-2 text-sm">

                        <p className="text-zinc-500">
                          Reason:
                        </p>

                        <p className="rounded-lg bg-zinc-950 p-3 text-zinc-300">
                          {request.reason}
                        </p>

                        <p>
                          <span className="text-zinc-500">
                            Submitted:
                          </span>{" "}
                          <span className="text-zinc-300">
                            {formatDate(
                              request.createdAt
                            )}
                          </span>
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* MESSAGE */}

                  {request.message && (
                    <div className="mx-5 mb-5 rounded-xl border border-zinc-800 bg-zinc-950 p-4">

                      <p className="mb-2 text-sm font-semibold text-zinc-400">
                        Customer Message
                      </p>

                      <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-300">
                        {request.message}
                      </p>

                    </div>
                  )}

                  {/* ACTIONS */}

                  {request.status ===
                    "pending" && (

                      <div className="flex flex-col gap-3 border-t border-zinc-800 bg-zinc-950/50 p-5 sm:flex-row sm:justify-end">

                        <button
                          type="button"
                          disabled={
                            updatingId ===
                            request._id
                          }
                          onClick={() =>
                            updateStatus(
                              request._id,
                              "rejected"
                            )
                          }
                          className="cursor-pointer rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 transition hover:border-red-500 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingId ===
                            request._id
                            ? "Updating..."
                            : "Reject Return"}
                        </button>

                        <button
                          type="button"
                          disabled={
                            updatingId ===
                            request._id
                          }
                          onClick={() =>
                            updateStatus(
                              request._id,
                              "approved"
                            )
                          }
                          className="cursor-pointer rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingId ===
                            request._id
                            ? "Updating..."
                            : "Approve Return"}
                        </button>

                      </div>

                    )}

                </div>

              )
            )}

          </div>

        )}

      </div>
    </div>
  );
};

export default AdminReturnRequests;
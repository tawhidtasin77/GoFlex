import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { api } from "../api/api";

const AdminUsers = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);

        const response = await api.get("/users/getUsers");

        const userData = response.data.data;

        setUsers(Array.isArray(userData) ? userData : []);
      } catch (error) {
        console.error("Failed to fetch users:", error);

        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-orange-500" />

          <p className="text-sm text-zinc-500">
            Loading users...
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

        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="cursor-pointer mb-5 text-sm font-medium text-zinc-400 transition hover:text-orange-500"
          >
            ← Back to Dashboard
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-2xl ring-1 ring-orange-500/20">
              👥
            </div>

            <div>
              <p className="text-sm font-medium text-orange-500">
                GoFlex Admin
              </p>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                User Directory
              </h1>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-zinc-500">
            View all registered GoFlex users and their account
            information.
          </p>
        </div>

        {/* Users Card */}
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/20">

          {/* Card Header */}
          <div className="flex flex-col gap-3 border-b border-zinc-800 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-white">
                Registered Users
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                {users.length}{" "}
                {users.length === 1 ? "user" : "users"} registered
              </p>
            </div>

            <div className="rounded-lg bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-500 ring-1 ring-orange-500/20">
              {users.length} Users
            </div>
          </div>

          {/* Empty State */}
          {users.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-3xl">
                👤
              </div>

              <h3 className="text-lg font-semibold text-white">
                No Users Found
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                There are currently no registered users in your
                GoFlex database.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px]">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-zinc-500">
                      USER
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-zinc-500">
                      EMAIL
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-zinc-500">
                      ROLE
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-zinc-500">
                      STATUS
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-zinc-500">
                      JOINED
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((currentUser) => {
                    const isAdmin = currentUser.role === "admin";

                    return (
                      <tr
                        key={currentUser._id}
                        className="border-b border-zinc-800 transition hover:bg-zinc-800/30"
                      >
                        {/* User */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">

                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                isAdmin
                                  ? "bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20"
                                  : "bg-zinc-800 text-zinc-300"
                              }`}
                            >
                              {currentUser.name
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-white">
                                {currentUser.name}
                              </p>

                              <p className="mt-1 font-mono text-xs text-zinc-600">
                                #{currentUser._id.substring(0, 8)}
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-5">
                          <span className="text-sm text-zinc-300">
                            {currentUser.email}
                          </span>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ring-1 ${
                              isAdmin
                                ? "bg-orange-500/10 text-orange-500 ring-orange-500/20"
                                : "bg-green-500/10 text-green-400 ring-green-500/20"
                            }`}
                          >
                            {currentUser.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          {currentUser.isVerified ? (
                            <span className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400 ring-1 ring-green-500/20">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400 ring-1 ring-yellow-500/20">
                              <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                              Unverified
                            </span>
                          )}
                        </td>

                        {/* Joined */}
                        <td className="px-6 py-5">
                          <div>
                            <p className="text-sm text-zinc-300">
                              {new Date(
                                currentUser.createdAt
                              ).toLocaleDateString()}
                            </p>

                            <p className="mt-1 text-xs text-zinc-600">
                              {new Date(
                                currentUser.createdAt
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        {users.length > 0 && (
          <div className="mt-5 flex items-center gap-2 text-xs text-zinc-600">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            User information is protected and visible only to administrators.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
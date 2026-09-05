import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api/api";
import Toast from "../components/Toast";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/users/login", {
        email: formData.email,
        password: formData.password,
      });

      const loginData = response.data.data;

      login(
        loginData.user,
        loginData.accessToken,
        loginData.refreshToken
      );

      setToast({
        type: "success",
        message:
          "Welcome back! You have successfully logged in.",
      });

      setTimeout(() => {
        navigate("/");
      }, 3400);
    } catch (error) {
      console.error("Login error:", error);

      const message =
        error.response?.data?.message ||
        "We couldn't log you in. Please check your email and password.";

      setToast({
        type: "error",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10">

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}

      <div className="w-full max-w-md">

        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold text-white">
            Go<span className="text-orange-500">Flex</span>
          </h1>

          <p className="mt-3 text-zinc-400">
            Welcome back! Login to your account.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl sm:p-8"
        >

          <h2 className="mb-6 text-2xl font-semibold text-white">
            Login
          </h2>

          {/* Email */}

          <div className="mb-5">

            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />

          </div>

          {/* Password */}

          <div className="mb-6">

            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-6 text-center text-sm text-zinc-400">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-medium text-orange-500 transition hover:text-orange-400"
            >
              Register
            </Link>

          </p>

        </form>

      </div>
    </div>
  );
};

export default Login;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

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

      const response = await api.post("/users/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      alert(
        response.data.message ||
          "Registration successful. Please verify your email with the OTP."
      );

      navigate("/verify-otp", {
        state: {
          email: formData.email,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);

      const message =
        error.response?.data?.message ||
        "Something went wrong while creating your account.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10">

      <div className="w-full max-w-md">

        {/* Logo / Heading */}

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white">
            Go<span className="text-orange-500">Flex</span>
          </h1>

          <p className="mt-3 text-zinc-400">
            Create your GoFlex account.
          </p>
        </div>


        {/* Register Card */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl sm:p-8"
        >

          <h2 className="mb-6 text-2xl font-semibold text-white">
            Create Account
          </h2>


          {/* Name */}

          <div className="mb-5">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              autoComplete="name"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>


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
              placeholder="Create a password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>


          {/* Register Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>


          {/* Login */}

          <p className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{" "}

            <Link
              to="/login"
              className="font-medium text-orange-500 transition hover:text-orange-400"
            >
              Login
            </Link>
          </p>

        </form>

      </div>

    </div>
  );
};

export default Register;
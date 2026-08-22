import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api/api";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Email information is missing. Please register again.");
      navigate("/register");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/users/verify-otp", {
        email,
        otp,
      });

      const userData = response.data.data;

      if (userData?.user) {
        login(userData.user);
      }

      alert(
        response.data.message ||
          "Email verified successfully."
      );

      navigate("/");
    } catch (error) {
      console.error("OTP verification error:", error);

      const message =
        error.response?.data?.message ||
        "Invalid or expired OTP.";

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
            Verify your email address.
          </p>

        </div>


        {/* OTP Card */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl sm:p-8"
        >

          <h2 className="mb-3 text-2xl font-semibold text-white">
            Verify OTP
          </h2>

          <p className="mb-6 text-sm leading-6 text-zinc-400">
            We sent a verification code to:
          </p>

          <p className="mb-6 break-all font-medium text-orange-500">
            {email || "No email provided"}
          </p>


          {/* OTP */}

          <div className="mb-6">

            <label
              htmlFor="otp"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Enter OTP
            </label>

            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              placeholder="Enter 6-digit OTP"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-center text-xl tracking-[0.5em] text-white outline-none placeholder:text-zinc-500 placeholder:tracking-normal focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />

          </div>


          {/* Verify Button */}

          <button
            type="submit"
            disabled={loading || otp.length !== 6 || !email}
            className="w-full rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>


          {/* Back to Register */}

          <p className="mt-6 text-center text-sm text-zinc-400">

            Didn't register correctly?{" "}

            <Link
              to="/register"
              className="font-medium text-orange-500 transition hover:text-orange-400"
            >
              Register Again
            </Link>

          </p>

        </form>

      </div>

    </div>
  );
};

export default VerifyOTP;
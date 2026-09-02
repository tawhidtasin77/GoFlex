import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router";

import { AuthContext } from "../context/AuthContext";
import { api } from "../api/api";
import Toast from "../components/Toast";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState(
    location.state?.email ||
      sessionStorage.getItem(
        "verificationEmail"
      ) ||
      ""
  );

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (location.state?.email) {
      sessionStorage.setItem(
        "verificationEmail",
        location.state.email
      );

      setEmail(location.state.email);
    }
  }, [location.state]);

  useEffect(() => {
    if (!email) {
      navigate("/register", {
        replace: true,
      });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setToast({
        type: "warning",
        message:
          "Email information is missing. Please register again.",
      });

      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/users/verify-otp",
        {
          email,
          otp,
        }
      );

      const verifiedUser =
        response.data.data.user;

      login(verifiedUser);

      sessionStorage.removeItem(
        "verificationEmail"
      );

      setToast({
        type: "success",
        message:
          response.data.message ||
          "Email verified successfully! Welcome to GoFlex.",
      });

      setTimeout(() => {
        navigate("/", {
          replace: true,
        });
      }, 1500);
    } catch (error) {
      console.error(
        "OTP verification error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "That verification code is invalid or expired. Please try again.";

      setToast({
        type: "error",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (
      !email ||
      cooldown > 0 ||
      resending
    ) {
      return;
    }

    try {
      setResending(true);

      const response = await api.post(
        "/users/resend-otp",
        {
          email,
        }
      );

      setToast({
        type: "success",
        message:
          response.data.message ||
          "A new OTP has been sent to your email.",
      });

      setCooldown(60);
      setOtp("");
    } catch (error) {
      console.error(
        "Resend OTP error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Failed to resend OTP. Please try again.";

      setToast({
        type: "error",
        message,
      });
    } finally {
      setResending(false);
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
            Go
            <span className="text-orange-500">
              Flex
            </span>
          </h1>

          <p className="mt-3 text-zinc-400">
            Verify your email address.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl sm:p-8"
        >
          <h2 className="mb-3 text-2xl font-semibold text-white">
            Verify OTP
          </h2>

          <p className="mb-2 text-sm leading-6 text-zinc-400">
            We sent a verification code to:
          </p>

          <p className="mb-6 break-all font-medium text-orange-500">
            {email}
          </p>

          <div className="mb-4">
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
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value.replace(
                    /\D/g,
                    ""
                  )
                )
              }
              placeholder="Enter 6-digit OTP"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-center text-xl tracking-[0.5em] text-white outline-none placeholder:text-zinc-500 placeholder:tracking-normal focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="mb-6 text-center">
            {cooldown > 0 ? (
              <p className="text-sm text-zinc-500">
                Resend OTP in{" "}
                <span className="font-medium text-orange-500">
                  {cooldown}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resending}
                className="cursor-pointer text-sm font-medium text-orange-500 transition hover:text-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {resending
                  ? "Sending OTP..."
                  : "Resend OTP"}
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              otp.length !== 6 ||
              !email
            }
            className="w-full cursor-pointer rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Verifying..."
              : "Verify Email"}
          </button>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Didn't register correctly?{" "}
            <Link
              to="/register"
              className="cursor-pointer font-medium text-orange-500 transition hover:text-orange-400"
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
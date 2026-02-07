"use client";

import axios from "axios";
import React, { useState } from "react";
import { FaUserShield } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [forgotProssessing, setForgotProssessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  // ✅ Validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
      );
      return;
    }

    setProcessing(true);

    try {
      const response = await axios.post(
        "https://student-backend-saas.vercel.app/api/v1/admin/login",
        { email, password }
      );

      toast.success(response.data.message || "Login successful 🎉");
      toast.info("Verifying your account... ⏳");

      router.push(`/email/verify/${email}`);

      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed ❌");
    } finally {
      setProcessing(false);
    }
  }

  const handleForgotPasssword = async () => {
    setForgotProssessing(true);

    try {
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      const response = await axios.get(
        `https://student-backend-saas.vercel.app/api/v1/admin/forgot/${email}`
      );

      toast.success(response.data.message);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong ❌");
    } finally {
      setForgotProssessing(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      <div className="w-full max-w-md rounded-2xl bg-white/80 dark:bg-gray-900/80 shadow-2xl border border-gray-200 dark:border-gray-800 p-8 backdrop-blur-md">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shadow-md">
            <FaUserShield className="w-8 h-8" />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Codeflame Technology
          </h1>

          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Admin Login Panel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>

            <input
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="mt-2 block w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition sm:text-sm"
              placeholder="admin@gmail.com"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Password
            </label>

            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 pr-12 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition sm:text-sm"
                placeholder="Enter your password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              disabled={forgotProssessing}
              onClick={handleForgotPasssword}
              className={`text-sm font-semibold transition
                ${
                  forgotProssessing
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:underline dark:text-blue-400"
                }`}
            >
              {forgotProssessing ? "Sending..." : "Forgot password?"}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={processing}
            className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition
              ${
                processing
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {processing && (
              <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
            )}
            {processing ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          © {new Date().getFullYear()} Codeflame Technology. All rights reserved.
        </p>
      </div>
    </div>
  );
}

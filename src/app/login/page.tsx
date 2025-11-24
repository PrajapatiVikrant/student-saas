"use client";

import axios from "axios";
import React, { useState } from "react";
import { FaUserShield } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"; // ✅ correct import
import CircularIndeterminate from "../components/ui/CircularIndeterminate";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [forgotProssessing, setForgotProssessing] = useState(false);
  const router = useRouter(); // ✅ correct usage

  // ✅ Validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    // 🔹 Client-side validations
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
        "http://localhost:4000/api/v1/admin/login",
        { email, password }
      );
      console.log(response);
      toast.success(response.data.message || "Login successful 🎉");
      toast.info("Verifying your account... ⏳");

      // ✅ navigate properly
      router.push(`/email/verify/${email}`);

      // reset
      setEmail("");
      setPassword("");
      setProcessing(false);

    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed ❌");
    } finally {
      setProcessing(false)
    }
  }


  const handleForgotPasssword = async () => {
    setForgotProssessing(true);
    try {
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }
      const response = await axios.get(`http://localhost:4000/api/v1/admin/forgot/${email}`)
      toast.success(response.data.message)
    } catch (error: any) {
      console.log(error)
      toast.error(error.message);
    } finally {
      setForgotProssessing(false)
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-8">
        {/* Logo / Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
            <FaUserShield className="w-7 h-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            EduConnect Admin
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Sign in to manage your institute
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              disabled={forgotProssessing}
              onClick={handleForgotPasssword}
              className={`text-sm font-medium 
      ${forgotProssessing ? "text-gray-400 cursor-not-allowed" : "text-primary hover:underline"}
    `}
            >
              Forgot password?
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={processing}
              className={`group relative flex items-center gap-1.5 w-full justify-center rounded-lg ${processing ? "bg-blue-300" : "bg-blue-600"}  hover:bg-blue-300 cursor-pointer px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
            >
              {processing ? <CircularIndeterminate size={20} /> : ""} <span>Login</span>

            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

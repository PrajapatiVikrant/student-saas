"use client";

import axios from "axios";
import React, { useState } from "react";
import { FaUserShield } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"; // ✅ correct import



export default function Login() {
  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [forgotProssessing, setForgotProssessing] = useState(false);
  const router = useRouter(); // ✅ correct usage

  // ✅ Validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    // 🔹 Client-side validations
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
  
    setProcessing(true);
    try {
      const response = await axios.post(
        "/api/v1/teacher/login",
        { email }
      );
      console.log(response);
      toast.success(response.data.message || "OTP sent successful 🎉");
      toast.info("Verifying your account... ⏳");

      // ✅ navigate properly
      router.push(`/teacher/otp/verify/${email}`);

      // reset
      setEmail("");
     
      setProcessing(false);

    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed ❌");
    } finally {
      setProcessing(false)
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
            EduConnect Teacher
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Sign in to manage your class
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
            <button
              type="submit"
              disabled={processing}
              className={`group relative flex items-center gap-1.5 w-full justify-center rounded-lg ${processing ? "bg-blue-300" : "bg-blue-600"}  hover:bg-blue-300 cursor-pointer px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
            >
              {processing ? "Sending OTP": "Send OTP"} 

            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
}

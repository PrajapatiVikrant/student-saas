"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { FaUnlockAlt } from "react-icons/fa";
import CircularIndeterminate from "@/app/components/ui/CircularIndeterminate";

export default function ResetPassword({ params }: any) {
  const { reset_token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [processing, setProcessing] = useState(false);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be 8+ chars with uppercase, lowercase, number & special symbol"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setProcessing(true);

    try {
      const res = await axios.put(
        "/api/v1/admin/reset-password",
        { resetToken:reset_token, newPassword:password }
      );

      toast.success(res.data.message || "Password updated successfully 🎉");

      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Reset failed ❌");
    }

    setProcessing(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
            <FaUnlockAlt className="w-7 h-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Reset Password
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Enter your new password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleReset} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Enter new password"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          {/* Button */}
          <div>
            <button
              type="submit"
              disabled={processing}
              className={`group relative flex items-center gap-1.5 w-full justify-center rounded-lg ${
                processing ? "bg-blue-300" : "bg-blue-600"
              } px-4 py-3 text-sm font-medium text-white hover:bg-blue-500 transition`}
            >
              {processing ? <CircularIndeterminate size={20} /> : ""}
              <span>Reset Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

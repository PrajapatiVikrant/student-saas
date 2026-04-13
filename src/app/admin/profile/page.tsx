"use client";

import axios from "axios";
import { useEffect, useState } from "react";

interface Admin {
  name: string;
  email: string;
  phone: string;
}

export default function Profile() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminProfile = async () => {
    const token = localStorage.getItem("codeflam01_token");

    try {
      const response = await axios.get(
        "https://codeflame-edu-backend.xyz/api/v1/admin",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 👇 adjust according to your API response
      setAdmin(response.data);
    } catch (error) {
      console.error("Error fetching admin profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-300">Loading Profile...</p>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-white">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">

        <h1 className="text-2xl font-bold mb-6">Admin Profile</h1>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-xl p-6 space-y-4">

          {/* Name */}
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-lg font-semibold">{admin.name}</p>
          </div>

          {/* Email */}
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-semibold">{admin.email}</p>
          </div>

          {/* Phone */}
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-lg font-semibold">{admin.phone}</p>
          </div>

        </div>
      </div>
    </div>
  );
}
"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";

export default function ClassPage() {
  const { class_id } = useParams();
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("codeflam01_token")
      : null;
  const router = useRouter();

  useEffect(() => {
    fetchClassData();
  }, []);

  async function fetchClassData() {
    setLoading(true);
    try {
      if (!token) {
        router.push("/teacher/login");
        return;
      }

      const response = await axios.get(
        `https://student-backend-saas.vercel.app/api/v1/teacher/classes/${class_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setClassData(response.data);
    } catch (error: any) {
      const status = error?.response?.status;
      console.log("Error fetching class data:", error);
      if (status === 401 || status === 403) {
        toast.error("Session expired. Please login again ❌");
        router.push("/teacher/login");
        return;
      }

      toast.error("Failed to fetch class data ❌");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          {classData?.class?.name || "Class Details"}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage batches and view students
        </p>
      </div>

      {/* Content Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Batches
        </h2>

        {/* Loading State */}
        {loading && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading batches...
          </p>
        )}

        {/* Empty State */}
        {!loading && classData?.class?.batches?.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No batches found for this class
          </p>
        )}

        {/* Batch List */}
        <div className="space-y-4">
          {classData?.class?.batches?.map((batch: any) => (
            <div
              key={batch._id}
              className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition bg-gray-50 dark:bg-gray-700"
            >
              <div>
                <p className="font-medium text-gray-800 dark:text-white">
                  {batch.batch_name}
                </p>
              </div>

              <button
                onClick={() =>
                  router.push(`/teacher/class/${class_id}/${batch._id}`)
                }
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-600 text-blue-600 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-700 transition text-sm font-medium"
              >
                <FaEye />
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

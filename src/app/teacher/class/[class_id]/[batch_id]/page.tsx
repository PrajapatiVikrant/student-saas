"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";

export default function ClassPage() {
  const { class_id,batch_id } = useParams();
  const [students, setStudents] = useState<any>({});
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
        `http://localhost:4000/api/v1/teacher/classes/${class_id}/batches/${batch_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Students Data:", response.data);
      setStudents(response.data);
    } catch (error: any) {
        console.log("Error fetching students:", error);
      const status = error?.response?.status;

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
    <div className="min-h-screen bg-gray-50 dark:bg-background-dark p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {`${students?.class_name} (${students?.batch_name})` || "Class Batch Details"}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage batches and view students
        </p>
      </div>

      {/* Content Card */}
      <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Batches
        </h2>

        {/* Loading State */}
        {loading && (
          <p className="text-center text-gray-500">Loading students...</p>
        )}

        {/* Empty State */}
        {!loading && students.students.length == 0 && (
          <p className="text-center text-gray-500">
            No batches found for this class
          </p>
        )}

        {/* Batch List */}
        <div className="space-y-4">
          {students?.students?.map((s: any) => (
            <div
              key={s._id}
              className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition"
            >
              <div>
                <p className="font-medium text-gray-800 dark:text-white">
                  {s.name}
                </p>
              
              </div>

              <button
                onClick={() =>
                  router.push(
                    `/teacher/class/student/${s._id}/performance`
                  )
                }
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-sm font-medium"
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

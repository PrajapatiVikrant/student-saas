"use client";

import StudentDetail from "@/app/teacher/components/StudentDetail";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function PerformancePage() {
  const { student_id } = useParams();
  const router = useRouter();

  const [student, setStudent] = useState<any>({});
  const [token, setToken] = useState<string | null>(null);
  const [examData, setExamData] = useState<any[]>([]);
  const [loadingExam, setLoadingExam] = useState(false);

  /* 🔐 Read token */
  useEffect(() => {
    const storedToken = localStorage.getItem("codeflam01_token");
    if (!storedToken) {
      toast.error("Session expired. Please login again.");
      router.push("/login");
      return;
    }
    setToken(storedToken);
  }, [router]);

  /* 📡 Fetch data */
  useEffect(() => {
    if (token && student_id) {
      getExamData();
    }
  }, [token, student_id]);

  async function getExamData() {
    try {
      setLoadingExam(true);

      const res = await axios.get(
        `/api/v1/test/${student_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fetched =
        res.data.data?.map((test: any) => ({
          id: test._id,
          exam: test.test_name,
          subject: {
            _id: test.subject?.id,
            name: test.subject?.name,
          },
          score: Number(test.score.obt_marks),
          feedback: test.feedback,
          added_by: test.added_by,
        })) || [];
      console.log("Fetched Exam Data:", fetched);
      setExamData(fetched);
    } catch (error: any) {
      console.log("Error fetching exam data:", error);
      handleAuthError(error);
    } finally {
      setLoadingExam(false);
    }
  }

  /* 📊 Group data subject-wise (SAFE) */
  const groupedData = useMemo(() => Object.values(
  examData.reduce((acc, item) => {
    const subjectId = item.subject._id;

    if (!acc[subjectId]) {
      acc[subjectId] = {
        subject: {
          _id: item.subject._id,
          name: item.subject.name,
        },
        exams: [],
      };
    }

    acc[subjectId].exams.push({
      id: item.id,
      exam: item.exam,
      score: item.score,
      feedback: item.feedback,
      added_by: item.added_by,
    });

    return acc;
  }, {})
), [examData]);


  function handleAuthError(error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("teacherToken");
      router.push("/login");
    } else {
      toast.error("Failed to fetch performance data.");
    }
  }

  return (
   <div className="px-4 sm:px-6 md:px-8 min-h-screen bg-gray-50 dark:bg-gray-900">
  {/* Student Detail */}
  <StudentDetail id={student_id} student={student} setStudent={setStudent} />

  {/* Tabs */}
  <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
    <div className="flex gap-4 sm:gap-8 px-2 sm:px-4 overflow-x-auto">
      <Link
        href={`/teacher/class/student/${student_id}/performance`}
        className="border-b-2 border-blue-600 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400"
      >
        Performance
      </Link>

      <Link
        href={`/teacher/class/student/${student_id}/reportForm`}
        className="py-3 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
      >
        Add Report
      </Link>

      <Link
        href={`/teacher/class/student/${student_id}/attendance`}
        className="py-3 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
      >
        Attendance
      </Link>
    </div>
  </div>

  {/* Charts */}
  <div className="mt-6 space-y-10">
    {loadingExam ? (
      <p className="text-center text-gray-500 dark:text-gray-400">Loading test data...</p>
    ) : Object.keys(groupedData).length === 0 ? (
      <p className="text-center text-gray-500 dark:text-gray-400">
        No performance data available
      </p>
    ) : (
      Object.entries(groupedData).map(([subjectId, data]: any) => (
        <div key={subjectId}>
          <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">
            {data.subject.name} Performance
          </h3>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md transition-colors">
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.exams}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" darkStroke="#374151" />
                  <XAxis
                    dataKey="exam"
                    stroke="#374151"
                    darkStroke="#d1d5db"
                    tick={{ fill: "#374151" }}
                  />
                  <YAxis stroke="#374151" tick={{ fill: "#374151" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
                    itemStyle={{ color: "#111827" }}
                  />
                  <Legend wrapperStyle={{ color: "#111827" }} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#16a34a"
                    strokeWidth={3}
                    name="Score"
                  />
                  <Line
                    type="monotone"
                    dataKey="added_by.name"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Added By"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
  <br /><br />
</div>

  );
}

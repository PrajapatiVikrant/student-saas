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
        `http://localhost:4000/api/v1/test/${student_id}`,
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
    <div className="px-6 min-h-screen">
      <StudentDetail
        id={student_id}
        student={student}
        setStudent={setStudent}
      />

      {/* Tabs */}
      <div className="mt-6 border-b border-slate-200">
        <div className="flex gap-8 px-4">
          <Link
            href={`/teacher/class/student/${student_id}/performance`}
            className="border-b-2 border-blue-600 py-3 text-sm font-semibold text-blue-600"
          >
            Performance
          </Link>

          <Link
            href={`/teacher/class/student/${student_id}/reportForm`}
            className="py-3 text-sm text-slate-500"
          >
            Add Report
          </Link>

          <Link
            href={`/teacher/class/student/${student_id}/attendance`}
            className="py-3 text-sm text-slate-500"
          >
            Attendance
          </Link>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-6 space-y-10">
        {loadingExam ? (
          <p className="text-center text-gray-500">Loading test data...</p>
        ) : Object.keys(groupedData).length === 0 ? (
          <p className="text-center text-gray-500">
            No performance data available
          </p>
        ) : (
          Object.entries(groupedData).map(
            ([subjectId, data]: any) => (
              <div key={subjectId}>
                <h3 className="text-lg font-semibold text-green-600 mb-3">
                  {data.subject.name} Performance
                </h3>

                <div className="bg-gray-50 p-4 rounded-xl shadow-md">
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.exams}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="exam" />
                        <YAxis domain={[0, 100]} />
                       
                        <Tooltip />
                        <Legend />
                        
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
                          stroke="#16a34a"
                          strokeWidth={3}
                          name="Added By"
                        />
                       
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

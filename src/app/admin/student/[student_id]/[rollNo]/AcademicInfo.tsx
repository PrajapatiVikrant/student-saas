"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useMemo, useEffect } from "react";
import { FaPencil } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
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
  BarChart,
  Bar,
} from "recharts";

type AcademicProps = {
  student: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    admissionDate: string;
    gender: string;
    class_name: string;
    classId: string;
    batch_name: string;
    batchId: string;
  };
};

export default function AcademicInfo({ student }: AcademicProps) {
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("codeflam01_token") : null;

  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [examData, setExamData] = useState<any[]>([]);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [loadingExam, setLoadingExam] = useState(true);
  const [newExam, setNewExam] = useState({
    exam: "",
    subject: "",
    score: "",
    feedback: "",
  });
  const [editId, setEditId] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getAttendance();
    getExamData();
  }, []);

  async function getAttendance() {
    try {
      setLoadingAttendance(true);
      const res = await axios.get(
        `http://localhost:4000/api/v1/attendance/student/${student.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttendanceData(res.data || []);
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoadingAttendance(false);
    }
  }

  async function getExamData() {
    try {
      setLoadingExam(true);
      const res = await axios.get(
        `http://localhost:4000/api/v1/test/${student.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
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
        console.log(fetched)

      setExamData(fetched);
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoadingExam(false);
    }
  }

  function handleAuthError(error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("codeflam01_token");
      router.push("/login");
    } else {
      toast.error("Failed to fetch data.");
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

  
 

  

  return (
    <div className="space-y-10 p-4 sm:p-8">
      <h2 className="text-xl  md:text-2xl font-bold border-b pb-2 text-gray-800 text-center sm:text-left">
        Academic Information
      </h2>

      {/* 📅 Attendance Section */}
      <div>
        <h3 className="text-lg font-semibold text-blue-600 mb-3">
          Monthly Attendance Report
        </h3>
        {loadingAttendance ? (
          <p className="text-center text-gray-500">Loading attendance...</p>
        ) : attendanceData.length === 0 ? (
          <p className="text-center text-gray-500">
            No attendance data available
          </p>
        ) : (
          <div className="bg-gray-50 p-4 rounded-xl shadow-md w-full overflow-hidden">
            <div className="w-full h-[250px] sm:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <br />
                  <br />
                  <Bar dataKey="total" fill="#9ca3af" name="Total Classes" />
                  <Bar
                    dataKey="attended"
                    fill="#3b82f6"
                    name="Attended Classes"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
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

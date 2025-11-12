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
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

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
          subject: test.subject,
          score: test.score.obt_marks,
          feedback: test.feedback,
        })) || [];

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
      localStorage.removeItem("adminToken");
      router.push("/login");
    } else {
      toast.error("Failed to fetch data.");
    }
  }

  const groupedData = useMemo(() => {
    const map: Record<string, any[]> = {};
    examData.forEach((item) => {
      if (!map[item.subject]) map[item.subject] = [];
      map[item.subject].push({
        exam: item.exam,
        score: Number(item.score),
      });
    });
    return map;
  }, [examData]);

  const handleAddOrUpdate = async () => {
    if (!newExam.exam || !newExam.subject || !newExam.score)
      return toast.error("Please fill all required fields");

    const testData = {
      student: {
        student_id: student.id,
        student_name: student.name,
      },
      class_id: student.classId,
      batch_id: student.batchId,
      test_name: newExam.exam,
      subject: newExam.subject,
      score: { max_marks: 100, obt_marks: Number(newExam.score) },
      feedback: newExam.feedback || "No feedback",
    };

    try {
      if (editId) {
        await axios.put(
          `http://localhost:4000/api/v1/test/${editId}`,
          testData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Record updated successfully");
      } else {
        await axios.post(`http://localhost:4000/api/v1/test`, testData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Record added successfully");
      }

      setNewExam({ exam: "", subject: "", score: "", feedback: "" });
      setEditId("");
      setShowForm(false);
      getExamData();
    } catch {
      toast.error("Failed to submit record");
    }
  };

  const handleEdit = (id: string) => {
    const record = examData.find((t) => t.id === id);
    if (!record) return;
    setNewExam({
      exam: record.exam,
      subject: record.subject,
      score: String(record.score),
      feedback: record.feedback,
    });
    setEditId(id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/v1/test/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Record deleted successfully");
      getExamData();
    } catch {
      toast.error("Failed to delete record");
    }
  };

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

      {/* 📈 Subject-wise Charts */}
      <div className="space-y-10">
        {loadingExam ? (
          <p className="text-center text-gray-500">Loading test data...</p>
        ) : Object.keys(groupedData).length === 0 ? (
          <p className="text-center text-gray-500">No test data available</p>
        ) : (
          Object.keys(groupedData).map((subject) => (
            <div key={subject}>
              <h3 className="text-lg font-semibold text-green-600 mb-3">
                {subject} Performance
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl shadow-md w-full overflow-hidden">
                <div className="w-full h-[250px] sm:h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={groupedData[subject]}>
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
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 📄 Test Record Table */}
      <div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
          <h3 className="text-lg font-semibold text-purple-600 text-center sm:text-left">
            All Test Records
          </h3>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm sm:text-base w-full sm:w-auto"
          >
            ➕ Add New Record
          </button>
        </div>

        {loadingExam ? (
          <p className="text-center text-gray-500">Loading test records...</p>
        ) : examData.length === 0 ? (
          <p className="text-center text-gray-500">No test records available</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="w-full border border-gray-200 text-xs sm:text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-2 border">Exam</th>
                  <th className="p-2 border">Subject</th>
                  <th className="p-2 border">Score</th>
                  <th className="p-2 border w-[300px]">Feedback</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {examData.map((e) => (
                  <tr
                    key={e.id}
                    className="text-center border-t hover:bg-gray-50 transition-all"
                  >
                    <td className="p-2 border break-words">{e.exam}</td>
                    <td className="p-2 border break-words">{e.subject}</td>
                    <td className="p-2 border font-semibold text-green-600">
                      {e.score}/100
                    </td>
                    <td className="p-2 border text-left w-[300px]">
                      <pre>

                      {e.feedback}
                      </pre>
                    </td>
                    <td className="p-2 border">
                      <div className="flex flex-row justify-center items-center gap-2">
                        <button
                          onClick={() => handleEdit(e.id)}
                          className="p-1  text-gray rounded-lg  cursor-pointer  text-xs  "
                        >
                         <FaPencil/>
                        </button>
                        <button
                          onClick={() => handleDelete(e.id)}
                          className="p-1  text-gray rounded-lg cursor-pointer  text-xs "
                        >
                         <FaRegTrashAlt/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🧾 Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
            <h4 className="font-semibold mb-4 text-gray-700 text-lg">
              {editId ? "Edit Test Record" : "Add Test Record"}
            </h4>

            <div className="grid gap-3">
              <input
                type="text"
                placeholder="Exam Name"
                value={newExam.exam}
                onChange={(e) =>
                  setNewExam({ ...newExam, exam: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="Subject"
                value={newExam.subject}
                onChange={(e) =>
                  setNewExam({ ...newExam, subject: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="number"
                placeholder="Score (0–100)"
                value={newExam.score}
                onChange={(e) =>
                  setNewExam({ ...newExam, score: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <textarea
                placeholder="Feedback (optional)"
                value={newExam.feedback}
                onChange={(e) =>
                  setNewExam({ ...newExam, feedback: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={handleAddOrUpdate}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm sm:text-base"
              >
                {editId ? "Update Record" : "Add Record"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setNewExam({ exam: "", subject: "", score: "", feedback: "" });
                  setEditId("");
                }}
                className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600 transition-all text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

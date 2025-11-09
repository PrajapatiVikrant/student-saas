"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useMemo, useEffect } from "react";
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
type acadimicProps = {
  student_id: string;
}

export default function AcademicInfo({ student_id }: acadimicProps) {

  const router = useRouter();

  // 📅 Attendance data
  const [attendanceData, setAttendanceData] = useState([]);

  // 🧠 Test/exam data
  const [examData, setExamData] = useState([
    { exam: "Unit Test 1", subject: "Maths", score: 75, feedback: "Revise formulas daily" },
    { exam: "Unit Test 2", subject: "Maths", score: 80, feedback: "Practice more problems" },
    { exam: "Mid Term", subject: "Physics", score: 70, feedback: "Focus on derivations" },
    { exam: "Unit Test 3", subject: "Chemistry", score: 68, feedback: "Revise chemical reactions" },
    { exam: "Final Exam", subject: "Physics", score: 85, feedback: "Keep up the good work" },
  ]);

  const [newExam, setNewExam] = useState({
    exam: "",
    subject: "",
    score: "",
    feedback: "",
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);


  useEffect(()=>{
    getAttendance();
  },[])


  async function getAttendance() {
    const token = localStorage.getItem("adminToken")
    try {
       const response = await axios.get(`http://localhost:4000/api/v1/attendance/student/${student_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); 
      console.log(response);
      const data = response.data;
      setAttendanceData(data)

    } catch (error:any) {
      console.error("Error fetching student:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("adminToken");
        router.push("/login");
      } else {
        toast.error("Failed to fetch attendance report.");
      }
    }
  }






  // 🧮 Group data by subject
  const groupedData = useMemo(() => {
    const map: { [key: string]: any[] } = {};
    examData.forEach((item) => {
      if (!map[item.subject]) map[item.subject] = [];
      map[item.subject].push(item);
    });
    return map;
  }, [examData]);

  // ➕ Add / Update
  const handleAddOrUpdate = () => {
    if (!newExam.exam || !newExam.subject || !newExam.score)
      return alert("Please fill all fields");

    if (editIndex !== null) {
      const updated = [...examData];
      updated[editIndex] = {
        exam: newExam.exam,
        subject: newExam.subject,
        score: Number(newExam.score),
        feedback: newExam.feedback || "No feedback",
      };
      setExamData(updated);
      setEditIndex(null);
    } else {
      setExamData([
        ...examData,
        {
          exam: newExam.exam,
          subject: newExam.subject,
          score: Number(newExam.score),
          feedback: newExam.feedback || "No feedback",
        },
      ]);
    }

    setNewExam({ exam: "", subject: "", score: "", feedback: "" });
  };

  // ✏️ Edit
  const handleEdit = (index: number) => {
    const item = examData[index];
    setNewExam({
      exam: item.exam,
      subject: item.subject,
      score: String(item.score),
      feedback: item.feedback,
    });
    setEditIndex(index);
  };

  // ❌ Delete
  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      setExamData(examData.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-10 p-4 sm:p-8">
      <h2 className="text-2xl font-bold border-b pb-2 text-gray-800 text-center sm:text-left">
        Academic Information
      </h2>

      {/* 📅 Attendance Section */}
      <div>
        <h3 className="text-lg font-semibold text-blue-600 mb-3">
          Monthly Attendance Report
        </h3>
        <div className="bg-gray-50 p-4 rounded-xl shadow-md">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#9ca3af" name="Total Classes" />
              <Bar dataKey="attended" fill="#3b82f6" name="Attended Classes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📈 Subject-wise Charts */}
      <div className="space-y-10">
        {Object.keys(groupedData).map((subject) => (
          <div key={subject}>
            <h3 className="text-lg font-semibold text-green-600 mb-3">
              {subject} Performance
            </h3>
            <div className="bg-gray-50 p-4 rounded-xl shadow-md">
              <ResponsiveContainer width="100%" height={300}>
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
        ))}
      </div>

      {/* 📄 Test Record Table */}
      <div>
        <h3 className="text-lg font-semibold text-purple-600 mb-3">
          All Test Records
        </h3>
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full text-sm border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2 border">Exam</th>
                <th className="p-2 border">Subject</th>
                <th className="p-2 border">Score</th>
                <th className="p-2 border">Feedback</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {examData.map((e, i) => (
                <tr
                  key={i}
                  className="text-center border-t hover:bg-gray-50 transition-all"
                >
                  <td className="p-2 border">{e.exam}</td>
                  <td className="p-2 border">{e.subject}</td>
                  <td className="p-2 border font-semibold text-green-600">
                    {e.score}
                  </td>
                  <td className="p-2 border text-left">{e.feedback}</td>
                  <td className="p-2 border flex justify-center gap-2 sm:gap-3 flex-wrap">
                    <button
                      onClick={() => handleEdit(i)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(i)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ➕ Add/Edit Section */}
      <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-md">
        <h4 className="font-semibold mb-4 text-gray-700 text-lg">
          {editIndex !== null ? "Edit Test / Feedback" : "Add Test / Feedback"}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Exam Name"
            value={newExam.exam}
            onChange={(e) => setNewExam({ ...newExam, exam: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Subject"
            value={newExam.subject}
            onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="number"
            placeholder="Score (0-100)"
            value={newExam.score}
            onChange={(e) => setNewExam({ ...newExam, score: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <textarea
            placeholder="Feedback (optional)"
            value={newExam.feedback}
            onChange={(e) => setNewExam({ ...newExam, feedback: e.target.value })}
            className="col-span-full border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3 justify-start">
          <button
            onClick={handleAddOrUpdate}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-md"
          >
            {editIndex !== null ? "Update Record" : "Add Record"}
          </button>
          {editIndex !== null && (
            <button
              onClick={() => {
                setNewExam({ exam: "", subject: "", score: "", feedback: "" });
                setEditIndex(null);
              }}
              className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600 active:scale-95 transition-all shadow-md"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

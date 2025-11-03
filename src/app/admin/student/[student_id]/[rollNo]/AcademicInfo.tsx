"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function AcademicInfo() {
  // 🗓️ Mock monthly attendance data
  const attendanceData = [
    { month: "Jan", total: 22, attended: 20 },
    { month: "Feb", total: 20, attended: 18 },
    { month: "Mar", total: 24, attended: 23 },
    { month: "Apr", total: 22, attended: 21 },
    { month: "May", total: 20, attended: 17 },
  ];

  // 🧠 Mock test/exam performance
  const examData = [
    { exam: "Unit Test 1", score: 75 },
    { exam: "Unit Test 2", score: 80 },
    { exam: "Mid Term", score: 70 },
    { exam: "Unit Test 3", score: 85 },
    { exam: "Final Exam", score: 90 },
  ];

  return (
    <div className="space-y-8">
      {/* Class Info */}
      <div>
        <h2 className="text-xl font-semibold border-b pb-2">Academic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-gray-700">
          <div>
            <p className="font-semibold">Class Name</p>
            <p>12th Science</p>
          </div>
          <div>
            <p className="font-semibold">Batch</p>
            <p>Morning Batch</p>
          </div>
          <div>
            <p className="font-semibold">Total Subjects</p>
            <p>6</p>
          </div>
        </div>
      </div>

      {/* Attendance Report */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-blue-600">Monthly Attendance Report</h3>
        <div className="bg-gray-50 p-4 rounded-xl">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#94a3b8" name="Total Classes" />
              <Bar dataKey="attended" fill="#3b82f6" name="Attended Classes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Exam Performance */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-green-600">Exam & Test Performance</h3>
        <div className="bg-gray-50 p-4 rounded-xl">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={examData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="exam" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#16a34a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

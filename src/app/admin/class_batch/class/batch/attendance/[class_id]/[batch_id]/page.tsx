"use client";

import * as React from "react";
import CircularIndeterminate from "@/app/components/ui/CircularIndeterminate";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiSave, FiDownload, FiBell } from "react-icons/fi";
import { toast } from "react-toastify";
import Link from "next/link";

interface Student {
  _id: string;
  name: string;
  roll?: string;
  parentPhone?: string;
}

interface GetAllStudentResponse {
  class_name: string;
  batch_name: string;
  students: Student[];
}

interface AttendanceRecord {
  studentId: string;
  studentName: string;
  status: "Present" | "Absent" | "";
  comment: string;
}

export default function Attendance() {
  const { class_id, batch_id } = useParams();
  const router = useRouter();

  const [classData, setClassData] = useState({ class_name: "", batch_name: "" });
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  // ✅ Set today's date on mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  // ✅ Fetch students
  useEffect(() => {
    if (class_id && batch_id) getBatchStudents();
  }, [class_id, batch_id]);

  // ✅ Detect editable state (only today's attendance)
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setIsEditable(date === today);
  }, [date]);

  // ✅ Initialize attendance after students or date changes
  useEffect(() => {
    if (students.length && date) getAttendanceByDate();
  }, [students, date]);

  async function getBatchStudents() {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Session expired. Please log in again.");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get<GetAllStudentResponse>(
        `http://localhost:4000/api/v1/student/${class_id}/${batch_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClassData({
        class_name: response.data.class_name,
        batch_name: response.data.batch_name,
      });

      setStudents(response.data.students);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  }

  async function getAttendanceByDate() {
    const token = localStorage.getItem("adminToken");
    if (!token) return router.push("/login");

    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:4000/api/v1/attendance/${date}/${class_id}/${batch_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const initial: Record<string, AttendanceRecord> = {};

      if (res.data && res.data[0]?.attendance) {
        res.data[0].attendance.forEach((a: any) => {
          initial[a.studentId] = {
            studentId: a.studentId,
            studentName: a.studentName,
            status: a.status,
            comment: a.comment,
          };
        });
      } else {
        students.forEach((s) => {
          initial[s._id] = { studentId: s._id, studentName: s.name, status: "", comment: "" };
        });
      }

      setAttendance(initial);
    } catch (err: any) {
      if (err.response?.status === 404) {
        const initial: Record<string, AttendanceRecord> = {};
        students.forEach((s) => {
          initial[s._id] = { studentId: s._id, studentName: s.name, status: "", comment: "" };
        });
        setAttendance(initial);
      } else {
        console.error(err);
        toast.error("Failed to fetch attendance data.");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = (studentId: string, status: "Present" | "Absent") => {
    if (!isEditable) return;
    setAttendance((prev) => ({ ...prev, [studentId]: { ...prev[studentId], status } }));
  };

  const handleCommentChange = (studentId: string, comment: string) => {
    if (!isEditable) return;
    setAttendance((prev) => ({ ...prev, [studentId]: { ...prev[studentId], comment } }));
  };

  async function saveAttendance() {
    if (!date) return toast.error("Please select a date.");
    if (!isEditable) return toast.error("Cannot edit past attendance.");

    const token = localStorage.getItem("adminToken");
    if (!token) return router.push("/login");

    try {
      setProcessing(true);

      // Always include studentName from students array
      const attendanceArray: AttendanceRecord[] = students.map((s) => ({
        studentId: s._id,
        studentName: s.name,
        status: attendance[s._id]?.status || "Present",
        comment: attendance[s._id]?.comment || "",
      }));

      await axios.post(
        `http://localhost:4000/api/v1/attendance/mark`,
        { classId: class_id, batchId: batch_id, date, attendance: attendanceArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Attendance saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save attendance.");
    } finally {
      setProcessing(false);
    }
  }

  async function sendNotification() {
    if (!isEditable) return toast.error("Notifications only for today's attendance.");
    const token = localStorage.getItem("adminToken");
    if (!token) return toast.error("Please log in again.");

    try {
      setProcessing(true);
      await axios.post(
        `http://localhost:4000/api/v1/attendance/notify`,
        { classId: class_id, batchId: batch_id, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Notifications sent!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send notifications.");
    } finally {
      setProcessing(false);
    }
  }

  async function exportAttendanceCSV() {
    if (!date) return toast.error("Please select a date.");
    if (!students.length) return toast.error("No student data available.");

    try {
      setProcessing(true);
      const headers = ["Student Name", "Roll No", "Status", "Comment"];
      const rows = students.map((s, i) => [
        s.name,
        i + 1,
        attendance[s._id]?.status || "N/A",
        attendance[s._id]?.comment || "",
      ]);

      const csv = [headers, ...rows]
        .map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Attendance_${classData.class_name}_${classData.batch_name}_${date}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export CSV.");
    } finally {
      setProcessing(false);
    }
  }

  if (loading)
    return (
      <main className="flex flex-col h-screen justify-center items-center">
        <CircularIndeterminate size={80} />
        <span>Loading...</span>
      </main>
    );

  return (
    <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">
          {classData.class_name} - {classData.batch_name}
        </h1>

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-800">
          <div className="flex gap-8 px-4">
            <Link
              href={`/admin/class_batch/class/batch/students/${class_id}/${batch_id}`}
              className="border-b-2 border-transparent py-3 text-sm font-medium text-slate-500 dark:text-slate-400"
              >
              Students
            </Link>
            <Link
              href={`/admin/class_batch/class/batch/attendance/${class_id}/${batch_id}`}
              className="border-b-2 border-blue-600 py-3 text-sm font-semibold text-blue-600"
            >
              Attendance
            </Link>
            
          </div>
          <br />
        </div>
        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <label htmlFor="attendance-date" className="text-sm font-medium">
              Select Date:
            </label>
            <input
              type="date"
              id="attendance-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded border px-2 py-1"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={exportAttendanceCSV}
              disabled={processing}
              className="bg-indigo-600 cursor-pointer text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
            >
              {processing ? <CircularIndeterminate size={20} /> : <FiDownload />}
              <span>Export CSV</span>
            </button>

            <button
              onClick={sendNotification}
              disabled={!isEditable || processing}
              className={`px-4 py-1 flex items-center cursor-pointer gap-1.5 rounded text-white ${
                isEditable ? "bg-yellow-600" : "bg-gray-400"
              } disabled:opacity-50`}
            >
              {processing ? <CircularIndeterminate size={20} /> : <FiBell />}
              <span>Notify</span>
            </button>

            <button
              onClick={saveAttendance}
              disabled={!isEditable || processing}
              className={`px-4 py-1 flex items-center cursor-pointer gap-1.5 rounded text-white ${
                isEditable ? "bg-blue-600" : "bg-gray-400"
              } disabled:opacity-50`}
            >
              {processing ? <CircularIndeterminate size={20} /> : <FiSave />}
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow p-4">
          <h2 className="text-xl font-semibold mb-4">
            Attendance Report - {date || "Select a Date"}
          </h2>
          <table className="w-full table-auto min-w-max">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Roll</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">Comments</th>
              </tr>
            </thead>
            <tbody>
              {students.length ? (
                students.map((s, i) => (
                  <tr key={s._id}>
                    <td className="px-6 py-2">{s.name}</td>
                    <td className="px-6 py-2">{i + 1}</td>
                    <td className="px-6 py-2">
                      <label>
                        <input
                          type="radio"
                          name={`status-${s._id}`}
                          checked={attendance[s._id]?.status === "Present"}
                          onChange={() => handleStatusChange(s._id, "Present")}
                          disabled={!isEditable || processing}
                        />{" "}
                        Present
                      </label>
                      <label className="ml-2">
                        <input
                          type="radio"
                          name={`status-${s._id}`}
                          checked={attendance[s._id]?.status === "Absent"}
                          onChange={() => handleStatusChange(s._id, "Absent")}
                          disabled={!isEditable || processing}
                        />{" "}
                        Absent
                      </label>
                    </td>
                    <td className="px-6 py-2">
                      <input
                        type="text"
                        placeholder="Comment..."
                        value={attendance[s._id]?.comment || ""}
                        onChange={(e) => handleCommentChange(s._id, e.target.value)}
                        disabled={!isEditable || processing}
                        className="w-full border px-2 py-1 rounded"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

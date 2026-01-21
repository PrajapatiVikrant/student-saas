"use client";

import * as React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiSave, FiDownload, FiBell } from "react-icons/fi";
import { toast } from "react-toastify";
import CircularIndeterminate from "@/app/components/ui/CircularIndeterminate";

interface Student {
  _id: string;
  name: string;
}

interface AttendanceRecord {
  studentId: string;
  studentName: string;
  status: "Present" | "Absent" | "";
  comment: string;
}

export default function Attendance() {
  const router = useRouter();

  const [classId, setClassId] = useState<string>("");
  const [batchId, setBatchId] = useState<string>("");

  const [classData, setClassData] = useState({
    class_name: "",
    batch_name: "",
  });
  const [teacher, setTeacher] = useState<any>({})
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>(
    {}
  );

  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  /* -------------------- SET TODAY DATE -------------------- */
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  /* -------------------- CHECK EDITABLE -------------------- */
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setIsEditable(date === today);
  }, [date]);

  /* -------------------- FETCH TEACHER PROFILE -------------------- */
  useEffect(() => {
    fetchTeacherProfile();
  }, []);

  async function fetchTeacherProfile() {
    const token = localStorage.getItem("codeflam01_token");
    if (!token) {
      toast.error("Session expired");
      return router.push("/login");
    }

    try {
      const res = await axios.get(
        "http://localhost:4000/api/v1/teacher/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data)
      setTeacher(res.data)
      const { batch_id } = res.data.class_teacher;
      const class_id = res.data.class_teacher.class_id._id
      console.log(class_id, batch_id)
      setClassId(class_id);
      setBatchId(batch_id);

      fetchStudents(class_id, batch_id);
    } catch (err) {
      toast.error("Failed to load teacher profile");
    }
  }

  /* -------------------- FETCH STUDENTS -------------------- */
  async function fetchStudents(class_id: string, batch_id: string) {
    const token = localStorage.getItem("codeflam01_token");

    try {
      const res = await axios.get(
        `http://localhost:4000/api/v1/student/${class_id}/${batch_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setClassData({
        class_name: res.data.class_name,
        batch_name: res.data.batch_name,
      });

      setStudents(res.data.students);
    } catch (error: any) {
      console.log(error)
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  }

  /* -------------------- FETCH ATTENDANCE -------------------- */
  useEffect(() => {
    if (students.length && date) fetchAttendance();
  }, [students, date]);

  async function fetchAttendance() {
    const token = localStorage.getItem("codeflam01_token");
    if (!token) return router.push("/login");

    try {
      const res = await axios.get(
        `http://localhost:4000/api/v1/attendance/${date}/${classId}/${batchId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const initial: Record<string, AttendanceRecord> = {};

      if (res.data?.[0]?.attendance) {
        res.data[0].attendance.forEach((a: any) => {
          initial[a.studentId] = a;
        });
      } else {
        students.forEach((s) => {
          initial[s._id] = {
            studentId: s._id,
            studentName: s.name,
            status: "",
            comment: "",
          };
        });
      }

      setAttendance(initial);
    } catch {
      const initial: Record<string, AttendanceRecord> = {};
      students.forEach((s) => {
        initial[s._id] = {
          studentId: s._id,
          studentName: s.name,
          status: "",
          comment: "",
        };
      });
      setAttendance(initial);
    }
  }

  /* -------------------- HANDLERS -------------------- */
  const handleStatusChange = (
    id: string,
    status: "Present" | "Absent"
  ) => {
    if (!isEditable) return;
    setAttendance((prev) => ({
      ...prev,
      [id]: { ...prev[id], status },
    }));
  };

  const handleCommentChange = (id: string, comment: string) => {
    if (!isEditable) return;
    setAttendance((prev) => ({
      ...prev,
      [id]: { ...prev[id], comment },
    }));
  };

  /* -------------------- SAVE ATTENDANCE -------------------- */
  async function saveAttendance() {
    if (!isEditable) return toast.error("Cannot edit past attendance");

    const token = localStorage.getItem("codeflam01_token");

    try {
      setProcessing(true);

      const attendanceArray = students.map((s) => ({
        studentId: s._id,
        studentName: s.name,
        status: attendance[s._id]?.status || "Present",
        comment: attendance[s._id]?.comment || "",
      }));

      await axios.post(
        "http://localhost:4000/api/v1/attendance/mark",
        { classId,class_name:classData.class_name, batchId,batch_name:classData.batch_name, date, attendance: attendanceArray, admin_id: teacher.admin_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Attendance saved");
    } catch (error: any) {
      console.log(error)
      toast.error("Save failed");
    } finally {
      setProcessing(false);
    }
  }

  /* -------------------- CSV EXPORT -------------------- */
  function exportCSV() {
    const headers = ["Student", "Roll", "Status", "Comment"];
    const rows = students.map((s, i) => [
      s.name,
      i + 1,
      attendance[s._id]?.status || "",
      attendance[s._id]?.comment || "",
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Attendance_${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* -------------------- UI -------------------- */
  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <CircularIndeterminate size={60} />
        <p>Loading...</p>
      </div>
    );

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {classData.class_name} - {classData.batch_name}
      </h1>

      <div className="flex gap-3 mb-6">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />

        <button onClick={exportCSV} className="bg-indigo-600 cursor-pointer text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50">
          <FiDownload /> Export
        </button>

        <button
          disabled={!isEditable}
          onClick={saveAttendance}
          className="px-4 py-1 flex items-center cursor-pointer gap-1.5 rounded text-white bg-yellow-600 disabled:opacity-50"
        >
          <FiSave /> Save
        </button>
      </div>

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
          {students.map((s, i) => (
            <tr key={s._id}>
              <td className="px-6 py-2">{s.name}</td>
              <td className="px-6 py-2">{i + 1}</td>
              <td className="px-6 py-2">
                <input
                  type="radio"
                  checked={attendance[s._id]?.status === "Present"}
                  onChange={() => handleStatusChange(s._id, "Present")}
                />{" "}
                Present
                <input
                  type="radio"
                  checked={attendance[s._id]?.status === "Absent"}
                  onChange={() => handleStatusChange(s._id, "Absent")}
                />{" "}
                Absent
              </td>
              <td className="px-6 py-2">
                <input
                  value={attendance[s._id]?.comment || ""}
                  onChange={(e) =>
                    handleCommentChange(s._id, e.target.value)
                  }
                  className="border px-2 py-1 rounded w-full"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

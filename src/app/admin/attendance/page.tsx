"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import CircularIndeterminate from "@/app/components/ui/CircularIndeterminate";

interface Student {
    _id: string;
    name: string;
    class: { class_id: string; name: string };
    batch: { batch_id: string; name: string };
}

interface AttendanceRecord {
    studentId: string;
    studentName: string;
    status: "Present" | "Absent";
    comment: string;
}

export default function AttendanceManagement() {
    const router = useRouter();

    const [students, setStudents] = useState<Student[]>([]);
    const [classList, setClassList] = useState<any[]>([]);
    const [batchList, setBatchList] = useState<any[]>([]);
    const [classData, setClassData] = useState({ class_name: "", batch_name: "" });
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedBatch, setSelectedBatch] = useState("");
    const [attendance, setAttendance] =
        useState<Record<string, AttendanceRecord>>({});
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [rollInput, setRollInput] = useState("");
    const [processing, setProcessing] = useState(false);

    // ================= DATE =================
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setDate(today);
    }, []);

    // ================= TOKEN =================
    const getToken = () => {
        const token = localStorage.getItem("codeflam01_token");
        if (!token) {
            toast.error("Session expired");
            router.push("/login");
            throw new Error("No token");
        }
        return token;
    };

    // ================= FETCH CLASSES =================
    const fetchClasses = async () => {
        try {
            const token = getToken();
            const res = await axios.get(
                "https://codeflame-edu-backend.xyz/api/v1/kaksha",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setClassList(res.data);
        } catch {
            toast.error("Failed to load classes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    // ================= HANDLE CLASS =================
    const handleChangeClass = (classId: string) => {
        setSelectedClass(classId);
        setSelectedBatch("");

        const batches =
            classList.find((c) => c._id === classId)?.class.batches || [];
        setBatchList(batches);
    };

    // ================= FETCH STUDENTS =================
    const fetchStudents = async () => {
        if (!selectedClass || !selectedBatch) return;

        setLoading(true);
        try {
            const token = getToken();
            const res = await axios.get(
                `https://codeflame-edu-backend.xyz/api/v1/student/${selectedClass}/${selectedBatch}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setClassData({
                class_name: res.data.class_name,
                batch_name: res.data.batch_name,
            });
            setStudents(res.data.students);

            const initial: Record<string, AttendanceRecord> = {};
            res.data.students.forEach((s: Student) => {
                initial[s._id] = {
                    studentId: s._id,
                    studentName: s.name,
                    status: "Present",
                    comment: "",
                };
            });

            setAttendance(initial);
        } catch (error: unknown) {
            const err = error as AxiosError;
            if (err.response?.status === 401 || err.response?.status === 403) {
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("codeflam01_token");
                router.push("/login");
            }
            toast.error("Failed to fetch students");
        } finally {
            setLoading(false);
        }
    };


    // ================= fetch attendance =================
    async function getAttendanceByDate() {
        const token = localStorage.getItem("codeflam01_token");
        if (!token) return router.push("/login");

        setLoading(true);
        try {
            const res = await axios.get(
                `https://codeflame-edu-backend.xyz/api/v1/attendance/${date}/${selectedClass}/${selectedBatch}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const initial: Record<string, AttendanceRecord> = {};

            if (res.data && res.data[0]?.attendance) {
                // ✅ Already saved attendance
                res.data[0].attendance.forEach((a: any) => {
                    initial[a.studentId] = {
                        studentId: a.studentId,
                        studentName: a.studentName,
                        status: a.status,
                        comment: a.comment,
                    };
                });
            } else {
                // ✅ DEFAULT → sabko Present mark karo
                students.forEach((s) => {
                    initial[s._id] = {
                        studentId: s._id,
                        studentName: s.name,
                        status: "Present",
                        comment: "",
                    };
                });
            }

            setAttendance(initial);
        } catch (err: any) {

            if (err.response?.status === 401 || err.response?.status === 403) {
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("codeflam01_token");
                router.push("/login");
            }
            if (err.response?.status === 404) {
                // ✅ 404 bhi same case → no attendance
                const initial: Record<string, AttendanceRecord> = {};
                students.forEach((s) => {
                    initial[s._id] = {
                        studentId: s._id,
                        studentName: s.name,
                        status: "Present",
                        comment: "",
                    };
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








    useEffect(() => {
        fetchStudents();
    }, [selectedClass, selectedBatch]);

    // ✅ Initialize attendance after students or date changes
    useEffect(() => {
        if (students.length && date) getAttendanceByDate();
    }, [students, date]);

    // ================= MARK ABSENT BY ROLL =================
    const handleMarkAbsentByRoll = () => {
        if (!rollInput) return;

        const roll = Number(rollInput);

        if (roll < 1 || roll > students.length) {
            toast.error("Invalid roll number ❌");
            return;
        }

        const student = students[roll - 1];

        setAttendance((prev) => ({
            ...prev,
            [student._id]: {
                ...prev[student._id],
                status: "Absent",
            },
        }));

        setRollInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleMarkAbsentByRoll();
        }
    };

    // ================= ABSENT LIST =================
    const absentStudents = students
        .map((s, i) => ({
            ...s,
            roll: i + 1,
        }))
        .filter((s) => attendance[s._id]?.status === "Absent");


    const handleRemoveAbsent = (id: string) => {
        setAttendance((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                status: "Present",
            },
        }));
    };

    // ================= HANDLE =================
    const handleStatus = (id: string, status: "Present" | "Absent") => {
        setAttendance((prev) => ({
            ...prev,
            [id]: { ...prev[id], status },
        }));
    };

    const handleComment = (id: string, comment: string) => {
        setAttendance((prev) => ({
            ...prev,
            [id]: { ...prev[id], comment },
        }));
    };

    // ================= SAVE =================
    const saveAttendance = async () => {
        try {
            setProcessing(true);
            const token = getToken();

            const attendanceArray = Object.values(attendance);

            await axios.post(
                "https://codeflame-edu-backend.xyz/api/v1/attendance/mark",
                {
                    classId: selectedClass,
                    class_name: classData.class_name,
                    batchId: selectedBatch,
                    batch_name: classData.batch_name,
                    date,
                    attendance: attendanceArray,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Attendance Saved ✅");
        } catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("codeflam01_token");
                router.push("/login");
            }
            toast.error("Save failed");
        } finally {
            setProcessing(false);
        }
    };

    // ================= CSV =================
    const exportCSV = () => {
        const rows = students.map((s, i) => [
            s.name,
            i + 1,
            attendance[s._id]?.status,
            attendance[s._id]?.comment,
        ]);

        const csv = [["Name", "Roll", "Status", "Comment"], ...rows]
            .map((r) => r.join(","))
            .join("\n");

        const blob = new Blob([csv]);
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `Attendance_${date}.csv`;
        a.click();
    };

    // ================= LOADING =================
    if (loading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <CircularIndeterminate size={60} />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">

            <h1 className="text-xl font-bold mb-4">
                Attendance Management
            </h1>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4">
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                    className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 rounded w-full sm:w-auto" />

                <select value={selectedClass} onChange={(e) => handleChangeClass(e.target.value)}
                    className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 rounded w-full sm:w-auto">
                    <option value="">Select Class</option>
                    {classList.map((cls) => (
                        <option key={cls._id} value={cls._id}>
                            {cls.class.name}
                        </option>
                    ))}
                </select>

                <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}
                    className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 rounded w-full sm:w-auto">
                    <option value="">Select Batch</option>
                    {batchList.map((b) => (
                        <option key={b._id} value={b._id}>
                            {b.batch_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Roll Input */}
            {selectedClass && selectedBatch && (
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <input
                        type="number"
                        placeholder="Enter Roll No (Absent)"
                        value={rollInput}
                        onChange={(e) => setRollInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full sm:w-40 px-3 py-2 rounded-lg
  border border-slate-300 dark:border-slate-700
  bg-white dark:bg-slate-800
  text-black dark:text-white
  placeholder:text-slate-400
  focus:outline-none focus:ring-2 focus:ring-red-500
  transition"
                    />

                    <button
                        onClick={handleMarkAbsentByRoll}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                        Mark Absent
                    </button>
                </div>
            )}

            {/* ✅ Absent List */}
            {absentStudents.length > 0 && (
                <div className="mb-4 p-3 rounded bg-red-50 dark:bg-red-900/30">
                    <h2 className="text-red-600 font-semibold mb-2">
                        Absent Students ({absentStudents.length})
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        {absentStudents.map((s) => (
                            <div
                                key={s._id}
                                className="flex items-center gap-2 text-xs bg-red-200 text-red-800 px-2 py-1 rounded"
                            >
                                <span>
                                    {s.roll}. {s.name}
                                </span>

                                <button
                                    onClick={() => handleRemoveAbsent(s._id)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded text-[10px]"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm min-w-[600px]">
                    <thead className="bg-slate-100 dark:bg-slate-800">
                        <tr>
                            <th className="border px-2 py-2">Roll No</th>
                            <th className="border px-2 py-2">Name</th>
                            <th className="border px-2 py-2">Status</th>
                            <th className="border px-2 py-2">Comment</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map((s, i) => (
                            <tr key={s._id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                                <td className="border px-2 py-2 text-center">{i + 1}</td>
                                <td className="border px-2 py-2">{s.name}</td>

                                <td className="border px-2 py-2">
                                    <button onClick={() => handleStatus(s._id, "Present")}
                                        className={`px-3 py-1 rounded mr-2 text-sm ${attendance[s._id]?.status === "Present"
                                            ? "bg-green-600 text-white"
                                            : "bg-slate-200 dark:bg-slate-700"
                                            }`}>
                                        Present
                                    </button>

                                    <button onClick={() => handleStatus(s._id, "Absent")}
                                        className={`px-3 py-1 rounded text-sm ${attendance[s._id]?.status === "Absent"
                                            ? "bg-red-600 text-white"
                                            : "bg-slate-200 dark:bg-slate-700"
                                            }`}>
                                        Absent
                                    </button>
                                </td>

                                <td className="border px-2 py-2">
                                    <input
                                        value={attendance[s._id]?.comment || ""}
                                        onChange={(e) => handleComment(s._id, e.target.value)}
                                        placeholder="Comment here ..."
                                        className="w-full border px-2 py-1 rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-4">
                <button onClick={saveAttendance}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                    {processing ? "Saving..." : "Save"}
                </button>

                <button onClick={exportCSV}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
                    Export CSV
                </button>
            </div>
        </div>
    );
}
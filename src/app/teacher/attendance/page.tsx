"use client";



"use client";

import * as React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiSave, FiDownload } from "react-icons/fi";
import { toast } from "react-toastify";
import CircularIndeterminate from "@/app/components/ui/CircularIndeterminate";

import {
  Search,
  Download,
  Save,
  CheckCircle2,
  XCircle,
  User,
  Calendar as CalendarIcon,
} from "lucide-react";

import { Button } from "@/app/components/ui/attendanceUi/Button";
import { Input } from "@/app/components/ui/attendanceUi/Input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/attendanceUi/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/attendanceUi/Table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/attendanceUi/Avatar";
import { Badge } from "@/app/components/ui/attendanceUi/Badge";
import { Progress } from "@/app/components/ui/attendanceUi/Progress";

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

  const [classId, setClassId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [classData, setClassData] = useState({
    class_name: "",
    batch_name: "",
  });

  const [teacher, setTeacher] = useState<any>({});
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] =
    useState<Record<string, AttendanceRecord>>({});
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [search, setSearch] = useState("");

  /* ---------- DATE ---------- */
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setIsEditable(date === today);
  }, [date]);

  /* ---------- TEACHER ---------- */
  useEffect(() => {
    fetchTeacherProfile();
  }, []);

  async function fetchTeacherProfile() {
    const token = localStorage.getItem("codeflam01_token");
    if (!token) return router.push("/login");

    try {
      const res = await axios.get(
        "https://student-backend-saas.vercel.app/api/v1/teacher/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTeacher(res.data);
      const class_id = res.data.class_teacher.class_id._id;
      const batch_id = res.data.class_teacher.batch_id;

      setClassId(class_id);
      setBatchId(batch_id);
      fetchStudents(class_id, batch_id);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        toast.error("Session expired. Please login again ❌");
        router.push("/teacher/login");
        return;
      }
      toast.error("Failed to load teacher profile");
    }
  }

  /* ---------- STUDENTS ---------- */
  async function fetchStudents(class_id: string, batch_id: string) {
    const token = localStorage.getItem("codeflam01_token");

    try {
      const res = await axios.get(
        `https://student-backend-saas.vercel.app/api/v1/student/${class_id}/${batch_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClassData({
        class_name: res.data.class_name,
        batch_name: res.data.batch_name,
      });
      setStudents(res.data.students);
    } catch (error: any) {
      toast.error("Failed to fetch students");
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        toast.error("Session expired. Please login again ❌");
        router.push("/teacher/login");
        return;
      }
    } finally {
      setLoading(false);
    }
  }

  /* ---------- ATTENDANCE ---------- */
  useEffect(() => {
    if (students.length && date) fetchAttendance();
  }, [students, date]);

  async function fetchAttendance() {
    const token = localStorage.getItem("codeflam01_token");
    if (!token) return router.push("/login");

    try {
      const res = await axios.get(
        `https://student-backend-saas.vercel.app/api/v1/attendance/${date}/${classId}/${batchId}`,
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
    } catch (error: any) {
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
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        toast.error("Session expired. Please login again ❌");
        router.push("/teacher/login");
        return;
      }
    }
  }

  /* ---------- HANDLERS ---------- */
  const handleStatusChange = (id: string, status: "Present" | "Absent") => {
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

  /* ---------- SAVE ---------- */
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
        "https://student-backend-saas.vercel.app/api/v1/attendance/mark",
        {
          classId,
          batchId,
          date,
          class_name: classData.class_name,
          batch_name: classData.batch_name,
          attendance: attendanceArray,
          admin_id: teacher.admin_id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Attendance saved");
    } catch (error: any) {
      toast.error("Save failed");
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        toast.error("Session expired. Please login again ❌");
        router.push("/teacher/login");
        return;
      }
    } finally {
      setProcessing(false);
    }
  }

  /* ---------- CSV ---------- */
  function exportCSV() {
    const rows = students.map((s, i) => [
      s.name,
      i + 1,
      attendance[s._id]?.status || "",
      attendance[s._id]?.comment || "",
    ]);

    const csv = [["Student", "Roll", "Status", "Comment"], ...rows]
      .map((r) => r.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Attendance_${date}.csv`;
    a.click();
  }

  /* ---------- STATS ---------- */
  const total = students.length;
  const present = students.filter(
    (s) => attendance[s._id]?.status === "Present"
  ).length;
  const absent = students.filter(
    (s) => attendance[s._id]?.status === "Absent"
  ).length;

  const marked = present + absent;
  const progressValue = total ? Math.round((marked / total) * 100) : 0;

  const stats = { total, present, absent, marked };

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <CircularIndeterminate size={60} />
        <p>Loading...</p>
      </div>
    );
  }

  /* ---------- UI (UNCHANGED) ---------- */
  return (
    <main className="max-w-6xl bg-slate-50 dark:bg-slate-900   mx-auto  pb-10">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {classData.class_name}
              </h1>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {classData.batch_name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportCSV}
              className="hidden sm:flex border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              size="sm"
              onClick={saveAttendance}
              disabled={!isEditable || processing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md dark:shadow-indigo-900 transition-all hover:shadow-indigo-200"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>
      <br />

      <Card className="lg:col-span-2 mx-4 shadow-sm border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 mt-4">
        <CardHeader className="pb-3 border-b border-slate-50 dark:border-slate-700">
          <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            Attendance Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full sm:w-48 font-medium border-slate-200 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-100 focus:ring-indigo-500"
          />
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-300" />
            <Input
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-slate-200 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-100 focus:ring-indigo-500"
            />
          </div>
        </CardContent>
      </Card>
      <br />
      {/* Summary Card */}
      <Card className="shadow-sm mx-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 mt-4">
        <CardHeader className="pb-3 border-b border-slate-50 dark:border-slate-700">
          <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100">
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-5 flex justify-between">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-green-600">{stats.present}</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Present
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-red-600">{stats.absent}</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Absent
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-slate-700 dark:text-slate-100">
                {stats.total - stats.marked}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Left
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="sticky mx-4 top-16 z-20 my-2 bg-white dark:bg-slate-700 backdrop-blur pb-4 border-b ">
        <div className="px-1 space-y-2">

          {/* Top labels */}
          <div className="flex justify-between items-center text-[11px]  text-slate-600 dark:text-slate-400 font-semibold tracking-wide">
            <span>
              Progress <span className="text-slate-400">({progressValue}%)</span>
            </span>
            <span className="text-slate-500">
              {stats.marked} / {stats.total}
            </span>
          </div>

          {/* Progress bar */}
          <div className="relative h-2.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="
          absolute left-0 top-0 h-full rounded-full
          bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600
          transition-all duration-500 ease-out
        "
              style={{ width: `${progressValue}%` }}
            />

            {/* subtle glow */}
            {progressValue > 0 && (
              <div
                className="absolute top-0 h-full rounded-full bg-green-400/30 blur-sm"
                style={{ width: `${progressValue}%` }}
              />
            )}
          </div>

        </div>
      </div>



      {/* Desktop Table View */}
      <div
        className="hidden mx-4 md:block bg-white dark:bg-slate-900 
  rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
      >
        <Table>
          <TableHeader className="bg-slate-50/80 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <TableRow className="hover:bg-slate-50/80 dark:hover:bg-slate-800">
              <TableHead className="w-[80px] font-semibold text-slate-600 dark:text-slate-200">
                Roll
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-slate-200">
                Student
              </TableHead>
              <TableHead className="w-[300px] font-semibold text-slate-600 dark:text-slate-200">
                Status
              </TableHead>
              <TableHead className="font-semibold text-slate-600 dark:text-slate-200">
                Comment
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.map((student) => {
              const status = attendance[student._id]?.status;

              return (
                <TableRow
                  key={student._id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800"
                >
                  <TableCell className="text-slate-700 dark:text-slate-200 font-medium">
                    {students.indexOf(student) + 1}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${students.indexOf(
                            student
                          )}`}
                        />
                        <AvatarFallback className="text-slate-400 dark:text-slate-300">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {student.name}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div
                      className="flex gap-1 p-1 bg-slate-100/80 dark:bg-slate-800 
                rounded-lg w-fit border border-slate-200/50 dark:border-slate-700"
                    >
                      <button
                        onClick={() => handleStatusChange(student._id, "Present")}
                        className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium 
                    transition-all duration-200
                    ${status === "Present"
                            ? "bg-white dark:bg-slate-900 text-green-700 dark:text-green-300 shadow-sm ring-1 ring-green-200/50 dark:ring-green-700"
                            : "text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700"
                          }
                  `}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 ${status === "Present"
                              ? "fill-green-100 dark:fill-green-900/40"
                              : ""
                            }`}
                        />
                        Present
                      </button>

                      <button
                        onClick={() => handleStatusChange(student._id, "Absent")}
                        className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium 
                    transition-all duration-200
                    ${status === "Absent"
                            ? "bg-white dark:bg-slate-900 text-red-700 dark:text-red-300 shadow-sm ring-1 ring-red-200/50 dark:ring-red-700"
                            : "text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700"
                          }
                  `}
                      >
                        <XCircle
                          className={`w-4 h-4 ${status === "Absent"
                              ? "fill-red-100 dark:fill-red-900/40"
                              : ""
                            }`}
                        />
                        Absent
                      </button>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Input
                      placeholder="Add note..."
                      value={attendance[student._id]?.comment || ""}
                      onChange={(e) =>
                        handleCommentChange(student._id, e.target.value)
                      }
                      className="h-9 bg-transparent dark:bg-transparent 
                border-transparent hover:border-slate-200 dark:hover:border-slate-600 
                focus:border-indigo-500 dark:focus:border-indigo-400 
                focus:bg-white dark:focus:bg-slate-900 
                transition-all text-slate-600 dark:text-slate-200 
                placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden mx-4 space-y-4">
        {students.map((student) => {
          const status = attendance[student._id]?.status;

          return (
            <Card
              key={student._id}
              className={`overflow-hidden transition-all shadow-sm 
        border border-slate-200 dark:border-slate-700 
        bg-white dark:bg-slate-900
        ${status === "Absent"
                  ? "border-l-4 border-l-red-500"
                  : status === "Present"
                    ? "border-l-4 border-l-green-500"
                    : ""
                }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${students.indexOf(
                          student
                        )}`}
                      />
                      <AvatarFallback>
                        <User className="w-5 h-5 text-slate-400 dark:text-slate-300" />
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {student.name}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Roll No. {students.indexOf(student) + 1}
                      </p>
                    </div>
                  </div>

                  {status && (
                    <Badge
                      variant="outline"
                      className={`${status === "Present"
                          ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700"
                          : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700"
                        }`}
                    >
                      {status}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Button
                    variant={status === "Present" ? "default" : "outline"}
                    size="sm"
                    className={`w-full justify-center ${status === "Present"
                        ? "bg-green-600 hover:bg-green-700 border-green-600 shadow-sm text-white"
                        : "hover:bg-green-50 hover:text-green-700 hover:border-green-200 border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-green-900/20 dark:hover:text-green-300 dark:hover:border-green-700"
                      }`}
                    onClick={() => handleStatusChange(student._id, "Present")}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Present
                  </Button>

                  <Button
                    variant={status === "Absent" ? "destructive" : "outline"}
                    size="sm"
                    className={`w-full justify-center ${status === "Absent"
                        ? "bg-red-600 hover:bg-red-700 shadow-sm text-white"
                        : "hover:bg-red-50 hover:text-red-700 hover:border-red-200 border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-red-900/20 dark:hover:text-red-300 dark:hover:border-red-700"
                      }`}
                    onClick={() => handleStatusChange(student._id, "Absent")}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Absent
                  </Button>
                </div>

                <Input
                  placeholder="Add a comment..."
                  value={attendance[student._id]?.comment || ""}
                  onChange={(e) =>
                    handleCommentChange(student._id, e.target.value)
                  }
                  className="bg-slate-50 dark:bg-slate-800 
            border-slate-200 dark:border-slate-700 
            focus:bg-white dark:focus:bg-slate-900 
            text-sm text-slate-900 dark:text-white 
            placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

    </main>
  );
}
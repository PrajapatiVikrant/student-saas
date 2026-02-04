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
        "http://localhost:4000/api/v1/teacher/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTeacher(res.data);
      const class_id = res.data.class_teacher.class_id._id;
      const batch_id = res.data.class_teacher.batch_id;

      setClassId(class_id);
      setBatchId(batch_id);
      fetchStudents(class_id, batch_id);
    } catch(error:any) {
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
        `http://localhost:4000/api/v1/student/${class_id}/${batch_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClassData({
        class_name: res.data.class_name,
        batch_name: res.data.batch_name,
      });
      setStudents(res.data.students);
    } catch(error:any) {
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
    } catch(error:any) {
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
        "http://localhost:4000/api/v1/attendance/mark",
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
    } catch(error:any) {
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
    <main className="max-w-6xl bg-slate-50 dark:bg-slate-900   mx-auto px-4 pb-10">
      {/* Top Navigation / Header */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
           
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                {classData.class_name}
              </h1>
              <p className="text-xs text-slate-500 font-medium">{classData.batch_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportCSV}
              className="hidden sm:flex border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              size="sm"
              onClick={saveAttendance}
              disabled={!isEditable}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 transition-all hover:shadow-indigo-200"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>
      <br />

      <Card className="lg:col-span-2 shadow-sm border-slate-200 bg-white">
        <CardHeader className="pb-3 border-b border-slate-50">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-slate-500" />
            Attendance Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-auto">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full sm:w-48 font-medium border-slate-200 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search student..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 border-slate-200 focus:ring-indigo-500"
                />
              </div>


            </div>
          </div>
        </CardContent>
      </Card>
      <br />
      {/* Statistics Card */}
      <Card className="shadow-sm border-slate-200 bg-white">
        <CardHeader className="pb-3 border-b border-slate-50">
          <CardTitle className="text-base font-semibold text-slate-800">Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-5">
            <div className="flex justify-between items-center px-2">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-green-600">{stats.present}</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Present</span>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-red-600">{stats.absent}</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Absent</span>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-slate-700">{stats.total - stats.marked}</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Left</span>
              </div>
            </div>


          </div>
        </CardContent>
      </Card>

      <div className="sticky top-16 z-20 my-2 bg-white backdrop-blur pb-4 border-b ">
        <div className="px-1 space-y-2">

          {/* Top labels */}
          <div className="flex justify-between items-center text-[11px] text-slate-600 font-semibold tracking-wide">
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
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/80 border-b border-slate-200">
            <TableRow className="hover:bg-slate-50/80">
              <TableHead className="w-[80px] font-semibold text-slate-600">Roll</TableHead>
              <TableHead className="font-semibold text-slate-600">Student</TableHead>
              <TableHead className="w-[300px] font-semibold text-slate-600">Status</TableHead>
              <TableHead className="font-semibold text-slate-600">Comment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => {
              const status = attendance[student._id]?.status;
              return (
                <TableRow key={student._id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>{students.indexOf(student) + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-slate-100 bg-slate-50">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${students.indexOf(student)}`} />
                        <AvatarFallback className="text-slate-400"><User className="w-4 h-4" /></AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-900">{student.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 p-1 bg-slate-100/80 rounded-lg w-fit border border-slate-200/50">
                      <button
                        onClick={() => handleStatusChange(student._id, "Present")}
                        className={`
                            flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                            ${status === "Present"
                            ? "bg-white text-green-700 shadow-sm ring-1 ring-green-200/50"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}
                          `}
                      >
                        <CheckCircle2 className={`w-4 h-4 ${status === "Present" ? "fill-green-100" : ""}`} />
                        Present
                      </button>
                      <button
                        onClick={() => handleStatusChange(student._id, "Absent")}
                        className={`
                            flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                            ${status === "Absent"
                            ? "bg-white text-red-700 shadow-sm ring-1 ring-red-200/50"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}
                          `}
                      >
                        <XCircle className={`w-4 h-4 ${status === "Absent" ? "fill-red-100" : ""}`} />
                        Absent
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Add note..."
                      value={attendance[student._id]?.comment || ""}
                      onChange={(e) => handleCommentChange(student._id, e.target.value)}
                      className="h-9 bg-transparent border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white transition-all text-slate-600 placeholder:text-slate-400"
                    />
                  </TableCell>
                </TableRow>
              );
            })}

          </TableBody>
        </Table>
      </div>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {students.map((student) => {
          const status = attendance[student._id]?.status;
          return (
            <Card key={student._id} className={`overflow-hidden transition-all shadow-sm border-slate-200 ${status === 'Absent' ? 'border-l-4 border-l-red-500' : status === 'Present' ? 'border-l-4 border-l-green-500' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-slate-100 bg-slate-50">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${students.indexOf(student)}`} />
                      <AvatarFallback><User className="w-5 h-5 text-slate-400" /></AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-900">{student.name}</h3>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Roll No. {students.indexOf(student) + 1}</p>
                    </div>
                  </div>
                  {status && (
                    <Badge variant="outline" className={`${status === "Present" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                      {status}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Button
                    variant={status === "Present" ? "default" : "outline"}
                    size="sm"
                    className={`w-full justify-center ${status === "Present" ? "bg-green-600 hover:bg-green-700 border-green-600 shadow-sm" : "hover:bg-green-50 hover:text-green-700 hover:border-green-200 border-slate-200"}`}
                    onClick={() => handleStatusChange(student._id, "Present")}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Present
                  </Button>
                  <Button
                    variant={status === "Absent" ? "destructive" : "outline"}
                    size="sm"
                    className={`w-full justify-center ${status === "Absent" ? "bg-red-600 hover:bg-red-700 shadow-sm" : "hover:bg-red-50 hover:text-red-700 hover:border-red-200 border-slate-200"}`}
                    onClick={() => handleStatusChange(student._id, "Absent")}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Absent
                  </Button>
                </div>

                <Input
                  placeholder="Add a comment..."
                  value={attendance[student._id]?.comment || ""}
                  onChange={(e) => handleCommentChange(student._id, e.target.value)}
                  className="bg-slate-50 border-slate-200 focus:bg-white text-sm"
                />
              </CardContent>
            </Card>
          )
        })}

      </div>
    </main>
  );
}


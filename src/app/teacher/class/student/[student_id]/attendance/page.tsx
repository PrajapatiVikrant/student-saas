"use client";

import StudentDetail from "@/app/teacher/components/StudentDetail";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";

export default function AttendancePage() {
    const { student_id } = useParams();
    const router = useRouter();
    const [student,setStudent] = useState<any>({});
    const [attendanceData, setAttendanceData] = useState<any[]>([]);
    const [loadingAttendance, setLoadingAttendance] = useState(false);

    useEffect(() => {
        if (student_id) getAttendance();
    }, [student_id]);

    async function getAttendance() {
        const token = localStorage.getItem("teacherToken");
        console.log(token)

        try {
            setLoadingAttendance(true);
            const res = await axios.get(
                `http://localhost:4000/api/v1/attendance/student/${student_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setAttendanceData(res.data || []);
        } catch (error: any) {
            console.log("Error fetching attendance data:", error);
              handleAuthError(error);
        } finally {
            setLoadingAttendance(false);
        }
    }

    function handleAuthError(error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            toast.error("Session expired. Please log in again.");
            localStorage.removeItem("teacherToken");
            router.push("/teacher/login");
        } else {
            toast.error("Failed to fetch attendance data.");
        }
    }

    return (
        <div className="px-6 min-h-screen">
            <StudentDetail id={student_id} student={student} setStudent={setStudent} />

            {/* Tabs */}
            <div className="mt-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex gap-8 px-4">
                    <Link
                        href={`/teacher/class/student/${student_id}/performance`}
                        className="border-b-2 border-transparent py-3 text-sm font-medium text-slate-500"
                    >
                        Performance
                    </Link>

                    <Link
                        href={`/teacher/class/student/${student_id}/reportForm`}
                        className="border-b-2 border-transparent py-3 text-sm font-medium text-slate-500"
                    >
                        Add Report
                    </Link>

                    <Link
                        href={`/teacher/class/student/${student_id}/attendance`}
                        className="border-b-2 border-blue-600 py-3 text-sm font-semibold text-blue-600"
                    >
                        Attendance
                    </Link>
                </div>
            </div>

            {/* Attendance Chart */}
            <div className="mt-6">
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
                    <div className="bg-gray-50 p-4 rounded-xl shadow-md w-full">
                        <div className="w-full h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={attendanceData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
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
        </div>
    );
}

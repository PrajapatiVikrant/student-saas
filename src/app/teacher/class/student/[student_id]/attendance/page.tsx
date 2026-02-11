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
    const [student, setStudent] = useState<any>({});
    const [attendanceData, setAttendanceData] = useState<any[]>([]);
    const [loadingAttendance, setLoadingAttendance] = useState(false);

    useEffect(() => {
        if (student_id) getAttendance();
    }, [student_id]);

    async function getAttendance() {
        const token = localStorage.getItem("codeflam01_token");
        console.log(token)

        try {
            setLoadingAttendance(true);
            const res = await axios.get(
                `http://13.53.160.202/api/v1/attendance/student/${student_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setAttendanceData(res.data || []);
        } catch (error: any) {
            console.log("Error fetching attendance data:", error);
            const status = error?.response?.status;

            if (status === 401 || status === 403) {
                toast.error("Session expired. Please login again ❌");
                router.push("/teacher/login");
                return;
            }
            handleAuthError(error);
        } finally {
            setLoadingAttendance(false);
        }
    }

    function handleAuthError(error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            toast.error("Session expired. Please log in again.");
            localStorage.removeItem("codeflam01_token");
            router.push("/teacher/login");
        } else {
            toast.error("Failed to fetch attendance data.");
        }
    }

    return (
        <div className="px-4 sm:px-6 md:px-8 min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Student Detail */}
            <StudentDetail id={student_id} student={student} setStudent={setStudent} />

            {/* Tabs */}
            <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex gap-4 sm:gap-8 px-2 sm:px-4 overflow-x-auto">
                    <Link
                        href={`/teacher/class/student/${student_id}/performance`}
                        className="border-b-2 border-transparent py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        Performance
                    </Link>

                    <Link
                        href={`/teacher/class/student/${student_id}/reportForm`}
                        className="border-b-2 border-transparent py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        Add Report
                    </Link>

                    <Link
                        href={`/teacher/class/student/${student_id}/attendance`}
                        className="border-b-2 border-blue-600 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400"
                    >
                        Attendance
                    </Link>
                </div>
            </div>
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">
                    Monthly Attendance Report
                </h3>

                {loadingAttendance ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        Loading attendance...
                    </p>
                ) : attendanceData.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        No attendance data available
                    </p>
                ) : (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md w-full transition-colors overflow-x-auto">
                        {/* Dynamically calculate width based on number of months */}
                        <div
                            className={`h-[300px]`}
                            style={{
                                width: `${Math.max(attendanceData.length * 80, 300)}px`,
                            }}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={attendanceData} margin={{ right: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="month"
                                        stroke="#374151"
                                        tick={{ fill: "#374151" }}
                                    />
                                    <YAxis stroke="#374151" tick={{ fill: "#374151" }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#f9fafb",
                                            border: "1px solid #e5e7eb",
                                            color: "#000",
                                        }}
                                        cursor={{ fill: "#e5e7eb" }}
                                    />
                                    <Legend />
                                    <Bar dataKey="total" fill="#9ca3af" name="Total Classes" />
                                    <Bar dataKey="attended" fill="#3b82f6" name="Attended Classes" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>

            <br /><br />
        </div>

    );
}

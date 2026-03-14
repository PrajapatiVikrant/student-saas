"use client";

import Confirmation from "@/app/components/forms/Confirmation";
import StudentAdmission from "@/app/components/forms/StudentAdmission";
import EditStudent from "@/app/components/forms/StudentEdit";
import CircularIndeterminate from "@/app/components/ui/CircularIndeterminate";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiUserPlus, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

interface Student {
    _id: string;
    name: string;
    roll: string;
    class?: {
        name: string;
        class_id: string;
    };
    batch?: {
        name: string;
        batch_id: string;
    };
}

interface GetAllStudentResponse {
    class_name: string;
    batch_name: string;
    students: Student[];
}

export default function Students() {
    const [class_id, settclass_id] = useState<string>("");
    const [batch_id, setbatch_id] = useState<string>("");
    const [classData, setClassData] = useState({
        class_name: "",
        batch_name: "",
    });
    const [students, setStudents] = useState<Student[]>([]);
    const [registerForm, setRegisterForm] = useState(false);
    const [editForm, setEditForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [confirmationForm, setConfirmationForm] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchTeacherProfile();
    }, []);

    useEffect(() => {
        if (class_id && batch_id) {
            getBatchStudents();
        }
    }, [class_id, batch_id]);


    async function fetchTeacherProfile() {
        const token = localStorage.getItem("codeflam01_token");
        if (!token) return router.push("/teacher/login");

        try {
            const res = await axios.get(
                "/api/v1/teacher/profile",
                { headers: { Authorization: `Bearer ${token}` } }
            );


            const class_id = res.data.class_teacher.class_id._id;
            const batch_id = res.data.class_teacher.batch_id;
            settclass_id(class_id);
            setbatch_id(batch_id);


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



    async function getBatchStudents() {
        const token = localStorage.getItem("codeflam01_token");
        if (!token) {
            toast.error("Session expired. Please log in again.");
            router.push("/login");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get<GetAllStudentResponse>(
                `/api/v1/student/${class_id}/${batch_id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setClassData({
                class_name: response.data.class_name,
                batch_name: response.data.batch_name,
            });
            console.log("Fetched students:", response.data.students);
            setStudents(response.data.students);
        } catch (error: unknown) {
            const err = error as AxiosError;
            console.error("Error fetching students:", error);

            if (err.response?.status === 401 || err.response?.status === 403) {
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("codeflam01_token");
                router.push("/login");
            } else {
                toast.error("Failed to fetch students.");
            }
        } finally {
            setLoading(false);
        }
    }

    const onConfirm = async () => {
        setProcessing(true);
        const token = localStorage.getItem("codeflam01_token");
        try {
            const response = await axios.delete(
                `/api/v1/student/student/${selectedStudent?._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setConfirmationForm(false);
            getBatchStudents();
            toast.success(response.data.message);
        } catch (error: any) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("codeflam01_token");
            }
        } finally {
            setProcessing(false);
        }
    };








    if (loading) {
        return (
            <main className="flex flex-col h-screen justify-center items-center bg-slate-50 dark:bg-slate-950 text-black dark:text-white">
                <CircularIndeterminate size={80} />
                <span className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Loading...
                </span>
            </main>
        );
    }

    return (
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-black dark:text-white">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {classData.class_name} - {classData.batch_name}
                    </h1>

                    <button
                        onClick={() => setRegisterForm(true)}
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition"
                    >
                        <FiUserPlus className="h-4 w-4" />
                        <span>Add Student</span>
                    </button>
                </div>

               

                {/* Student Table */}
                <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-max table-auto">
                            <thead className="bg-slate-100 dark:bg-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                        Student Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                        Roll Number
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {students.length > 0 ? (
                                    students.map((student, index) => (
                                        <tr
                                            key={student._id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                                                {student.name}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                {index + 1}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <div className="flex items-center gap-4">



                                                    {/* Edit */}
                                                    <button
                                                        onClick={() => {
                                                            setSelectedStudent(student);
                                                            setEditForm(true);
                                                        }}
                                                        className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition"
                                                        title="Edit Student"
                                                    >
                                                        <FiEdit className="w-5 h-5" />
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={() => {
                                                            setSelectedStudent(student);
                                                            setConfirmationForm(true);
                                                        }}
                                                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition"
                                                        title="Delete Student"
                                                    >
                                                        <FiTrash2 className="w-5 h-5" />
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm"
                                        >
                                            No students available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Student Registration Modal */}
            {registerForm && (
                <StudentAdmission
                    class_name={classData.class_name}
                    classId={String(class_id)}
                    batch_name={classData.batch_name}
                    batchId={String(batch_id)}
                    setRegisterForm={setRegisterForm}
                    getStudent={getBatchStudents}
                    admisson={false}
                />
            )}
            {
                editForm && (
                    <EditStudent
                        studentId={selectedStudent?._id}
                        class_name={selectedStudent?.class?.name}
                        classId={selectedStudent?.class?.class_id}
                        batch_name={selectedStudent?.batch?.name}
                        batchId={selectedStudent?.batch?.batch_id}
                        setEditForm={setEditForm}
                        getStudent={getBatchStudents}
                    />
                )
            }
            {
                confirmationForm && (
                    <Confirmation
                        name={selectedStudent?.name}
                        info={`Are you sure you want to delete ${selectedStudent?.name}? This action cannot be undone.`}
                        onConfirm={onConfirm}
                        onClose={() => setConfirmationForm(false)}
                        processing={processing}
                    />
                )
            }
            <br /><br />
        </main>
    );
}

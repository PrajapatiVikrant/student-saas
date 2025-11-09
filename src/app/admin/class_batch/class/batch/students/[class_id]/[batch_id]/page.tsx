"use client";
import StudentAdmission from "@/app/components/forms/StudentAdmission";
import CircularIndeterminate from "@/app/components/ui/CircularIndeterminate";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiUserPlus, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

interface Student {
  _id: string;
  name: string;
  roll: string;
}

interface GetAllStudentResponse {
  class_name: string;
  batch_name: string;
  students: Student[];
}

export default function Students() {
  const { class_id, batch_id } = useParams();
  const [classData, setClassData] = useState({
    class_name: "",
    batch_name: "",
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [registerForm, setRegisterForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (class_id && batch_id) {
      getBatchStudents();
    }
  }, [class_id, batch_id]);

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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setClassData({
        class_name: response.data.class_name,
        batch_name: response.data.batch_name,
      });
      setStudents(response.data.students);
    } catch (error: any) {
      console.error("Error fetching students:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("adminToken");
        router.push("/login");
      } else {
        toast.error("Failed to fetch students.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="flex flex-col h-screen justify-center items-center">
        <CircularIndeterminate size={80} />
        <span>Loading...</span>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">
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

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-800">
          <div className="flex gap-8 px-4">
            <Link
              href={`/admin/class_batch/class/batch/students/${class_id}/${batch_id}`}
              className="border-b-2 border-blue-600 py-3 text-sm font-semibold text-blue-600"
            >
              Students
            </Link>
            <Link
              href={`/admin/class_batch/class/batch/attendance/${class_id}/${batch_id}`}
              className="border-b-2 border-transparent py-3 text-sm font-medium text-slate-500 dark:text-slate-400"
            >
              Attendance
            </Link>
            
          </div>
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
                    <tr key={student._id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                        {student.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {index + 1}
                      </td>


                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <div className="flex items-center gap-4">
                          {/* View Button */}
                          <Link
                            href={`/admin/student/${student._id}/${index + 1}`}
                            className="text-blue-600 hover:text-blue-800 transition"
                            title="View Student"
                          >
                            <FiEye className="w-5 h-5" />
                          </Link>

                        

                         
                        </div>
                      </td>


                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center text-gray-400 py-4 text-sm"
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
          admisson = {false}
        />

      )}
    </main>
  );
}

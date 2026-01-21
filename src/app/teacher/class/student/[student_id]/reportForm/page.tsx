"use client";

import StudentDetail from "@/app/teacher/components/StudentDetail";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type SubjectType = {
  _id: string;
  name: string;
};

export default function ReportForm() {
  const { student_id } = useParams();
  const router = useRouter();

  const [student, setStudent] = useState<any>({});
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [subject, setSubject] = useState<SubjectType | null>(null);
  const [testName, setTestName] = useState("");
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [processing, setProcessing] = useState(false);

  const [examData, setExamData] = useState<any[]>([]);
  const [loadingExam, setLoadingExam] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  /* ------------------ INIT ------------------ */
  useEffect(() => {
    teacherProfile();
    getExamData();
  }, []);

  /* ------------------ AUTH ERROR ------------------ */
  function handleAuthError(error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("codeflam01_token");
      router.push("/teacher/login");
    } else {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }

  /* ------------------ GET EXAMS ------------------ */
  async function getExamData() {
    const token = localStorage.getItem("codeflam01_token");
    if (!token) return;

    try {
      setLoadingExam(true);

      const res = await axios.get(
        `http://localhost:4000/api/v1/test/${student_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
     
    
      const fetched =
        res.data.data?.map((test: any) => ({
          id: test._id,
          exam: test.test_name,
          subject: {
            _id: test.subject?.id,
            name: test.subject?.name,
          },
          score: Number(test.score.obt_marks),
          feedback: test.feedback,
          added_by: test.added_by,
        })) || [];
      console.log("Fetched Exam Data:", fetched);
      setExamData(fetched);
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoadingExam(false);
    }
  }

  /* 📊 Group data subject-wise (SAFE) */
  const groupedData = useMemo(() => Object.values(
  examData.reduce((acc, item) => {
    const subjectId = item.subject._id;

    if (!acc[subjectId]) {
      acc[subjectId] = {
        subject: {
          _id: item.subject._id,
          name: item.subject.name,
        },
        exams: [],
      };
    }

    acc[subjectId].exams.push({
      id: item.id,
      exam: item.exam,
      score: item.score,
      feedback: item.feedback,
      added_by: item.added_by,
    });

    return acc;
  }, {})
), [examData]);
console.log("Grouped Data:", groupedData);

  /* ------------------ TEACHER PROFILE ------------------ */
  async function teacherProfile() {
    const token = localStorage.getItem("codeflam01_token");
    if (!token) return;

    try {
      const res = await axios.get(
        "http://localhost:4000/api/v1/teacher/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setTeacher(res.data);
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  }

  /* ------------------ VALIDATION ------------------ */
  function validateForm() {
    if (!student?.id) return toast.error("Student not loaded"), false;
    if (!subject) return toast.error("Please select subject"), false;
    if (!testName.trim()) return toast.error("Test name required"), false;
    if (!score || Number(score) < 0 || Number(score) > 100)
      return toast.error("Score must be 0–100"), false;
    return true;
  }

  /* ------------------ SUBMIT ------------------ */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setProcessing(true);
    const token = localStorage.getItem("codeflam01_token");

    try {
      const payload = {
        student: {
          student_id: student.id,
          student_name: student.name,
        },
        class_id: student.classId,
        batch_id: student.batchId,
        subject: {
          id:subject?._id,
          name:subject?.name,
        },
        test_name: testName,
        score: {
          max_marks: 100,
          obt_marks: Number(score),
        },
        feedback: feedback || "No feedback",
        added_by: {
          name: teacher.name,
          id: teacher._id,
        },
      };

      if (editId) {
        await axios.put(
          `http://localhost:4000/api/v1/test/${editId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Report updated");
      } else {
        await axios.post(
          "http://localhost:4000/api/v1/test",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Report added");
      }

      resetForm();
      getExamData();
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setProcessing(false);
    }
  }

  function resetForm() {
    setEditId(null);
    setSubject(null);
    setTestName("");
    setScore("");
    setFeedback("");
  }

  /* ------------------ EDIT ------------------ */
  function handleEdit(exam: any, subject: SubjectType) {
    setEditId(exam.id);
    setSubject(subject);
    setTestName(exam.exam);
    setScore(String(exam.score));
    setFeedback(exam.feedback || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ------------------ DELETE ------------------ */
  async function handleDelete(id: string) {
    const token = localStorage.getItem("codeflam01_token");
    if (!confirm("Delete this report?")) return;

    try {
      await axios.delete(
        `http://localhost:4000/api/v1/test/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Report deleted");
      getExamData();
    } catch (error: any) {
      handleAuthError(error);
    }
  }

  /* ------------------ UI ------------------ */
  return (
    <div className="px-6 min-h-screen">
      <StudentDetail id={student_id} student={student} setStudent={setStudent} />

      {/* Tabs */}
      <div className="border-b mt-6">
        <div className="flex gap-8 px-4">
          <Link
            href={`/teacher/class/student/${student_id}/performance`}
            className="py-3 text-sm text-slate-500"
          >
            Performance
          </Link>
          <span className="border-b-2 border-blue-600 py-3 text-sm font-semibold text-blue-600">
            Add Report
          </span>
          <Link
            href={`/teacher/class/student/${student_id}/attendance`}
            className="py-3 text-sm text-slate-500"
          >
            Attendance
          </Link>
        </div>
      </div>

      {/* FORM */}
      <div className="mt-6 w-[90%] rounded-xl border bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">
          {editId ? "Edit Report" : "Add Student Report"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={subject ? JSON.stringify(subject) : ""}
            onChange={(e) =>
              setSubject(e.target.value ? JSON.parse(e.target.value) : null)
            }
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="">Select Subject</option>
            {teacher?.subject?.map((s: any) => (
              <option
                key={s._id}
                value={JSON.stringify({ _id: s._id, name: s.name })}
              >
                {s.name}
              </option>
            ))}
          </select>

          <input
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Test Name"
          />

          <input
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Score"
          />

          <textarea
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Feedback"
          />

          <div className="flex justify-end gap-3">
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg bg-gray-400 px-4 py-2 text-white"
              >
                Cancel
              </button>
            )}
            <button
              disabled={processing}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              {processing
                ? "Saving..."
                : editId
                ? "Update Report"
                : "Add Report"}
            </button>
          </div>
        </form>
      </div>

      {/* EXAM LIST */}
      <div className="mt-10 w-[90%]">
        <h2 className="mb-4 text-lg font-semibold">Added Exam Reports</h2>

        {groupedData.map((group: any) => (
          <div key={group.subject._id} className="mb-6 border rounded-xl p-5 mt-6 overflow-x-auto w-full">
            <h3 className="mb-3 font-semibold text-blue-600">
              Subject: {group.subject.name}
            </h3>

            <table className="min-w-[800px]  w-full  border  border-gray-300 text-sm table-auto whitespace-nowrap">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border p-2">Test</th>
                  <th className="border p-2">Score</th>
                  <th className="border p-2">Feedback</th>
                  <th className="border p-2">Added By</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {group.exams.map((exam: any) => (
                  <tr key={exam.id}>
                    <td className="border p-2">{exam.exam}</td>
                    <td className="border p-2 font-semibold">
                      {exam.score}/100
                    </td>
                    <td className="border p-2">{exam.feedback}</td>
                    <td className="border p-2">
                      {exam.added_by?.name}
                    </td>
                    <td className="border p-2 space-x-2">
                      <button
                        onClick={() => handleEdit(exam, group.subject)}
                        className="bg-yellow-500 px-2 py-1 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exam.id)}
                        className="bg-red-600 px-2 py-1 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

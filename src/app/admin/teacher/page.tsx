"use client";

import Confirmation from "@/app/components/forms/Confirmation";
import CircularIndeterminate from "@/app/components/ui/CircularIndeterminate";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Search } from "lucide-react";

interface Subject {
  name: string;
}
interface ClassType {
  id: string;
  name: string;
}
interface BatchType {
  _id: string;
  batch_name: string;
}
interface ClassTeacher {
  class_id: string;
  batch_id: string;
}
interface Teacher {
  name: string;
  email: string;
  phone: string;
  class_teacher: ClassTeacher;
  subject: Subject[];
  classes: ClassType[];
  salary_type: "fixed" | "per_student" | "per_subject";
  salary_amount: number;
  date_joined: string;
  is_active: boolean;
}

export default function TeachersPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [formVisible, setFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [allClass, SetAllClass] = useState<any[]>([]);
  const [classList, setClassList] = useState<ClassType[]>([]);
  const [batchList, setBatchList] = useState<BatchType[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [salaryFilter, setSalaryFilter] = useState("all");

  // Form states
  const [teacherId, setTeacherId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [classTeacherClassId, setClassTeacherClassId] = useState("");
  const [classTeacherBatchId, setClassTeacherBatchId] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [salaryType, setSalaryType] = useState<
    "fixed" | "per_student" | "per_subject"
  >("fixed");
  const [salaryAmount, setSalaryAmount] = useState(0);
  const [dateJoined, setDateJoined] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isActive, setIsActive] = useState(true);

  const [confirmationForm, setConfirmationForm] = useState(false);
  const [subjectDeleteConfirm, setSubjectDeleteConfirm] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null);
  const [newSubject, setNewSubject] = useState("");
  const [newClass, setNewClass] = useState("");

  useEffect(() => {
    getAllClasses();
    getAllTeacher();
    //eslint-disable-next-line
  }, []);

  async function getAllClasses() {
    setLoading(true);
    try {
      const token = localStorage.getItem("codeflam01_token");
      if (!token) throw new Error("No token found. Please login again.");

      const response = await axios.get("/api/v1/kaksha", {
        headers: { Authorization: `Bearer ${token}` },
      });

      SetAllClass(response.data);
      setClassList(
        response.data.map((c: any) => ({
          id: c._id,
          name: c.class.name,
        }))
      );
    } catch (error: any) {
      sessionExpiryHandler(error);
      toast.error("Failed to load class list ❌");
    } finally {
      setLoading(false);
    }
  }

  async function getAllTeacher() {
    setLoading(true);
    try {
      const token = localStorage.getItem("codeflam01_token");
      if (!token) throw new Error("No token found. Please login again.");

      const teachers = await axios.get("/api/v1/teacher", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTeachers(teachers.data.teachers);
    } catch (error: any) {
      sessionExpiryHandler(error);
      toast.error("Failed to load teacher list ❌");
    } finally {
      setLoading(false);
    }
  }

  function sessionExpiryHandler(error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("codeflam01_token");
      router.push("/login");
    }
  }

  function handleSelectClassChange(selectedClass: string) {
    setClassTeacherClassId(selectedClass);
    const found = allClass.find((c: any) => c._id === selectedClass);
    setBatchList(found ? found.class.batches || [] : []);
  }

  function resetForm() {
    setTeacherId("");
    setName("");
    setEmail("");
    setPhone("");
    setClassTeacherClassId("");
    setClassTeacherBatchId("");
    setSubjects([]);
    setClasses([]);
    setSalaryType("fixed");
    setSalaryAmount(0);
    setDateJoined(new Date().toISOString().split("T")[0]);
    setIsActive(true);
    setNewClass("");
    setNewSubject("");
    setBatchList([]);
    setEditMode(false);
    setFormVisible(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const form: Teacher = {
      name,
      email,
      phone,
      class_teacher: {
        class_id: classTeacherClassId,
        batch_id: classTeacherBatchId,
      },
      subject: subjects,
      classes,
      salary_type: salaryType,
      salary_amount: salaryAmount,
      date_joined: dateJoined,
      is_active: isActive,
    };

    setProcessing(true);

    try {
      const token = localStorage.getItem("codeflam01_token");
      let response;

      if (editMode) {
        response = await axios.put(
          `/api/v1/teacher/${teacherId}`,
          form,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        response = await axios.post(
          "/api/v1/teacher",
          form,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      toast.success(response.data.message);
      getAllTeacher();
      resetForm();
    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Validation error ❌");
        return;
      }
      sessionExpiryHandler(error);
      toast.error("Failed to add/edit teacher ❌");
    } finally {
      setProcessing(false);
    }
  }

  function editTeacher(teacher: any) {
    setTeacherId(teacher._id);
    setName(teacher.name);
    setEmail(teacher.email);
    setPhone(teacher.phone);
    setClassTeacherClassId(teacher.class_teacher.class_id);
    setClassTeacherBatchId(teacher.class_teacher.batch_id);
    setSubjects(teacher.subject);
    setClasses(
      teacher.classes.map((c: any) => ({
        id: c.class_id,
        name: c.class_name,
      }))
    );
    setSalaryType(teacher.salary_type);
    setSalaryAmount(teacher.salary_amount);
    setDateJoined(teacher.date_joined.split("T")[0]);
    setIsActive(teacher.is_active);

    setEditMode(true);
    setFormVisible(true);

    handleSelectClassChange(teacher.class_teacher.class_id);
  }

  async function handleDelete(id: any) {
    setTeacherId(id);
    setConfirmationForm(true);
  }

  const onClose = () => setConfirmationForm(false);

  const onConfirm = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem("codeflam01_token");
      await axios.delete(`/api/v1/teacher/${teacherId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Teacher deleted successfully");
      getAllTeacher();
      resetForm();
    } catch (error: any) {
      toast.error("Failed to delete teacher ❌");
      sessionExpiryHandler(error);
    } finally {
      setProcessing(false);
      setConfirmationForm(false);
    }
  };

  const confirmSubjectDelete = () => {
  if (!subjectToDelete) return;

  setSubjects(subjects.filter((s) => s.name !== subjectToDelete));
  setSubjectToDelete(null);
  setSubjectDeleteConfirm(false);
   toast.success("Teacher deleted successfully");
};

  const deleteSubject = (name: string) => {
    // Create mode → direct delete
    if (!editMode) {
      setSubjects(subjects.filter((s) => s.name !== name));
      return;
    }

    // Edit mode → show confirmation first
    setSubjectToDelete(name);
    setSubjectDeleteConfirm(true);
  };

  const deleteClass = (id: string) =>
    setClasses(classes.filter((c) => c.id !== id));

  // Filtered Teachers
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t: any) => {
      const matchSearch =
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject?.some((s: any) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
            ? t.is_active === true
            : t.is_active === false;

      const matchSalary =
        salaryFilter === "all" ? true : t.salary_type === salaryFilter;

      return matchSearch && matchStatus && matchSalary;
    });
  }, [teachers, searchTerm, statusFilter, salaryFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-gray-900 dark:text-white  p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">
          Teacher Management
        </h1>

        {/* Top Controls */}
        <div className="bg-white dark:bg-slate-800 dark:border-slate-700 border-b rounded-xl shadow-md p-4 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg cursor-pointer font-semibold"
            onClick={() => {
              resetForm();
              setFormVisible(true);
            }}
          >
            + Create Teacher
          </button>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-[260px]">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search teacher..."
                className="w-full pl-10 pr-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-3 py-2 rounded-lg cursor-pointer outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Salary Filter */}
            <select
              value={salaryFilter}
              onChange={(e) => setSalaryFilter(e.target.value)}
              className="border px-3 py-2 rounded-lg cursor-pointer outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="all">All Salary</option>
              <option value="fixed">Fixed</option>
              <option value="per_student">Per Student</option>
              <option value="per_subject">Per Subject</option>
            </select>
          </div>
        </div>

        {/* Teachers List */}
        {loading ? (
          <div className="flex justify-center py-10">
            <CircularIndeterminate size={40} />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTeachers.map((t: any) => (
              <div
                key={t._id}
                className="bg-white dark:bg-slate-800 dark:border dark:border-slate-700 rounded-2xl shadow-md p-5 hover:shadow-lg transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-gray-200">
                      {t.name}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-gray-400">{t.phone}</p>
                    <p className="text-sm text-slate-500 dark:text-gray-400">{t.email}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${t.is_active
                      ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
                      : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300"
                      }`}
                  >
                    {t.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="mt-4 text-sm space-y-2">
                  <p className="text-slate-700 dark:text-gray-200">
                    <span className="font-semibold">Class Teacher:</span>{" "}
                    {classList.find((c) => c.id === t.class_teacher.class_id)?.name || "N/A"}
                  </p>

                  <p className="text-slate-700 dark:text-gray-200">
                    <span className="font-semibold">Salary:</span> {t.salary_type} - ₹{t.salary_amount}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Joined: {t.date_joined?.split("T")[0]}
                  </p>

                  {/* Subjects */}
                  <div>
                    <p className="font-semibold text-slate-700 dark:text-gray-200">Subjects:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {t.subject?.length > 0 ? (
                        t.subject.map((s: any) => (
                          <span
                            key={s.name}
                            className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300 text-xs rounded-full"
                          >
                            {s.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 dark:text-gray-400 text-xs">No Subjects</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Assigned Classes */}
                <div className="mt-3">
                  <p className="font-semibold text-slate-700 dark:text-gray-200">Assigned Classes:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {t.classes?.length > 0 ? (
                      t.classes.map((cls: any, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300 text-xs rounded-full"
                        >
                          {cls.class_name || cls.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 dark:text-gray-400 text-xs">No Classes Assigned</span>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-5">
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-2 rounded-lg cursor-pointer font-semibold"
                    onClick={() => editTeacher(t)}
                  >
                    Edit
                  </button>

                  <button
                    className="w-full bg-red-600 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600 text-white py-2 rounded-lg cursor-pointer font-semibold"
                    disabled={processing}
                    onClick={() => handleDelete(t._id)}
                  >
                    {processing ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>

            ))}

            {filteredTeachers.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-500 font-medium">
                No teachers found.
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===================== FORM POPUP DIALOG ===================== */}
      {formVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 px-3">

          <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-xl shadow-lg relative overflow-hidden border border-gray-200 dark:border-gray-700">

            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {editMode ? "Update Teacher" : "Create Teacher"}
              </h2>
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-500 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-2xl font-bold cursor-pointer transition"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[80vh] overflow-y-auto p-6">
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-5 text-gray-700 dark:text-gray-300"
              >

                <div className="md:col-span-2">
                  <label className="font-medium">Full Name</label>
                  <input
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="font-medium">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="font-medium">Class Teacher - Class</label>
                  <select
                    value={classTeacherClassId}
                    onChange={(e) => handleSelectClassChange(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded mt-1 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Class</option>
                    {classList.map((c) => (
                      <option value={c.id} key={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-medium">Class Teacher - Batch</label>
                  <select
                    value={classTeacherBatchId}
                    onChange={(e) => setClassTeacherBatchId(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded mt-1 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Batch</option>
                    {batchList.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.batch_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subjects */}
                <div className="md:col-span-2">
                  <label className="font-medium">Subjects</label>

                  <div className="flex gap-2 mt-2 flex-wrap">
                    {subjects.map((s) => (
                      <span
                        key={s.name}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full flex items-center gap-2"
                      >
                        {s.name}
                        <button
                          type="button"
                          onClick={() => deleteSubject(s.name)}
                          className="text-red-600 dark:text-red-400 font-bold cursor-pointer hover:text-red-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex mt-3 gap-3">
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter subject"
                    />
                    <button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 rounded transition"
                      onClick={() => {
                        if (!newSubject.trim()) return;
                        if (subjects.some((s) => s.name === newSubject))
                          return alert("Subject already added");

                        setSubjects([...subjects, { name: newSubject }]);
                        setNewSubject("");
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>



                {/* Assigned Classes */}
                <div className="md:col-span-2">
                  <label className="font-medium">Assigned Classes</label>

                  {/* Selected Classes */}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {classes.map((cls) => (
                      <span
                        key={cls.id}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full flex items-center gap-2"
                      >
                        {cls.name}
                        <button
                          type="button"
                          onClick={() => deleteClass(cls.id)}
                          className="text-red-600 dark:text-red-400 font-bold cursor-pointer hover:text-red-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add Class */}
                  <div className="flex mt-3 gap-3">
                    <select
                      value={newClass}
                      onChange={(e) => setNewClass(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Class</option>
                      {classList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="bg-green-600 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600 text-white px-6 rounded transition"
                      onClick={() => {
                        if (!newClass) return;

                        const selected = classList.find((c) => c.id === newClass);
                        if (!selected) return;

                        if (classes.some((c) => c.id === selected.id)) {
                          alert("Class already added");
                          return;
                        }

                        setClasses([...classes, selected]);
                        setNewClass("");
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Salary */}
                <div>
                  <label className="font-medium">Salary Type</label>
                  <select
                    name="salary_type"
                    value={salaryType}
                    onChange={(e) => setSalaryType(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded cursor-pointer"
                  >
                    <option value="fixed">Fixed</option>
                    <option value="per_student">Per Student</option>
                    <option value="per_subject">Per Subject</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium">Salary Amount</label>
                  <input
                    type="number"
                    value={salaryAmount}
                    onChange={(e) => setSalaryAmount(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded"
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className="font-medium">Date Joined</label>
                  <input
                    type="date"
                    value={dateJoined}
                    onChange={(e) => setDateJoined(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded"
                  />
                </div>

                <div>
                  <label className="font-medium">Status</label>
                  <select
                    value={String(isActive)}
                    onChange={(e) => setIsActive(e.target.value === "true")}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded cursor-pointer"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <button
                    disabled={processing}
                    type="submit"
                    className={`w-full flex gap-3 justify-center items-center py-2 ${processing
                      ? "bg-blue-300 cursor-progress"
                      : "bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                      } text-white rounded transition`}
                  >
                    {processing && <CircularIndeterminate size={15} />}
                    {editMode ? "Update Teacher" : "Save Teacher"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- Confirmation Modal --- */}
      {confirmationForm && (
        <Confirmation
          onClose={onClose}
          onConfirm={onConfirm}
          name={name}
          info="This action cannot be undone and will permanently remove all related records including academic, attendance, and payment data associated with this teacher."
          processing={processing}
        />
      )}
      {subjectDeleteConfirm && (
        <Confirmation
          onClose={() => {
            setSubjectDeleteConfirm(false);
            setSubjectToDelete(null);
          }}
          onConfirm={confirmSubjectDelete}
          name={subjectToDelete || ""}
          info="This action cannot be undone and will permanently remove all related test/exam records associated with this subject."
          processing={false}
        />
      )}
      <br /><br />
    </div>
  );
}

"use client";
import CircularIndeterminate from "@/app/components/ui/CircularIndeterminate";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Subject { name: string; }
interface ClassType { id: string; name: string; }
interface BatchType { _id: string; batch_name: string; }
interface ClassTeacher { class_id: string; batch_id: string; }
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
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // Form states
  const [teacherId, setTeacherId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [classTeacherClassId, setClassTeacherClassId] = useState("");
  const [classTeacherBatchId, setClassTeacherBatchId] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [salaryType, setSalaryType] = useState<"fixed" | "per_student" | "per_subject">("fixed");
  const [salaryAmount, setSalaryAmount] = useState(0);
  const [dateJoined, setDateJoined] = useState(new Date().toISOString().split("T")[0]);
  const [isActive, setIsActive] = useState(true);

  const [newSubject, setNewSubject] = useState("");
  const [newClass, setNewClass] = useState("");

  // Data fetching
  useEffect(() => {
    getAllClasses();
    getAllTeacher();
    //eslint-disable-next-line
  }, []);

  async function getAllClasses() {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No token found. Please login again.");
      const response = await axios.get("http://localhost:4000/api/v1/kaksha", {
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
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No token found. Please login again.");
      const teachers = await axios.get("http://localhost:4000/api/v1/teacher", {
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
      localStorage.removeItem("adminToken");
      router.push("/login");
    }
  }

  function handleSelectClassChange(selectedClass: string) {
    setClassTeacherClassId(selectedClass);
    const found = allClass.find((c: any) => c._id === selectedClass);
    setBatchList(found ? found.class.batches || [] : []);
    
  }

  function resetForm() {
    setTeacherId(""); setName(""); setEmail(""); setPhone("");
    setClassTeacherClassId(""); setClassTeacherBatchId("");
    setSubjects([]); setClasses([]);
    setSalaryType("fixed"); setSalaryAmount(0);
    setDateJoined(new Date().toISOString().split("T")[0]);
    setIsActive(true); setNewClass(""); setNewSubject(""); setBatchList([]);
    setEditMode(false);
    setFormVisible(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
   
    const form: Teacher = {
     
      name, email, phone,
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
    console.log("updated data : ", form)
    setProcessing(true);
    try {
      const token = localStorage.getItem("adminToken");
      let response;
      if (editMode) {
     
        response = await axios.put(`http://localhost:4000/api/v1/teacher/${teacherId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });

      } else {
        response = await axios.post("http://localhost:4000/api/v1/teacher", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
       console.log(response)
      }
      toast.success(response.data.message);
      getAllTeacher();
      resetForm();
   } catch (error: any) {
      sessionExpiryHandler(error);
      toast.error("Failed to add/edit teacher ❌");
    } finally {
      setProcessing(false);
    }
  }

  function editTeacher(teacher: any) {
    console.log(teacher)
    setTeacherId(teacher._id);
    setName(teacher.name);
    setEmail(teacher.email);
    setPhone(teacher.phone);
    setClassTeacherClassId(teacher.class_teacher.class_id);
    setClassTeacherBatchId(teacher.class_teacher.batch_id);
   
    setSubjects(teacher.subject);
    setClasses(teacher.classes.map((c:any)=>({id:c.class_id,name:c.class_name})));
    setSalaryType(teacher.salary_type);
    setSalaryAmount(teacher.salary_amount);
    setDateJoined(teacher.date_joined.split("T")[0]);
    setIsActive(teacher.is_active);
    setEditMode(true);
    setFormVisible(true);
    // Ensure batchList and dropdowns update instantly
    handleSelectClassChange(teacher.class_teacher.class_id);
  }

  async function handleDelete(id:any) {
   
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    setProcessing(true);
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:4000/api/v1/teacher/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Teacher deleted successfully");
      getAllTeacher();
      resetForm();
    } catch (error: any) {
      console.log(error)
      toast.error("Failed to delete teacher ❌");
      sessionExpiryHandler(error);
    } finally {
      setProcessing(false);
    }
  }

  const deleteSubject = (name: string) => setSubjects(subjects.filter((s) => s.name !== name));
  const deleteClass = (id: string) => setClasses(classes.filter((c) => c.id !== id));

  // UI
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Teacher Management</h1>
      <div className="mb-6">
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
          onClick={() => {
            resetForm();
            setFormVisible(true);
          }}>
          Create Teacher
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <CircularIndeterminate size={36} />
        </div>
      ) : (
        <>
          {formVisible && (
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 mb-12 rounded-xl shadow-md grid grid-cols-2 gap-5 relative"
            >
              <button type="button"
                className="absolute top-2 right-2 bg-gray-200 rounded px-2 text-xl cursor-pointer hover:bg-gray-300"
                onClick={resetForm}>×</button>
              <div className="col-span-2">
                <label className="font-medium">Full Name</label>
                <input name="name" value={name} onChange={e => setName(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                  placeholder="Enter full name" required />
              </div>
              <div>
                <label className="font-medium">Email</label>
                <input type="email" name="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2 border rounded mt-1" placeholder="Enter email" />
              </div>
              <div>
                <label className="font-medium">Phone</label>
                <input type="tel" name="phone" value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-2 border rounded mt-1" placeholder="Enter phone number" />
              </div>
              <div>
                <label className="font-medium">Class Teacher - Class</label>
                <select value={classTeacherClassId}
                  onChange={e => handleSelectClassChange(e.target.value)}
                  className="w-full p-2 border rounded mt-1 cursor-pointer">
                  <option value="">Select Class</option>
                  {classList.map(c =>
                    <option value={c.id} key={c.id}>{c.name}</option>
                  )}
                </select>
              </div>
              <div>
                <label className="font-medium">Class Teacher - Batch</label>
                <select value={classTeacherBatchId}
                  onChange={e => setClassTeacherBatchId(e.target.value)}
                  className="w-full p-2 border rounded mt-1 cursor-pointer">
                  <option value="">Select Batch</option>
                  {batchList.map((b) =>
                    <option key={b._id} value={b._id}>{b.batch_name}</option>
                  )}
                </select>
              </div>
              <div className="col-span-2">
                <label className="font-medium">Subjects</label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {subjects.map(s => (
                    <span key={s.name}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2">
                      {s.name}
                      <button type="button" onClick={() => deleteSubject(s.name)}
                        className="text-red-600 font-bold cursor-pointer hover:text-red-800">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex mt-3 gap-3">
                  <input type="text" value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    className="w-full p-2 border rounded" placeholder="Enter subject" />
                  <button
                    type="button"
                    className="bg-blue-600 cursor-pointer hover:bg-blue-400 text-white px-6 rounded"
                    onClick={() => {
                      if (!newSubject.trim()) return;
                      if (subjects.some((s) => s.name === newSubject)) return alert("Subject already added");
                      setSubjects([...subjects, { name: newSubject }]);
                      setNewSubject("");
                    }}>Add</button>
                </div>
              </div>
              <div className="col-span-2">
                <label className="font-medium">Classes</label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {classes.map((c:any) => (
                    <span key={c.id}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-2">
                      {c.name}
                      <button type="button" onClick={() => deleteClass(c.id)}
                        className="text-red-600 font-bold cursor-pointer hover:text-red-800">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex mt-3 gap-3">
                  <select value={newClass}
                    onChange={e => setNewClass(e.target.value)}
                    className="p-2 border rounded w-full cursor-pointer">
                    <option value="">Select Class</option>
                    {classList.map(c =>
                      <option value={c.id} key={c.id}>{c.name}</option>
                    )}
                  </select>
                  <button
                    type="button"
                    className="bg-green-600 cursor-pointer hover:bg-green-400 text-white px-6 rounded"
                    onClick={() => {
                      if (!newClass) return;
                      if (classes.some((c) => c.id === newClass)) return alert("Class already added");
                      const selectedClass = classList.find((c) => c.id === newClass);
                      if (!selectedClass) return;
                     
                      setClasses([...classes, { id: selectedClass.id, name: selectedClass.name }]);
                      setNewClass("");
                    }}>Add</button>
                </div>
              </div>
              <div>
                <label className="font-medium">Salary Type</label>
                <select name="salary_type"
                  value={salaryType}
                  onChange={e => setSalaryType(e.target.value as any)}
                  className="w-full p-2 border rounded cursor-pointer">
                  <option value="fixed">Fixed</option>
                  <option value="per_student">Per Student</option>
                  <option value="per_subject">Per Subject</option>
                </select>
              </div>
              <div>
                <label className="font-medium">Salary Amount</label>
                <input
                  name="salary_amount"
                  type="number"
                  value={salaryAmount}
                  onChange={e => setSalaryAmount(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="font-medium">Date Joined</label>
                <input
                  name="date_joined"
                  type="date"
                  value={dateJoined}
                  onChange={e => setDateJoined(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="font-medium">Status</label>
                <select
                  name="is_active"
                  value={String(isActive)}
                  onChange={e => setIsActive(e.target.value === "true")}
                  className="w-full p-2 border rounded cursor-pointer"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="col-span-2">
                <button
                  disabled={processing}
                  type="submit"
                  className={`w-full flex gap-3.5 justify-center items-center py-2 ${
                    processing ? "bg-blue-300 cursor-progress" : "bg-blue-700"
                  } cursor-pointer text-white rounded `}>
                  {processing && <CircularIndeterminate size={15} />} {editMode ? "Update Teacher" : "Save Teacher"}
                </button>
              </div>
            </form>
          )}
          {/* Teachers Table */}
          <div className="mt-6 overflow-x-auto w-full">
            <h2 className="text-lg font-semibold mb-2">All Teachers</h2>
            <table className="min-w-[800px]  w-full  border  border-gray-300 text-sm table-auto whitespace-nowrap">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Phone</th>
                  <th className="border p-2">Class Teacher</th>
                  <th className="border p-2">Subjects</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t:any) => (
                  <tr key={t._id} className="text-center hover:bg-gray-50">
                    <td className="border p-2">{t.name}</td>
                    <td className="border p-2">{t.phone}</td>
                    <td className="border p-2">{classList.find(c => c.id === t.class_teacher.class_id)?.name || "N/A"}</td>
                    <td className="border p-2">{t.subject.map((s:any) => s.name).join(", ")}</td>
                    <td className="border p-2">
                      {t.is_active
                        ? <span className="text-green-600 font-semibold">Active</span>
                        : <span className="text-red-600 font-semibold">Inactive</span>}
                    </td>
                    <td className="border p-2">
                      <button
                        className="text-blue-600 mr-3 cursor-pointer hover:text-blue-800 hover:underline"
                        onClick={() => editTeacher(t)}
                      >Edit</button>
                      <button
                        className="text-red-600 cursor-pointer hover:text-red-800 hover:underline"
                        disabled={processing}
                        onClick={() => handleDelete(t._id)}
                      >{processing ? 'Deleting...' : 'Delete'}</button>
                    </td>
                  </tr>
                ))}
                {teachers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center p-5 text-gray-500">
                      No teachers added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )
      }
    </div>
  );
}

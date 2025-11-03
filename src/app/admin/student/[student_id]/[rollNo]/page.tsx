"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import PersonalInfo from "./PersonalInfo";
import AcademicInfo from "./AcademicInfo";
import PaymentInfo from "./PaymentInfo";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import CircularIndeterminate from "@/app/components/ui/CircularIndeterminate";
import EditStudent from "@/app/components/forms/StudentEdit";
import Confirmation from "@/app/components/forms/Confirmation";

export default function StudentDetailsPage() {
  const { student_id } = useParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"personal" | "academic" | "payment">("personal");
  const [confirmationForm, setConfirmationForm] = useState(false);
  const [editForm, setEditForm] = useState(false); // ✅ added for Edit form
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>({});

  useEffect(() => {
    getStudent();
  }, []);

  async function getStudent() {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await axios.get(`http://localhost:4000/api/v1/student/student/${student_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      console.log('getstudent',data.class)

      setStudent({
        id: data._id,
        profile_picture: data.profile_picture || "https://images.pexels.com/photos/6345317/pexels-photo-6345317.jpeg",
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        gender: data.gender,
        admissionDate: data.admissionDate,
        class_name: data.class?.name || "N/A",
        classId: data.class?.class_id || "",
        batch_name: data.batch?.name || "N/A",
        batchId: data.batch?.batch_id || "",
      });
    } catch (error: any) {
      console.error("Error fetching student:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("adminToken");
        router.push("/login");
      } else {
        toast.error("Failed to fetch student.");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = () => {
    setEditForm(true); // ✅ open Edit form
  };

  const handleDelete = () => {
    setConfirmationForm(true);
  };

  const onClose = () => {
    setConfirmationForm(false);
  };

  const onConfirm = async()=>{
     const token = localStorage.getItem("adminToken");
      try {
        const response = await axios.delete(`http://localhost:4000/api/v1/student/student/${student_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        
      });
      
          router.push(`/admin/class_batch/class/batch/students/${student.classId}/${student.batchId}`)
          toast.success(response.data.message)
     
      } catch (error:any) {
         if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("adminToken");
        router.push("/login");
      }
    }finally{
        setProcessing(false)
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
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-6 relative">
          {/* --- Top Action Buttons --- */}
          <div className="absolute top-4 right-4 flex gap-3">
            <button
              onClick={handleEdit}
              className="flex items-center cursor-pointer gap-2 bg-blue-100 text-blue-700 border border-blue-300 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-all shadow-sm"
            >
              <FiEdit2 size={16} />
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center cursor-pointer gap-2 bg-red-100 text-red-700 border border-red-300 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-all shadow-sm"
            >
              <FiTrash2 size={16} />
              Delete
            </button>
          </div>

          {/* --- Student Profile --- */}
          <div className="flex flex-col items-center mb-6 mt-8">
            <Image
              src={student.profile_picture}
              alt={student.name}
              width={160}
              height={160}
              className="rounded-full object-cover shadow-md"
            />
            <h1 className="text-2xl font-bold mt-3">{student.name}</h1>
            <p className="text-gray-500">
              {student.class_name} - {student.batch_name}
            </p>
          </div>

          {/* --- Tabs --- */}
          <div className="flex justify-center gap-4 mb-6">
            {["personal", "academic", "payment"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-5 py-2 rounded-full cursor-pointer text-sm font-semibold transition-all ${
                  activeTab === tab ? "bg-blue-600 text-white shadow" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {tab === "personal" && "Personal Info"}
                {tab === "academic" && "Academic Info"}
                {tab === "payment" && "Payment Info"}
              </button>
            ))}
          </div>

          {/* --- Tab Content --- */}
          {activeTab === "personal" && <PersonalInfo student={student} />}
          {activeTab === "academic" && <AcademicInfo />}
          {activeTab === "payment" && <PaymentInfo />}
        </div>
      </div>

      {/* --- Edit Student Modal --- */}
      {editForm && (
        <EditStudent
          studentId={student.id}
          class_name={student.class_name}
          classId={student.classId}
          batch_name={student.batch_name}
          batchId={student.batchId}
          setEditForm={setEditForm}
          getStudent={getStudent}
        />
      )}

      {/* --- Confirmation Modal --- */}
      {confirmationForm && (
        <Confirmation
          onClose={onClose}
          onConfirm={onConfirm}
          studentName={student.name}
          processing={processing}
        />
      )}
    </>
  );
}

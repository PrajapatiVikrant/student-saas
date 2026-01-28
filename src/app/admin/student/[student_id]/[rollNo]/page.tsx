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

  const [activeTab, setActiveTab] = useState<
    "personal" | "academic" | "payment"
  >("personal");
  const [confirmationForm, setConfirmationForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>({});

  useEffect(() => {
    getStudent();
  }, []);

  async function getStudent() {
    const token = localStorage.getItem("codeflam01_token");
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/student/student/${student_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      setStudent({
        id: data._id,
        profile_picture:
          data.profile_picture ||
          "https://images.pexels.com/photos/6345317/pexels-photo-6345317.jpeg",
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
        localStorage.removeItem("codeflam01_token");
        router.push("/login");
      } else {
        toast.error("Failed to fetch student.");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = () => setEditForm(true);
  const handleDelete = () => setConfirmationForm(true);
  const onClose = () => setConfirmationForm(false);

  const onConfirm = async () => {
    const token = localStorage.getItem("codeflam01_token");
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/v1/student/student/${student_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.push(
        `/admin/class_batch/class/batch/students/${student.classId}/${student.batchId}`
      );
      toast.success(response.data.message);
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
       
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("codeflam01_token");
        //router.push("/login");
      }
    } finally {
      setProcessing(false);
    }
  };

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
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-4 sm:p-6 relative">
          {/* --- Top Action Buttons --- */}
          <div className="absolute top-4 right-4 flex flex-wrap gap-3">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-blue-100 text-blue-700 border border-blue-300 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-all shadow-sm"
            >
              <FiEdit2 size={16} />
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-100 text-red-700 border border-red-300 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-all shadow-sm"
            >
              <FiTrash2 size={16} />
              Delete
            </button>
          </div>
          <br /><br />

          {/* --- Student Profile --- */}
          <div className="flex flex-col items-center mb-6 mt-10">
            <div className="w-28 h-28 rounded-full overflow-hidden shadow-md">
              <Image
                src={student.profile_picture}
                alt="Student"
                width={120}
                height={120}
                className="object-cover w-full h-full"
              />
            </div>
            <h1 className="text-2xl font-bold mt-3">{student.name}</h1>
            <p className="text-gray-500">
              {student.class_name} - {student.batch_name}
            </p>
          </div>

          {/* --- Tabs (Responsive + Attractive) --- */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 border-b border-gray-200">
            {[
              { key: "personal", label: "Personal Info" },
              { key: "academic", label: "Academic Info" },
              { key: "payment", label: "Payment Info" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`relative px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-300 rounded-md 
                  ${
                    activeTab === tab.key
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-500 hover:bg-gray-100"
                  }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-t-md transition-all duration-300"></span>
                )}
              </button>
            ))}
          </div>

          {/* --- Tab Content --- */}
          <div className="mt-4">
            {activeTab === "personal" && <PersonalInfo student={student} />}
            {activeTab === "academic" && <AcademicInfo student={student} />}
            {activeTab === "payment" && <PaymentInfo student = {student} />}
          </div>
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
          name={student.name}
          info="This action cannot be undone and will permanently remove all related records including 
            academic, attendance, and payment data associated with this student."
          processing={processing}
        />
      )}
    </>
  );
}

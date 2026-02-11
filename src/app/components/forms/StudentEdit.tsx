"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";

interface EditStudentProps {
  studentId: string;
  class_name: string;
  classId: string | string[];
  batch_name: string;
  batchId: string | string[];
  setEditForm: (value: boolean) => void;
  getStudent: () => void;
}

export default function EditStudent({
  studentId,
  class_name,
  classId,
  batch_name,
  batchId,
  setEditForm,
  getStudent,
}: EditStudentProps) {
  // Student states
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [paymentDate, setPaymentDate] = useState(0);
  const [studentFee, setStudentFee] = useState(0);

  // ✅ Parent Info states (optional)
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");

  const [processing, setProcessing] = useState(false);

  const router = useRouter();
  const kaksha = { class_name, classId };
  const batch = { batch_name, batchId };

  // Error states
  const [nameError, setNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [admissionDateError, setAdmissionDateError] = useState("");
  const [paymentDateError, setPaymentDateError] = useState("");
  const [studentFeeError, setStudentFeeError] = useState("");

  // Optional parent errors
  const [parentPhoneError, setParentPhoneError] = useState("");
  const [parentEmailError, setParentEmailError] = useState("");

  // ✅ Fetch existing student
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem("codeflam01_token");
        const response = await axios.get(
          `/api/v1/student/student/${studentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const student = response.data;
        setName(student.name || "");
        setAddress(student.address || "");
        setGender(student.gender || "");
        setAdmissionDate(student.admissionDate?.split("T")[0] || "");
        setPaymentDate(student.payment_date || 0);
        setStudentFee(student.batch.fee || 0);

        // ✅ Set parent info if exists
        setFatherName(student.parentInfo?.fatherName || "");
        setMotherName(student.parentInfo?.motherName || "");
        setParentPhone(student.parentInfo?.parentPhone || "");
        setParentEmail(student.parentInfo?.parentEmail || "");
      } catch (error) {
        console.error(error);
        toast.error("Failed to load student data ❌");
      }
    };

    if (studentId) fetchStudent();
  }, [studentId]);

  // ✅ Validation
  const validate = () => {
    let isValid = true;

    if (!name.trim()) { setNameError("Full Name is required"); isValid = false; } else setNameError("");
    if (!address.trim()) { setAddressError("Address is required"); isValid = false; } else setAddressError("");
    if (!gender) { setGenderError("Gender is required"); isValid = false; } else setGenderError("");
    if (!admissionDate) { setAdmissionDateError("Admission date is required"); isValid = false; } else setAdmissionDateError("");
    if (studentFee <= 0) { setStudentFeeError("Student fee must be greater than zero"); isValid = false; } else setStudentFeeError("");
    if (paymentDate <= 0 || paymentDate > 31) { setPaymentDateError("Payment date must be between 1 and 31"); isValid = false; } else setPaymentDateError("");

    // Optional Parent Phone
    if (parentPhone.trim()) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(parentPhone)) { setParentPhoneError("Enter valid 10-digit phone number"); isValid = false; } 
      else setParentPhoneError("");
    } else setParentPhoneError("");

    // Optional Parent Email
    if (parentEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(parentEmail)) { setParentEmailError("Enter valid email address"); isValid = false; }
      else setParentEmailError("");
    } else setParentEmailError("");

    return isValid;
  };

  // ✅ Update student
  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const token = localStorage.getItem("codeflam01_token");
      setProcessing(true);

      const updatedData = {
        name,
        address,
        gender,
        kaksha: { name: kaksha.class_name, class_id: kaksha.classId },
        batch: { name: batch.batch_name, batch_id: batch.batchId },
        admissionDate,
        paymentDate,
        studentFee,
        parentInfo: { fatherName, motherName, parentPhone, parentEmail },
      };

      const response = await axios.put(
        `/api/v1/student/${studentId}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message || "Student updated successfully ✅");
      setEditForm(false);
      getStudent();
    } catch (error: any) {
      console.error("Error updating student:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("codeflam01_token");
        router.push("/login");
      } else {
        toast.error("Failed to update student ❌");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start overflow-y-auto px-3 py-8">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex-shrink-0">
          <h2 className="text-lg font-bold text-white">Edit Student Details</h2>
          <button className="text-white hover:bg-white/20 p-2 rounded-lg transition" onClick={() => setEditForm(false)}>
            <RxCross2 size={22} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form className="space-y-6" onSubmit={handleUpdate}>

            {/* Student Info */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">Student Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter student name"
                    className={`mt-1 w-full border px-3 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition ${nameError ? "border-red-500" : "border-gray-300"}`} />
                  {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
                  <select value={gender} onChange={(e) => setGender(e.target.value)}
                    className={`mt-1 w-full border px-3 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition ${genderError ? "border-red-500" : "border-gray-300"}`}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {genderError && <p className="text-red-500 text-xs mt-1">{genderError}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter student address"
                    className={`mt-1 w-full border px-3 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition ${addressError ? "border-red-500" : "border-gray-300"}`} />
                  {addressError && <p className="text-red-500 text-xs mt-1">{addressError}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Admission Date <span className="text-red-500">*</span></label>
                  <input type="date" value={admissionDate} onChange={(e) => setAdmissionDate(e.target.value)}
                    className={`mt-1 w-full border px-3 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition ${admissionDateError ? "border-red-500" : "border-gray-300"}`} />
                  {admissionDateError && <p className="text-red-500 text-xs mt-1">{admissionDateError}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Student Fee <span className="text-red-500">*</span></label>
                  <input type="number" value={studentFee} onChange={(e) => setStudentFee(Number(e.target.value))}
                    className={`mt-1 w-full border px-3 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition ${studentFeeError ? "border-red-500" : "border-gray-300"}`} />
                  {studentFeeError && <p className="text-red-500 text-xs mt-1">{studentFeeError}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Payment Date (1–31) <span className="text-red-500">*</span></label>
                  <input type="number" value={paymentDate} onChange={(e) => setPaymentDate(Number(e.target.value))}
                    className={`mt-1 w-full border px-3 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition ${paymentDateError ? "border-red-500" : "border-gray-300"}`} />
                  {paymentDateError && <p className="text-red-500 text-xs mt-1">{paymentDateError}</p>}
                </div>
              </div>
            </div>

            {/* Parent Info */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">Parent Information (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Father Name</label>
                  <input type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} placeholder="Enter father name"
                    className="mt-1 w-full border px-3 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Mother Name</label>
                  <input type="text" value={motherName} onChange={(e) => setMotherName(e.target.value)} placeholder="Enter mother name"
                    className="mt-1 w-full border px-3 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Parent Phone</label>
                  <input type="text" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} placeholder="Enter phone number"
                    className={`mt-1 w-full border px-3 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition ${parentPhoneError ? "border-red-500" : "border-gray-300"}`} />
                  {parentPhoneError && <p className="text-red-500 text-xs mt-1">{parentPhoneError}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Parent Email</label>
                  <input type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} placeholder="Enter email"
                    className={`mt-1 w-full border px-3 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition ${parentEmailError ? "border-red-500" : "border-gray-300"}`} />
                  {parentEmailError && <p className="text-red-500 text-xs mt-1">{parentEmailError}</p>}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white pb-2">
              <button type="button" onClick={() => setEditForm(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition">Cancel</button>
              <button type="submit" disabled={processing}
                className={`px-5 py-2 rounded-xl text-white font-semibold shadow-md transition flex items-center gap-2 ${processing ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
                {processing && <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>}
                {processing ? "Updating..." : "Update"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

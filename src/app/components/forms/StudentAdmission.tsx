"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import CircularIndeterminate from "../ui/CircularIndeterminate";

interface StudentAdmissionProps {
  class_name: string;
  classId: string | string[];
  batch_name: string;
  batchId: string | string[];
  admisson: boolean;
  setRegisterForm: (value: boolean) => void;
  getStudent: () => void;
}

export default function StudentAdmission({
  class_name,
  classId,
  batch_name,
  batchId,
  setRegisterForm,
  getStudent,
}: StudentAdmissionProps) {
  // States
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [paymentDate, setPaymentDate] = useState(0);
  const [studentFee, setStudentFee] = useState(0);
  const [processing, setProcessing] = useState(false);

  const kaksha = { class_name, classId };
  const batch = { batch_name, batchId };

  const router = useRouter();

  // Error states
  const [nameError, setNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [admissionDateError, setAdmissionDateError] = useState("");
  const [paymentDateError, setPaymentDateError] = useState("");
  const [studentFeeError, setStudentFeeError] = useState("");

  // Validation
  const validate = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError("Full Name is required");
      isValid = false;
    } else setNameError("");

    if (!address.trim()) {
      setAddressError("Address is required");
      isValid = false;
    } else setAddressError("");

    if (!gender) {
      setGenderError("Gender is required");
      isValid = false;
    } else setGenderError("");

    if (!admissionDate) {
      setAdmissionDateError("Admission date is required");
      isValid = false;
    } else setAdmissionDateError("");

    if (studentFee <= 0) {
      setStudentFeeError("Student fee must be greater than zero");
      isValid = false;
    } else setStudentFeeError("");

    if (paymentDate <= 0 || paymentDate > 31) {
      setPaymentDateError("Payment date must be between 1 and 31");
      isValid = false;
    } else setPaymentDateError("");

    return isValid;
  };

  // Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const submittedData = {
        name,
        address,
        gender,
        kaksha,
        batch,
        admissionDate,
        studentFee,
        paymentDate,
      };

      const token = localStorage.getItem("codeflam01_token");
      setProcessing(true);

      const response = await axios.post(
        "http://localhost:4000/api/v1/student",
        submittedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);
      setRegisterForm(false);
      getStudent();
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("codeflam01_token");
        router.push("/login");
      } else {
        toast.error("Failed to add student ❌");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
      <div className="p-4 bg-white w-[90%] lg:w-[35%] rounded-lg shadow-md">
        {/* Close */}
        <div className="flex justify-end text-2xl">
          <button
            className="hover:bg-blue-100 p-1.5 rounded"
            onClick={() => setRegisterForm(false)}
          >
            <RxCross2 />
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Student Admission
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <section className="grid grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full border p-2 rounded ${nameError && "border-red-500"}`}
              />
              {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="text-sm font-medium">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={`w-full border p-2 rounded ${genderError && "border-red-500"}`}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {genderError && <p className="text-red-500 text-sm">{genderError}</p>}
            </div>

            {/* Address */}
            <div className="col-span-2">
              <label className="text-sm font-medium">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full border p-2 rounded ${addressError && "border-red-500"}`}
              />
              {addressError && <p className="text-red-500 text-sm">{addressError}</p>}
            </div>

            {/* Admission Date */}
            <div>
              <label className="text-sm font-medium">Admission Date</label>
              <input
                type="date"
                value={admissionDate}
                onChange={(e) => setAdmissionDate(e.target.value)}
                className={`w-full border p-2 rounded ${admissionDateError && "border-red-500"}`}
              />
            </div>

            {/* Student Fee */}
            <div>
              <label className="text-sm font-medium">Student Fee</label>
              <input
                type="number"
                value={studentFee}
                onChange={(e) => setStudentFee(Number(e.target.value))}
                className={`w-full border p-2 rounded ${studentFeeError && "border-red-500"}`}
              />
            </div>

            {/* Payment Date */}
            <div>
              <label className="text-sm font-medium">Payment Date (1–31)</label>
              <input
                type="number"
                value={paymentDate}
                onChange={(e) => setPaymentDate(Number(e.target.value))}
                className={`w-full border p-2 rounded ${paymentDateError && "border-red-500"}`}
              />
            </div>
          </section>

          <div className="text-right">
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {processing ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

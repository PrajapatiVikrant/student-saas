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
  // Individual state for each field
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const kaksha = { class_name, classId };
  const batch = { batch_name, batchId };
  const [admissionDate, setAdmissionDate] = useState("");
  const [paymentDate, setPaymentDate] = useState(0); 
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  // Error states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [admissionDateError, setAdmissionDateError] = useState("");
  const [paymentDateError, setPaymentDateError] = useState(""); // ✅ New error state

  // Validation
  const validate = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError("Full Name is required");
      isValid = false;
    } else setNameError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
      isValid = false;
    } else setEmailError("");

    if (!phone.trim()) {
      setPhoneError("Phone number is required");
      isValid = false;
    } else if (!/^\d{10}$/.test(phone)) {
      setPhoneError("Phone number must be 10 digits");
      isValid = false;
    } else setPhoneError("");

    if (!address.trim()) {
      setAddressError("Address is required");
      isValid = false;
    } else setAddressError("");

    if (!gender.trim()) {
      setGenderError("Gender is required");
      isValid = false;
    } else setGenderError("");

    if (!admissionDate.trim()) {
      setAdmissionDateError("Admission date is required");
      isValid = false;
    } else setAdmissionDateError("");

    if (paymentDate > 31 || paymentDate <= 0) {
      setPaymentDateError("Please enter a valid payment date between 1 and 31.");
      isValid = false;
    } else {
        setPaymentDateError("");
    }

    if (!paymentDate) {
      setPaymentDateError("Payment date is required");
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
        email,
        phone,
        address,
        gender,
        kaksha,
        batch,
        admissionDate,
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
        localStorage.removeItem("adminToken");
        router.push("/login");
      } else {
        toast.error("Failed to add student ❌");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/25 overflow-auto flex items-center justify-center z-50">
      <div className="p-4 bg-white w-[90%] lg:w-[35%] rounded-lg shadow-md">
        {/* Close Button */}
        <p className="text-black flex justify-end text-2xl cursor-pointer transition">
          <button
            className="cursor-pointer rounded-xs hover:bg-blue-100 p-1.5"
            onClick={() => setRegisterForm(false)}
          >
            <RxCross2 />
          </button>
        </p>

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Student Admission
        </h2>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <section className="grid grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-blue-500 ${nameError ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Enter full name"
              />
              {nameError && (
                <p className="text-red-500 text-sm mt-1">{nameError}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-blue-500 ${emailError ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Enter email address"
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-blue-500 ${phoneError ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Enter phone number"
              />
              {phoneError && (
                <p className="text-red-500 text-sm mt-1">{phoneError}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-blue-500 ${genderError ? "border-red-500" : "border-gray-300"
                  }`}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {genderError && (
                <p className="text-red-500 text-sm mt-1">{genderError}</p>
              )}
            </div>

            {/* Address */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-blue-500 ${addressError ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Enter address"
              />
              {addressError && (
                <p className="text-red-500 text-sm mt-1">{addressError}</p>
              )}
            </div>

            {/* Admission Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Admission Date
              </label>
              <input
                type="date"
                value={admissionDate}
                onChange={(e) => setAdmissionDate(e.target.value)}
                className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-blue-500 ${admissionDateError ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {admissionDateError && (
                <p className="text-red-500 text-sm mt-1">
                  {admissionDateError}
                </p>
              )}
            </div>

            {/* ✅ Payment Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Date
              </label>
              <input
                type="number"
                value={paymentDate}
                onChange={(e) => setPaymentDate(Number(e.target.value))}
                className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-blue-500 ${paymentDateError ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {paymentDateError && (
                <p className="text-red-500 text-sm mt-1">
                  {paymentDateError}
                </p>
              )}
            </div>
          </section>

          {/* Submit */}
          <div className="text-right">
            <button
              type="submit"
              disabled={processing}
              className={`${processing ? "bg-blue-300" : "bg-blue-600"
                } text-white px-4 py-2 rounded-md hover:bg-blue-300 cursor-pointer transition`}
            >
              {processing ? (
                <div className="flex justify-center items-center gap-1.5">
                  <CircularIndeterminate size={30} />
                  <span>Submitting</span>
                </div>
              ) : (
                <span>Submit</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

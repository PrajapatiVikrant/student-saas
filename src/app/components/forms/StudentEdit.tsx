"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import CircularIndeterminate from "../ui/CircularIndeterminate";

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
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("");
    const [admissionDate, setAdmissionDate] = useState("");
    const [processing, setProcessing] = useState(false);

    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [addressError, setAddressError] = useState("");
    const [genderError, setGenderError] = useState("");
    const [admissionDateError, setAdmissionDateError] = useState("");

    const router = useRouter();
    const kaksha = { class_name, classId };
    const batch = { batch_name, batchId };

    // ✅ Fetch existing student data
    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const token = localStorage.getItem("codeflam01_token");
                const response = await axios.get(
                    `http://localhost:4000/api/v1/student/student/${studentId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const student = response.data;

                // Pre-fill values
                setName(student.name || "");
                setEmail(student.email || "");
                setPhone(student.phone || "");
                setAddress(student.address || "");
                setGender(student.gender || "");
                setAdmissionDate(student.admissionDate?.split("T")[0] || "");
            } catch (error: any) {
                console.error("Error fetching student:", error);
                toast.error("Failed to load student data ❌");
            }
        };

        if (studentId) fetchStudent();
    }, [studentId]);

    // ✅ Validation
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
            setEmailError("Invalid email format");
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

        return isValid;
    };

    // ✅ Submit (Update)
    const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const token = localStorage.getItem("codeflam01_token");
            setProcessing(true);
            console.log(batch);
            console.log(kaksha)
            const updatedData = {
                name,
                email,
                phone,
                address,
                gender,
                class: {name:kaksha.class_name,class_id:kaksha.classId},
                batch:{name:batch.batch_name,batch_id:batch.batchId},
                admissionDate,
            };
            console.log('updatedData:', updatedData)
           
            const response = await axios.put(
                `http://localhost:4000/api/v1/student/${studentId}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(response.data.message || "Student updated successfully ✅");
            setEditForm(false);
            getStudent();
        } catch (error: any) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("adminToken");
                router.push("/login");
            } else {
                toast.error("Failed to update student ❌");
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/25 overflow-auto flex items-center justify-center z-50">
            <div className="p-4 bg-white  w-[90%] lg:w-[35%] rounded-lg shadow-md">
                {/* Close Button */}
                <p className="text-black flex justify-end text-2xl cursor-pointer transition">
                    <button
                        className="cursor-pointer rounded-xs hover:bg-blue-100 p-1.5"
                        onClick={() => setEditForm(false)}
                    >
                        <RxCross2 />
                    </button>
                </p>

                {/* Heading */}
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Edit Student Details
                </h2>

                {/* Form */}
                <form className="space-y-4" onSubmit={handleUpdate}>
                    <section className="grid grid-cols-2 gap-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${nameError ? "border-red-500" : "border-gray-300"
                                    }`}
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
                                className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${emailError ? "border-red-500" : "border-gray-300"
                                    }`}
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
                                className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${phoneError ? "border-red-500" : "border-gray-300"
                                    }`}
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
                                className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${genderError ? "border-red-500" : "border-gray-300"
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
                                className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${addressError ? "border-red-500" : "border-gray-300"
                                    }`}
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
                                className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${admissionDateError ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {admissionDateError && (
                                <p className="text-red-500 text-sm mt-1">
                                    {admissionDateError}
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
                                } text-white px-4 py-2 rounded-md hover:bg-blue-300 transition`}
                        >
                            {processing ? (
                                <div className="flex justify-center items-center gap-1.5">
                                    <CircularIndeterminate size={30} />
                                    <span>Updating</span>
                                </div>
                            ) : (
                                <span>Update</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

"use client";

import axios from "axios";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";

interface StudentAdmissionProps {
    setRegisterForm: (value: boolean) => void;
}

export default function StudentAdmission({ setRegisterForm }: StudentAdmissionProps) {
    // Individual state for each field
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [kaksha, setKaksha] = useState("");
    const [batch, setBatch] = useState("");
    const [admissionDate, setAdmissionDate] = useState("");

    // Error states
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [addressError, setAddressError] = useState("");
    const [kakshaError, setKakshaError] = useState("");
    const [batchError, setBatchError] = useState("");
    const [admissionDateError, setAdmissionDateError] = useState("");

    useEffect(() => {
        getAllClass()
    }, [])

    async function getAllClass() {
        const token = localStorage.getItem("adminToken");
        try {
            const response = await axios.get('http://localhost:4000/api/v1/kaksha', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            console.log(response)
           
        } catch (error) {
            console.log(error)
            toast.error("Fail to fetch classes ❌")
        }
    }








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

        if (!kaksha.trim()) {
            setKakshaError("Class is required");
            isValid = false;
        } else setKakshaError("");

        if (!batch.trim()) {
            setBatchError("Batch is required");
            isValid = false;
        } else setBatchError("");

        if (!admissionDate.trim()) {
            setAdmissionDateError("Admission date is required");
            isValid = false;
        } else setAdmissionDateError("");

        return isValid;
    };

    // Submit
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {
            const submittedData = { name, email, phone, address, kaksha, batch, admissionDate };
            console.log("Form submitted:", submittedData);

            // Reset form
            setName("");
            setEmail("");
            setPhone("");
            setAddress("");
            setKaksha("");
            setBatch("");
            setAdmissionDate("");

            setRegisterForm(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/25 overflow-auto flex items-center justify-center z-50">
            <div className="p-4 bg-white w-[35%] rounded-lg shadow-md">
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
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-blue-500 ${nameError ? "border-red-500" : "border-gray-300"}`}
                                placeholder="Enter full name"
                            />
                            {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-blue-500 ${emailError ? "border-red-500" : "border-gray-300"}`}
                                placeholder="Enter email address"
                            />
                            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-blue-500 ${phoneError ? "border-red-500" : "border-gray-300"}`}
                                placeholder="Enter phone number"
                            />
                            {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-blue-500 ${addressError ? "border-red-500" : "border-gray-300"}`}
                                placeholder="Enter address"
                            />
                            {addressError && <p className="text-red-500 text-sm mt-1">{addressError}</p>}
                        </div>

                        {/* Class */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Class</label>
                            <select
                                value={kaksha}
                                onChange={(e) => setKaksha(e.target.value)}
                                className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-blue-500 ${kakshaError ? "border-red-500" : "border-gray-300"}`}
                            >
                                <option value="">Select a class</option>
                                <option value="Class 10th">Class 10th</option>
                                <option value="Class 12th">Class 12th</option>
                            </select>
                            {kakshaError && <p className="text-red-500 text-sm mt-1">{kakshaError}</p>}
                        </div>

                        {/* Batch */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Batch</label>
                            <select
                                value={batch}
                                onChange={(e) => setBatch(e.target.value)}
                                className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-blue-500 ${batchError ? "border-red-500" : "border-gray-300"}`}
                            >
                                <option value="">Select a batch</option>
                                <option value="Batch A">Batch A</option>
                                <option value="Batch B">Batch B</option>
                            </select>
                            {batchError && <p className="text-red-500 text-sm mt-1">{batchError}</p>}
                        </div>

                        {/* Admission Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Admission Date</label>
                            <input
                                type="date"
                                value={admissionDate}
                                onChange={(e) => setAdmissionDate(e.target.value)}
                                className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-blue-500 ${admissionDateError ? "border-red-500" : "border-gray-300"}`}
                            />
                            {admissionDateError && <p className="text-red-500 text-sm mt-1">{admissionDateError}</p>}
                        </div>
                    </section>

                    {/* Submit */}
                    <div className="text-right">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

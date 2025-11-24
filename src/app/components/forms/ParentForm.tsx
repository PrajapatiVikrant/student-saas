"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import CircularIndeterminate from "../ui/CircularIndeterminate";

interface Props {
    setRegisterForm: (value: boolean) => void;
    getTeacher:()=>(void);
    admisson:boolean;
}

export default function ParentPortalAccessForm({ setRegisterForm }: Props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [classes, setClasses] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);

    const [selectedClass, setSelectedClass] = useState("");
    const [selectedBatch, setSelectedBatch] = useState("");
    const [studentId, setStudentId] = useState("");

    const [processing, setProcessing] = useState(false);
    const router = useRouter();

    const token = localStorage.getItem("adminToken");

    // GET Classes from backend
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await axios.get("http://localhost:4000/api/v1/kaksha", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(res.data)
                setClasses(res.data);
            } catch (err) {
                console.log(err)
                toast.error("Failed to load classes");
            }
        };

        fetchClasses();
    }, []);

    // Update batches when class is selected
    useEffect(() => {
        if (!selectedClass) {
            setBatches([]);
            return;
        }

        const classObj = classes.find((c) => c._id === selectedClass);
        console.log('classObj',classObj)

        if (classObj) setBatches(classObj.class.batches);
    }, [selectedClass, classes]);

    // Validation
    const validate = () => {
        if (!name.trim()) return toast.error("Name is required");
        if (!email.trim()) return toast.error("Email is required");
        if (!phone.trim() || phone.length !== 10)
            return toast.error("Phone must be 10 digits");
        if (!selectedClass) return toast.error("Select class");
        if (!selectedBatch) return toast.error("Select batch");
        if (!studentId.trim()) return toast.error("Student ID required");

        return true;
    };

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setProcessing(true);

        try {
            await axios.post("http://localhost:4000/api/v1/parent/register", {
                name,
                email,
                phone,
                class_id: selectedClass,
                batch_id: selectedBatch,
                studentId,
            });

            toast.success("Parent access created");
            setRegisterForm(false);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to submit");
        }

        setProcessing(false);
    };

    return (
        <div className="fixed inset-0 bg-black/25 overflow-auto flex items-center justify-center z-50">
            <div className="p-5 bg-white w-[95%] sm:w-[80%] md:w-[50%] lg:w-[35%] rounded-lg shadow-md">
                <div className="flex justify-end mb-2">
                    <button
                        className="text-xl p-2 hover:bg-gray-200 rounded-full"
                        onClick={() => setRegisterForm(false)}
                    >
                        <RxCross2 />
                    </button>
                </div>

                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Parent Portal Admission
                </h2>

                <form className="space-y-4" onSubmit={submitHandler}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Full Name */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full border rounded-md p-2 border-gray-300 focus:ring-blue-500"
                                placeholder="Enter full name"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full border rounded-md p-2 border-gray-300 focus:ring-blue-500"
                                placeholder="Enter email"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 block w-full border rounded-md p-2 border-gray-300 focus:ring-blue-500"
                                placeholder="10 digit phone"
                            />
                        </div>

                        {/* Class Select */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Student Class
                            </label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="mt-1 block w-full border rounded-md p-2 border-gray-300 focus:ring-blue-500"
                            >
                                <option value="">Select Class</option>
                                {classes.map((cls) => (
                                    <option key={cls._id} value={cls._id}>
                                        {cls.class.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Batch Select */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Student Batch
                            </label>
                            <select
                                value={selectedBatch}
                                onChange={(e) => setSelectedBatch(e.target.value)}
                                className="mt-1 block w-full border rounded-md p-2 border-gray-300 focus:ring-blue-500"
                            >
                                <option value="">Select Batch</option>
                                {batches.map((batch) => (
                                    <option key={batch._id} value={batch._id}>
                                        {batch.batch_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Student ID */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Student ID
                            </label>
                            <input
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                className="mt-1 block w-full border rounded-md p-2 border-gray-300 focus:ring-blue-500"
                                placeholder="Enter Student ID"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-right">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            {processing ? (
                                <div className="flex justify-center items-center gap-1">
                                    <CircularIndeterminate size={25} />
                                    <span>Submitting</span>
                                </div>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

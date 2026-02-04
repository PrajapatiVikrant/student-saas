"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import CircularIndeterminate from "../ui/CircularIndeterminate";

interface Props {
    parent: any;
    setRegisterForm: (value: boolean) => void;
    setViewParent: (value: boolean) => void;
    getParents: () => void;

}

export default function ParentPortalAccessForm({ parent, setRegisterForm, setViewParent, getParents }: Props) {
    const [name, setName] = useState(parent ? parent.name : "");
    const [email, setEmail] = useState(parent ? parent.email : "");
    const [phone, setPhone] = useState(parent ? parent.phone : "");

    const [classes, setClasses] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);

    const [selectedClass, setSelectedClass] = useState("");
    const [selectedBatch, setSelectedBatch] = useState("");
    const [selectedClassName, setSelectedClassName] = useState("");
    const [selectedBatchName, setSelectedBatchName] = useState("");
    const [newStudentId, setNewStudentId] = useState("");
    const [selectedStudents, setSelectedStudents] = useState<any[]>(parent ? parent.childrens.map((ch: any) => ({ _id: ch._id, name: ch.name, class: ch.class.name, batch: ch.batch.name })) : []);

    const [processing, setProcessing] = useState(false);

    const token = typeof window !== "undefined" ? localStorage.getItem("codeflam01_token") : null;

    // --------------------------
    // FETCH CLASSES
    // --------------------------
    useEffect(() => {
        async function fetchClasses() {
            try {
                const res = await axios.get("http://localhost:4000/api/v1/kaksha", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setClasses(res.data);
            } catch (err) {
                toast.error("Failed to load classes");
            }
        }
        fetchClasses();

    }, []);

    // UPDATE BATCHES WHEN CLASS CHANGES
    useEffect(() => {
        if (!selectedClass) {
            setBatches([]);
            return;
        }

        const classObj = classes.find((c) => c._id === selectedClass);
        if (classObj) setBatches(classObj.class.batches);
    }, [selectedClass, classes]);

    // FETCH STUDENTS ON BATCH CHANGE
    useEffect(() => {
        async function getStudents() {
            if (!selectedBatch) {
                setStudents([]);
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:4000/api/v1/student/${selectedClass}/${selectedBatch}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const studentsData = response.data.students.map((s: any, index: number) => ({
                    _id: s._id,
                    id: index + 1,
                    name: s.name,
                    class: s.class.name,
                    batch: s.batch.name,
                }));

                setStudents(studentsData);
            } catch (error) {
                console.log(error);
                toast.error("Failed to load students");
            }
        }

        getStudents();
    }, [selectedBatch]);

    // --------------------------
    // FORM VALIDATION
    // --------------------------
    const validate = () => {
        if (!name.trim()) {
            toast.error("Name is required");
            return false;
        }
        if (!email.trim()) {
            toast.error("Email is required");
            return false;
        }
        if (!phone.trim() || phone.length !== 10) {
            toast.error("Phone must be 10 digits");
            return false;

        }

        if (!selectedClass) {
            toast.error("Select class");
            return false;
        }
        if (!selectedBatch) {

            toast.error("Select batch");
            return false;
        }

        if (selectedStudents.length === 0) {
            toast.error("Select at least one student");
            return false;
        }


        return true;
    };

    // --------------------------
    // SUBMIT HANDLER
    // --------------------------
    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setProcessing(true);

        try {

            await axios.post(
                "http://localhost:4000/api/v1/parent",
                {
                    name,
                    email,
                    phone,
                    childrens: selectedStudents.map((s) => s._id),
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Parent access created successfully");
            setRegisterForm(false);
            getParents();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to submit");
        }

        setProcessing(false);
    };




    // --------------------------
    // SUBMIT HANDLER
    // --------------------------
    const updateHandler = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setProcessing(true);

        try {

            await axios.put(
                `http://localhost:4000/api/v1/parent/${parent._id}`,
                {
                    name,
                    email,
                    phone,
                    childrens: selectedStudents.map((s) => s._id),
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Updated successfully");
            setRegisterForm(false);
            getParents();
            setViewParent(false);
        } catch (err: any) {
            console.log(err)
            toast.error(err.response?.data?.message || "Failed to update");
        }

        setProcessing(false);
    };

    // --------------------------
    // HANDLE ADD STUDENT
    // --------------------------
    const handleAddStudent = () => {
        if (!newStudentId) return toast.error("Select a student");

        if (selectedStudents.some((s) => s._id === newStudentId))
            return toast.error("Student already added");

        const studentObj = students.find((s) => s._id === newStudentId);
        studentObj.class = selectedClassName;
        studentObj.batch = selectedBatchName;
        if (!studentObj) return;

        setSelectedStudents([...selectedStudents, studentObj]);
        setNewStudentId("");
    };

    // --------------------------
    // HANDLE REMOVE STUDENT
    // --------------------------
    const handleRemoveStudent = (id: string) => {
        setSelectedStudents(selectedStudents.filter((s) => s._id !== id));
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto z-50">

            <div className="bg-white w-full max-w-[550px] rounded-xl p-5 shadow-lg">

                {/* CLOSE BUTTON + HEADING FIXED TO TOP */}
                <div className="sticky top-0 bg-white z-50 pb-2 mb-3 flex justify-between items-center border-b">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                        Parent Portal Admission
                    </h2>

                    <button
                        className="text-xl p-2 hover:bg-gray-200 rounded-full"
                        onClick={() => setRegisterForm(false)}
                    >
                        <RxCross2 />
                    </button>
                </div>


                <form className="space-y-4" onSubmit={parent ? updateHandler : submitHandler}>

                    {/* GRID IMPROVED FOR RESPONSIVENESS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* NAME */}
                        <div className="col-span-1">
                            <label className="text-sm font-medium">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 w-full border rounded-md p-2 text-sm sm:text-base"
                                placeholder="Enter full name"
                            />
                        </div>

                        {/* EMAIL */}
                        <div className="col-span-1">
                            <label className="text-sm font-medium">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 w-full border rounded-md p-2 text-sm sm:text-base"
                                placeholder="Enter email"
                            />
                        </div>

                        {/* PHONE */}
                        <div className="col-span-1">
                            <label className="text-sm font-medium">Phone</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 w-full border rounded-md p-2 text-sm sm:text-base"
                                placeholder="10 digit phone"
                            />
                        </div>

                        {/* CLASS DROPDOWN */}
                        <div className="col-span-1">
                            <label className="text-sm font-medium">Class</label>
                            <select
                                value={selectedClass}
                                onChange={(e) => {
                                    setSelectedClass(e.target.value)
                                    setSelectedClassName(classes.find(c => c._id === e.target.value)?.class.name || "")
                                }}
                                className="mt-1 w-full border rounded-md p-2 text-sm sm:text-base"
                            >
                                <option value="">Select Class</option>
                                {classes.map((cls) => (
                                    <option key={cls._id} value={cls._id}>
                                        {cls.class.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* BATCH DROPDOWN */}
                        <div className="col-span-1">
                            <label className="text-sm font-medium">Batch</label>
                            <select
                                value={selectedBatch}
                                onChange={(e) => {
                                    setSelectedBatch(e.target.value)
                                    setSelectedBatchName(batches.find(b => b._id === e.target.value)?.batch_name || "")
                                }}
                                className="mt-1 w-full border rounded-md p-2 text-sm sm:text-base"
                            >
                                <option value="">Select Batch</option>
                                {batches.map((batch) => (
                                    <option key={batch._id} value={batch._id}>
                                        {batch.batch_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    {/* STUDENTS SECTION RESPONSIVE */}
                    <div>
                        <label className="text-sm font-medium">Students</label>

                        {/* Selected Badges */}
                        <div className="flex flex-wrap gap-2 bg-gray-50 rounded-md p-2 mt-2 max-h-36 overflow-y-auto">
                            {selectedStudents.map((s) => (
                                <span
                                    key={s._id}
                                    className="text-xs sm:text-sm bg-green-100 text-green-700 px-2 py-1 rounded-md flex items-center gap-1"
                                >
                                    {s.class}-{s.batch}-{s.id}: {s.name}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveStudent(s._id)}
                                        className="text-red-600 font-bold text-base leading-none"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>

                        {/* Add Student */}
                        <div className="flex gap-2 mt-3 flex-col sm:flex-row">
                            <select
                                value={newStudentId}
                                onChange={(e) => setNewStudentId(e.target.value)}
                                className="border rounded p-2 text-sm sm:text-base w-full"
                            >
                                <option value="">Select Student</option>
                                {students.map((s) => (
                                    <option key={s._id} value={s._id}>
                                        {s.id}. {s.name}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="button"
                                onClick={handleAddStudent}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm sm:text-base"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* SUBMIT */}
                    <div className="text-center sm:text-right">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 w-full sm:w-auto"
                        >
                            {processing
                                ? <CircularIndeterminate size={22} />
                                : parent ? "Update" : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

}

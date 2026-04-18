"use client";

import axios from "axios";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function ReportsPage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [classOptions, setClassOptions] = useState<any[]>([]);
    const [batchOptions, setBatchOptions] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedBatch, setSelectedBatch] = useState("");
    const [students, setStudents] = useState<any[]>([]);

    const [selectedSubject, setSelectedSubject] = useState<any>(null);
    const [selectedSubjectObj, setSelectedSubjectObj] = useState<any>(null);
    const [subjectsOption, setSubjectsOption] = useState<any[]>([]);
    const [testType, setTestType] = useState<any>({});
    const [selectedTestObj, setSelectedTestObj] = useState<any>(null);
    const [testTypes, setTestTypes] = useState([]);
    const [examRecords, setExamRecords] = useState<any[]>([]);
    const [activeStudent, setActiveStudent] = useState<any>(null);
    const [processing, setProcessing] = useState(false);

    const [maxScore, setMaxScore] = useState("");

    // 🔥 refs
    const markRefs = useRef<(HTMLInputElement | null)[]>([]);
    const feedbackRefs = useRef<(HTMLInputElement | null)[]>([]);

    const router = useRouter();

    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("codeflam01_token")
            : null;

    useEffect(() => {
        fetchTeacherProfile();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchBatchOption();
            fetchSubjectsOption();
        }
    }, [selectedClass]);

    useEffect(() => {
        if (selectedBatch && selectedClass) {
            getBatchStudents();
        }
    }, [selectedBatch]);


    useEffect(() => {
        if (selectedSubjectObj && selectedBatch && selectedClass) {
            fetchExamRecord();
        }
    }, [selectedTestObj])

    async function getBatchStudents() {
        setExamRecords([])
        const token = localStorage.getItem("codeflam01_token");
        if (!token) {
            toast.error("Session expired. Please log in again.");
            router.push("/login");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(
                `https://codeflame-edu-backend.xyz/api/v1/student/${selectedClass}/${selectedBatch}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            console.log("STUDENTS RESPONSE:", response.data);
            setStudents(response.data.students || []);


        } catch (error: any) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("codeflam01_token");
                router.push("/login");
            } else {
                console.log(error)
                toast.error("Failed to fetch students.");
            }
        } finally {
            setLoading(false);
        }
    }

    function fetchSubjectsOption() {
        if (!selectedClass || !profile) return;

        const subjects =
            profile.classes
                ?.filter((cls: any) => cls.class_id === selectedClass)
                .map((cls: any) => ({
                    id: cls._id,
                    name: cls.subject,
                })) || [];

        setSubjectsOption(subjects);
    }

    function fetchBatchOption() {
        if (!selectedClass || !profile) return;

        const batches =
            profile.classes.find((c: any) => c.class_id === selectedClass)
                ?.class_detail?.class?.batches || [];

        setBatchOptions(batches);
    }

    async function fetchTeacherProfile() {
        try {
            if (!token) {
                router.push("/teacher/login");
                return;
            }

            const res = await axios.get("/api/v1/teacher/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const uniqueClasses = Array.from(
                new Map(
                    res.data.classes.map((c: any) => [
                        c.class_id,
                        {
                            class_id: c.class_id,
                            class_name: c.class_name,
                        },
                    ])
                ).values()
            );

            setTestTypes(res.data.exams);
            setClassOptions(uniqueClasses as any[]);
            setProfile(res.data);
        } catch (error) {
            router.push("/teacher/login");
        } finally {
            setLoading(false);
        }
    }



    async function fetchExamRecord() {
        setExamRecords([])
        setLoading(true)
        try {
            const testRecord = await axios.get(
                `https://codeflame-edu-backend.xyz/api/v1/test//class/${selectedClass}/batch/${selectedBatch}/exam/${selectedTestObj.id || selectedTestObj._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            
            if (testRecord.data.data[0]) {
                setMaxScore(testRecord.data.data[0].score?.max_marks || "");
                setExamRecords(testRecord.data.data);
            }
        } catch (error: any) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("codeflam01_token");
                router.push("/login");
            } else {
                console.log(error)
                toast.error("Failed to fetch students.");
            }
        } finally {
            setLoading(false)
        }
    }









    async function handleSave() {
        if (!selectedClass || !selectedBatch || !selectedSubjectObj || !selectedTestObj || !maxScore) {
            toast.error("Please fill all filters before saving.");
            return;
        }
        

        const data = students.map((student, index) => ({
            class_id: selectedClass,
            batch_id: selectedBatch,

            subject: {
                id: selectedSubjectObj.id || selectedSubjectObj._id,
                name: selectedSubjectObj.name,
            },

            test_type: {
                id: selectedTestObj.id || selectedTestObj._id,
                name: selectedTestObj.name,
            },

            student_id: student._id,
            name: student.name,

            marks: Number(markRefs.current[index]?.value || 0),
            max_score: Number(maxScore),

            feedback: feedbackRefs.current[index]?.value || "",
        }));

        let hasError = false;

        data.forEach((student) => {
            if (student.marks === 0 && student.marks !== 0) {
                toast.error(`Marks missing for ${student.name}`);
                hasError = true;
                return;
            }

            if (
                isNaN(student.marks) ||
                student.marks < 0 ||
                student.marks > Number(maxScore)
            ) {
                toast.error(`Marks for ${student.name} must be between 0 and ${maxScore}`);
                hasError = true;
            }
        });

        if (hasError) return;
        setProcessing(true)
        try {
            const payload = {
                exams: data, // ✅ controller expects { exams: [] }
            };

            await axios.post(
                "/api/v1/test/add-multiple",
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            fetchExamRecord()
           
            toast.success("Marks saved successfully ✅");

        } catch (error) {
            console.error(error);
            toast.error("Failed to save marks ❌");
        }finally{
            setProcessing(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">

            {/* HEADER */}
            <div className="mb-4 md:mb-6">
                <h1 className="text-xl md:text-2xl font-bold">📊 Reports Dashboard</h1>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    Enter marks quickly using keyboard
                </p>
            </div>

            {/* FILTERS (same as before) */}
            <div className="bg-white dark:bg-gray-800 p-3 md:p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">

                    <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="filter-input">
                        <option value="">Class</option>
                        {classOptions.map((cls: any) => (
                            <option key={cls.class_id} value={cls.class_id}>{cls.class_name}</option>
                        ))}
                    </select>

                    <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="filter-input">
                        <option value="">Section</option>
                        {batchOptions.map((b: any) => (
                            <option key={b._id} value={b._id}>{b.batch_name}</option>
                        ))}
                    </select>

                    <select
                        value={selectedSubject}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSelectedSubject(value);

                            const obj = subjectsOption.find((s: any) => s.id === value);
                            setSelectedSubjectObj(obj);
                        }}
                        className="filter-input"
                    >
                        <option value="">Subject</option>
                        {subjectsOption.map((s: any) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                    {selectedSubjectObj && (

                        <select
                            value={testType}
                            onChange={(e) => {
                                const value = e.target.value;
                                setTestType(value);

                                const obj = testTypes.find((t: any) => t._id === value);
                                setSelectedTestObj(obj);
                            }}
                            className="filter-input"
                        >
                            <option value="">Exam</option>
                            {testTypes.map((t: any) => (
                                <option key={t._id} value={t._id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    )}

                    <input type="number" placeholder="Max" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} className="filter-input" />

                </div>
            </div>

            {/* SAVE */}
            <div className="flex justify-end mb-4">
                <button disabled={processing} onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 p-1 px-2.5">
                    <Save className="w-4 h-4 inline mr-2" />
                    {processing?"Saving...":"Save"}
                    
                </button>
            </div>


            {/* STUDENTS */}
            <div className="space-y-2">

                {/* HEADER */}
                <div className="hidden sm:grid grid-cols-4 items-center p-3 md:p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm text-sm md:text-base font-semibold">
                    <span>Roll No</span>
                    <span>Name</span>
                    <span>Marks Obtain</span>
                    <span>Feedback</span>
                </div>


                {examRecords[0] ? (
                    <div>
                        {examRecords.map((student: any, index: number) => (
                            <div
                                key={student.student_id}
                                className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-3 p-3 md:p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
                            >

                                {/* MOBILE LABELS */}
                                <div className="flex sm:block items-center justify-between text-sm md:text-base">
                                    <span className="sm:hidden text-gray-500">Roll No:</span>
                                    <span>{index + 1}</span>
                                </div>

                                <div className="flex sm:block items-center justify-between text-sm md:text-base">
                                    <span className="sm:hidden text-gray-500">Name:</span>
                                    <span
                                        onClick={() =>
                                            setActiveStudent(
                                                activeStudent === index ? null : index
                                            )
                                        }
                                        className={`font-medium ${(activeStudent === index) ? "hidden" : ""}`}
                                    >{student.student.student_name}</span>
                                    {activeStudent === index && (
                                        <div
                                            onClick={() =>
                                                setActiveStudent(
                                                    activeStudent === index ? null : index
                                                )
                                            }
                                            className="col-span-1 cursor-pointer sm:col-span-4 text-xs text-gray-600 dark:text-gray-300 mt-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-md">

                                            <p>
                                                <strong>Class:</strong>{" "}
                                                {classOptions.find(c => c.class_id === selectedClass)?.class_name}
                                            </p>

                                            <p>
                                                <strong>Section:</strong>{" "}
                                                {batchOptions.find(b => b._id === selectedBatch)?.batch_name}
                                            </p>

                                            <p>
                                                <strong>Exam:</strong> {selectedTestObj?.name}
                                            </p>

                                        </div>
                                    )}
                                </div>

                                {/* MARKS */}
                                <div className="flex sm:block items-center justify-between">
                                    <span className="sm:hidden text-gray-500 text-sm">Marks:</span>
                                    <input
                                        ref={(el) => (markRefs.current[index] = el)}
                                        defaultValue={student.score.obt_marks}
                                        type="number"
                                        placeholder="Marks"
                                        className="w-20 px-2 py-1.5 text-sm rounded-md border bg-gray-50 dark:bg-gray-700"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                const next = markRefs.current[index + 1];
                                                if (next) next.focus();
                                                else toast.success("All data entered ✅");
                                            }
                                        }}
                                    />
                                </div>

                                {/* FEEDBACK */}
                                <div className="flex    sm:block items-center gap-2 justify-between">
                                    <span className="sm:hidden text-gray-500 text-sm">Feedback:</span>
                                    <input
                                        ref={(el) => (feedbackRefs.current[index] = el)}
                                        defaultValue={student.feedback}
                                        type="text"
                                        placeholder="Feedback (Optional)"
                                        className="flex-1 px-2 py-1.5 w-[30%] sm:w-full text-sm  rounded-md border bg-gray-50 dark:bg-gray-700"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                const next = markRefs.current[index + 1];
                                                if (next) next.focus();
                                                else toast.success("All data entered ✅");
                                            }
                                        }}
                                    />
                                </div>

                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        {students.map((student: any, index: number) => (
                            <div
                                key={student._id}
                                className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-3 p-3 md:p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
                            >

                                {/* MOBILE LABELS */}
                                <div className="flex sm:block items-center justify-between text-sm md:text-base">
                                    <span className="sm:hidden text-gray-500">Roll No:</span>
                                    <span>{index + 1}</span>
                                </div>

                                <div className="flex sm:block items-center justify-between text-sm md:text-base">
                                    <span className="sm:hidden text-gray-500">Name:</span>
                                    <span
                                        onClick={() =>
                                            setActiveStudent(
                                                activeStudent === index ? null : index
                                            )
                                        }
                                        className={`font-medium ${(activeStudent === index) ? "hidden" : ""}`}
                                    >{student.name}</span>
                                    {activeStudent === index && (
                                        <div
                                            onClick={() =>
                                                setActiveStudent(
                                                    activeStudent === index ? null : index
                                                )
                                            }
                                            className="col-span-1 cursor-pointer sm:col-span-4 text-xs text-gray-600 dark:text-gray-300 mt-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-md">

                                            <p>
                                                <strong>Class:</strong>{" "}
                                                {classOptions.find(c => c.class_id === selectedClass)?.class_name}
                                            </p>

                                            <p>
                                                <strong>Section:</strong>{" "}
                                                {batchOptions.find(b => b._id === selectedBatch)?.batch_name}
                                            </p>

                                            <p>
                                                <strong>Exam:</strong> {selectedTestObj?.name}
                                            </p>

                                        </div>
                                    )}
                                </div>

                                {/* MARKS */}
                                <div className="flex sm:block items-center justify-between">
                                    <span className="sm:hidden text-gray-500 text-sm">Marks:</span>
                                    <input
                                        ref={(el) => (markRefs.current[index] = el)}
                                        type="number"
                                        placeholder="Marks"
                                        className="w-20 px-2 py-1.5 text-sm rounded-md border bg-gray-50 dark:bg-gray-700"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                const next = markRefs.current[index + 1];
                                                if (next) next.focus();
                                                else toast.success("All data entered ✅");
                                            }
                                        }}
                                    />
                                </div>

                                {/* FEEDBACK */}
                                <div className="flex    sm:block items-center gap-2 justify-between">
                                    <span className="sm:hidden text-gray-500 text-sm">Feedback:</span>
                                    <input
                                        ref={(el) => (feedbackRefs.current[index] = el)}
                                        type="text"
                                        placeholder="Feedback (Optional)"
                                        className="flex-1 px-2 py-1.5 w-[30%] sm:w-full text-sm  rounded-md border bg-gray-50 dark:bg-gray-700"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                const next = markRefs.current[index + 1];
                                                if (next) next.focus();
                                                else toast.success("All data entered ✅");
                                            }
                                        }}
                                    />
                                </div>

                            </div>
                        ))}
                    </div>
                )}


            </div>

        </div>
    );
}
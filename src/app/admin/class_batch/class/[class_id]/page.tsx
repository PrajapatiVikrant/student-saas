"use client";

import SubjectCard from "@/app/components/ui/SubjectCard";
import {
    FiBookOpen,
    FiLayers,
    FiPlusCircle,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import BatchCard from "@/app/components/ui/BatchCard";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import CircularIndeterminate from "@/app/components/ui/CircularIndeterminate";
import BatchForm from "@/app/components/forms/BatchForm";

// ✅ Type for Subject and Batch
interface Subject {
    _id: string;
    subject_name: string;
}

interface Batch {
    _id: string;
    batch_name: string;
    [key: string]: any; // allow extra fields if needed
}

// ✅ Type for API response
interface ClassResponse {
    success: boolean;
    class: {
        _id: string;
        name: string;
        subjects: Subject[];
        batches: Batch[];
    };
}

export default function Kaksha() {
    const params = useParams();
    const router = useRouter();
    const class_id = params.class_id as string;

    const [subject, setSubject] = useState<string>("");
    const [class_name,setClass_name] = useState<string>("")
    const [processing, setProcessing] = useState<boolean>(false);
    const [batch, setBatch] = useState<Batch[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [batchForm,setBatchForm] = useState<boolean>(false);

    useEffect(() => {
        getClass();
       
    }, []);

    // ✅ Get class data
    async function getClass() {
        const token = localStorage.getItem("codeflam01_token");
        try {
            const response = await axios.get<ClassResponse>(
                `http://localhost:4000/api/v1/kaksha/${class_id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            

            console.log(response.data);
            setClass_name(response.data.class.name)
            setBatch(response.data.class.batches);
            setSubjects(response.data.class.subjects);
        } catch (error: any) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("codeflam01_token");
                router.push("/login");
            } else {
                toast.error("Failed to load class list ❌");
            }
            console.error("Error fetching classes:", error);
        } finally {
            setLoading(false);
        }
    }

    // ✅ Add new subject
    async function addSubject() {
        const token = localStorage.getItem("codeflam01_token");

        if (!subject.trim()) {
            toast.info("Please fill the subject input field");
            return;
        }

        setProcessing(true);
        try {
            const response = await axios.post(
                `http://localhost:4000/api/v1/kaksha/addSubject/${class_id}`,
                { subject },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success("New subject added successfully");
            setSubjects(response.data.kaksha.class.subjects);

            // ✅ Refresh the subjects list after adding
            getClass();
            setSubject("");
        } catch (error: any) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("codeflam01_token");
                router.push("/login");
            } else {
                toast.error("Failed to add subject ❌");
            }
            console.error("Error adding subject:", error);
        } finally {
            setProcessing(false);
        }
    }

    async function removeSubject(id:String) {
    const token = localStorage.getItem("codeflam01_token")
    try {
      setLoading(true)
      const response = await axios.delete(`http://localhost:4000/api/v1/kaksha/deleteSubject/${class_id}/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        })
   
      toast.success(response.data.message)
      getClass()
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("codeflam01_token");
        router.push("/login");
      }
    } finally{
        setLoading(false)
    }
  }

    if (loading) {
        return (
        <main className="flex flex-col h-screen justify-center items-center">
            <CircularIndeterminate size={80} />
            <span>Loading...</span>
        </main>
        )

    }

    return (
        <div className="min-h-screen overflow-auto bg-gradient-to-br from-slate-50 to-slate-100">
            <header className="p-6">
                <h1 className="text-3xl font-bold">{class_name}</h1>
            </header>

            <main className="px-6 space-y-6">
                {/* ---------- Subjects Section ---------- */}
                <section>
                    <div className="flex flex-wrap w-[300px] gap-2">
                        {subjects.length === 0 && (
                            <p className="text-[15px] text-gray-400">Subjects not found</p>
                        )}
                        {subjects.map((subject) => (
                            <SubjectCard
                                key={subject._id}
                                id={subject._id}
                                subject={subject.subject_name}
                                removeSubject={removeSubject}
                            />
                        ))}
                    </div>

                    {/* Add Subject */}
                    <section className="border-dashed border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 mt-4 flex items-center gap-4 w-fit">
                        <input
                            className="outline-none border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            type="text"
                            placeholder="Subject name"
                        />
                        <button
                            disabled={processing}
                            onClick={addSubject}
                            className={`px-4 py-2 flex items-center gap-2 cursor-pointer text-sm font-medium rounded-md ${processing ? "bg-blue-300" : "bg-blue-500"
                                } text-white hover:bg-blue-300 focus:ring-2 focus:ring-blue-300 focus:outline-none`}
                        >
                            {processing ? (
                                <div className="text-[15px]">
                                    <CircularIndeterminate size={20} />
                                </div>
                            ) : (
                                <FiBookOpen size={25} />
                            )}
                            Add
                        </button>
                    </section>
                </section>

                {/* ---------- Batches Section ---------- */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="flex items-center text-2xl font-bold gap-2">
                            <FiLayers /> <span>Batches</span>
                        </h2>

                        {/* Create Batch Button */}
                        <button onClick={()=>setBatchForm(true)} className="flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white font-medium text-sm shadow hover:bg-green-600 focus:ring-2 focus:ring-green-300 focus:outline-none">
                            <FiPlusCircle size={18} /> Create Batch
                        </button>
                    </div>

                    {/* Batch Cards */}
                    <section className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-2">
                        {batch.length === 0 && (
                            <p className="text-gray-400 text-sm">No batches available</p>
                        )}
                        {batch.map((b) => (
                            <BatchCard key={b._id} class_id={class_id} batch={b} />
                        ))}
                    </section>
                </section>
                {batchForm && <BatchForm class_id={class_id} batch="" setBatchForm={setBatchForm}/>}
            </main>
        </div>
    );
}

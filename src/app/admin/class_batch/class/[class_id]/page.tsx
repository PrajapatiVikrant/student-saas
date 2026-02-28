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
import axios, { AxiosError } from "axios";
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
  [key: string]: unknown;
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
  const [class_name, setClass_name] = useState<string>("");

  const [processing, setProcessing] = useState<boolean>(false);
  const [batch, setBatch] = useState<Batch[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [batchForm, setBatchForm] = useState<boolean>(false);

  useEffect(() => {
    getClass();
  }, []);

  // ✅ Get class data
  async function getClass() {
    const token = localStorage.getItem("codeflam01_token");

    try {
      const response = await axios.get<ClassResponse>(
        `/api/v1/kaksha/${class_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setClass_name(response.data.class.name);
      setBatch(response.data.class.batches);
      setSubjects(response.data.class.subjects);
    } catch (error: unknown) {
      const err = error as AxiosError;

      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("codeflam01_token");
        router.push("/login");
      } else {
        toast.error("Failed to load class list ❌");
      }
    } finally {
      setLoading(false);
    }
  }

 

  if (loading) {
    return (
      <main className="flex flex-col h-screen justify-center items-center bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
        <CircularIndeterminate size={80} />
        <span className="mt-2 text-sm text-slate-500 dark:text-slate-300">
          Loading...
        </span>
      </main>
    );
  }

  return (
    <div className="min-h-screen overflow-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-white">
      
      {/* HEADER */}
      <header className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-950/60 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{class_name}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">
              Manage subjects and batches of this class.
            </p>
          </div>

          <button
            onClick={() => setBatchForm(true)}
            className="w-full sm:w-fit flex justify-center cursor-pointer items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-medium text-sm shadow hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none"
          >
            <FiPlusCircle size={18} /> Create Batch
          </button>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-6 space-y-10 max-w-7xl mx-auto">
        
       

        {/* BATCHES SECTION */}
        <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="flex items-center text-xl sm:text-2xl font-bold gap-2">
              <FiLayers /> <span>Batches</span>
            </h2>

           
          </div>

          {/* Batch Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {batch.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-300 text-sm">
                No batches available
              </p>
            ) : (
              batch.map((b) => (
                <BatchCard key={b._id} class_id={class_id} batch={b} refresh={getClass} />
              ))
            )}
          </div>
        </section>

        {/* BATCH FORM MODAL */}
        {batchForm && (
          <BatchForm class_id={class_id} batch="" setBatchForm={setBatchForm} refresh={getClass} />
        )}
      </main>
      <br /><br />
    </div>
  );
}

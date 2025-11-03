"use client";
import Link from "next/link";
import { MdOutlineModeEdit } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import { PiCalendarCheckLight } from "react-icons/pi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";

type BatchCardProps = {
  class_id:string;
  batch: {
    _id:string;
    batch_name: string;
    batch_fee: number;
    fee_method: string;
    batch_timing: string;
    batch_days: string;
  };
};

export default function BatchCard({ batch,class_id }: BatchCardProps) {
  const [students,setStudents] = useState([]);
  const router = useRouter();
  useEffect(() => {
    getBatchStudents();
  }, []);

   async function getBatchStudents() {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Session expired. Please log in again.");
      router.push("/login");
      return;
    }

   
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/student/${class_id}/${batch._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

    
      setStudents(response.data.students);
    } catch (error: any) {
      console.error("Error fetching students:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("adminToken");
        router.push("/login");
      } else {
        toast.error("Failed to fetch students.");
      }
    } 
  }

 

  return (
    <article className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      {/* Header */}
      <header className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white capitalize">
            {batch.batch_name}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {batch.fee_method } Payment
          </p>
        </div>
        <button
          title="Edit Batch"
          className="text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <MdOutlineModeEdit size={18} />
        </button>
      </header>

      {/* Details */}
      <section className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <FaUsers className="text-blue-600 dark:text-blue-400" size={14} />
          <span>{students.length} Students</span>
        </div>
        <div className="flex items-center gap-2">
          <IoTimeOutline className="text-blue-600 dark:text-blue-400" size={14} />
          <span>{batch.batch_timing}</span>
        </div>
        <div className="flex items-center gap-2">
          <PiCalendarCheckLight
            className="text-blue-600 dark:text-blue-400"
            size={14}
          />
          <span>{batch.batch_days}</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
        <div>
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            ₹{batch.batch_fee}
          </p>
          <p className="text-xs text-gray-500">/{batch.fee_method}</p>
        </div>

        <Link href={`/admin/class_batch/class/batch/students/${class_id}/${batch._id}`}>
          <button className="bg-blue-600 hover:bg-blue-500 cursor-pointer text-white text-xs px-3 py-1.5 rounded-lg transition-all duration-200 shadow-sm">
            View
          </button>
        </Link>
      </footer>

    </article>
  );
}

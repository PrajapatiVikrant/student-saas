"use client";
import Link from "next/link";
import { MdOutlineModeEdit } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import { PiCalendarCheckLight } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";   // DELETE ICON
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";
import BatchForm from "../forms/BatchForm";
import Confirmation from "../forms/Confirmation";

type BatchCardProps = {
  class_id: string;
  batch: {
    _id: string;
    batch_name: string;
    batch_fee: number;
    fee_method: string;
    batch_timing: string;
    batch_days: string;
  };
};

export default function BatchCard({ batch, class_id }: BatchCardProps) {
  const [students, setStudents] = useState([]);
  const [batchForm, setBatchForm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [confirmationForm, setConfirmationForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getBatchStudents();
  }, []);

  async function getBatchStudents() {
    const token = localStorage.getItem("codeflam01_token");
    if (!token) {
      toast.error("Session expired. Please log in again.");
      router.push("/login");
      return;
    }

    try {
      const response = await axios.get(
        `https://student-backend-saas.vercel.app/api/v1/student/${class_id}/${batch._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStudents(response.data.students);
    } catch (error: any) {
      console.error("Error fetching students:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("codeflam01_token");
        router.push("/login");
      } else {
        toast.error("Failed to fetch students.");
      }
    }
  }

  // -------------------------
  // DELETE BATCH FUNCTION
  // -------------------------
  const onClose = () => setConfirmationForm(false);
  const onConfirm = async () => {
    const token = localStorage.getItem("codeflam01_token");
    if (!token) {
      toast.error("Session expired. Please log in again.");
      router.push("/login");
      return;
    }
     setProcessing(true)
    try {
     const response = await axios.delete(
        `https://student-backend-saas.vercel.app/api/v1/batch/${class_id}/${batch._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message);
      router.refresh();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error("Failed to delete batch.");
    }finally{
      setProcessing(false)
    }
  }


  return (
    <>
      <article className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">

        {/* Header */}
        <header className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white capitalize">
              {batch.batch_name}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {batch.fee_method} Payment
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-2">
            {/* Edit */}
            <button
              title="Edit Batch"
              className="text-gray-400 hover:text-blue-600 cursor-pointer dark:hover:text-blue-400 transition"
              onClick={() => setBatchForm(true)}
            >
              <MdOutlineModeEdit size={18} />
            </button>

            {/* Delete */}
            <button
              onClick={() => setConfirmationForm(true)}
              title="Delete Batch"
              className="text-gray-400 hover:text-red-600 cursor-pointer dark:hover:text-red-400 transition"
            >
              <RiDeleteBin6Line size={18} />
            </button>
          </div>
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

          <Link
            href={`/admin/class_batch/class/batch/students/${class_id}/${batch._id}`}
          >
            <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg transition duration-200 shadow-sm">
              View
            </button>
          </Link>
        </footer>
      </article>
      {/* --- Edit Class Modal --- */}
      {batchForm && (
        <BatchForm class_id={class_id} batch={batch} setBatchForm={setBatchForm} />
      )}

      {confirmationForm && (
        <Confirmation
          onClose={onClose}
          onConfirm={onConfirm}
          name={batch.batch_name}
          info="This action cannot be undone and will permanently remove all related records including 
                              academic, attendance, and payment data associated with this batch."
          processing={processing}
        />
      )}
    </>
  );
}

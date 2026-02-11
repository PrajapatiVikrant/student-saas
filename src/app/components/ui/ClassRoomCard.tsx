import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import Confirmation from "../forms/Confirmation";
import CreateClass from "../forms/CreateClass";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";

type ClassRoomCardProps = {
  id: string;
  imageUrl: string;
  name: string;
  subject: string;
  batch: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function ClassRoomCard({
  id,
  imageUrl,
  name,
  subject,
  batch,

}: ClassRoomCardProps) {
  const [confirmationForm, setConfirmationForm] = useState(false);
  const [form, setForm] = useState(false)
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const onClose = () => setConfirmationForm(false)
  const onConfirm = async() => {

    const token = localStorage.getItem("codeflam01_token");
    setProcessing(true);
    try {
      if (!token) {
        toast.error("Please log in first.");
        router.push("/login");
        return;
      }
        const response = await axios.delete(
        `http://13.53.160.202/api/v1/kaksha/${id}` ,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Class deleted successfully");
      setConfirmationForm(false);
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("codeflam01_token");
        router.push("/login");
      } else {
        toast.error("Failed to delete class ❌");
      }
    } finally {
      setProcessing(false)
    }
  }

  return (
    <article className="bg-white dark:bg-background-dark/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300">
      {/* --- Image Section with Buttons --- */}
      <div className="relative w-full h-48 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }}>
        {/* Top-right buttons over image */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <button
            onClick={() => setForm(true)}
            className="p-2 rounded-lg cursor-pointer bg-white/80 dark:bg-gray-800/70 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 shadow-sm backdrop-blur-sm transition"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => setConfirmationForm(true)}
            className="p-2 rounded-lg cursor-pointer bg-white/80 dark:bg-gray-800/70 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 shadow-sm backdrop-blur-sm transition"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* --- Details Section --- */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Subject: <span className="font-medium">{subject}</span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Batch: <span className="font-medium">{batch}</span>
        </p>

        {/* View Class Button */}
        <Link
          href={`/admin/class_batch/class/${id}`}
          className="inline-block text-center w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          View Class
        </Link>
      </div>
      {/* --- Edit Class Modal --- */}
      {form && (
        <CreateClass id={id} class_name={name} setForm={setForm} />
      )}
      {/* --- Confirmation Modal --- */}
      {confirmationForm && (
        <Confirmation
          onClose={onClose}
          onConfirm={onConfirm}
          name={name}
          info="This action cannot be undone and will permanently remove all related records including 
                  academic, attendance, and payment data associated with this class."
          processing={processing}
        />
      )}
    </article>
  );
}

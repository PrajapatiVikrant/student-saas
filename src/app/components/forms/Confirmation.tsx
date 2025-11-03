"use client";

import { FiAlertTriangle } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

interface DeleteConfirmationProps {
  onClose: () => void;
  onConfirm: () => void;
  studentName?: string;
  processing?: boolean;
}

export default function Confirmation({
  onClose,
  onConfirm,
  studentName = "this student",
  processing = false,
}: DeleteConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
      <div className="bg-white w-[32%] rounded-lg shadow-md p-6 relative animate-fadeIn">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 cursor-pointer right-3 p-1.5 rounded-md hover:bg-gray-100 transition"
        >
          <RxCross2 size={20} />
        </button>

        {/* Warning Icon & Title */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="bg-red-100 text-red-600 p-3 rounded-full">
            <FiAlertTriangle size={30} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Delete Confirmation</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Are you sure you want to <span className="font-semibold text-red-600">delete {studentName}</span>? <br />
            This action cannot be undone and will permanently remove all related records including 
            academic, attendance, and payment data associated with this student.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 cursor-pointer rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={processing}
            className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-md font-medium text-white ${
              processing
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            } transition`}
          >
            {processing ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { FiEye, FiEdit, FiTrash } from "react-icons/fi";
import ParentPortalAccessForm from "../forms/ParentForm";
import { useState } from "react";
import Confirmation from "../forms/Confirmation";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface ViewParentProps {
  parent: any;
  setViewParent: (value: boolean) => void;
  getParents: () => void;

}

export default function ViewParent({ parent, getParents, setViewParent }: ViewParentProps) {
  const [registerForm, setRegisterForm] = useState(false);
  const [confirmationForm, setConfirmationForm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const token = localStorage.getItem("codeflam01_token") || "";
  const router = useRouter();

  const onDelete = () => setConfirmationForm(true);
  const onClose = () => setConfirmationForm(false);
  const onConfirm = async () => {
    setProcessing(true);
    try {

      const res = await axios.delete(
        `/api/v1/parent/${parent._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success("Parent deleted successfully ✅");
        setConfirmationForm(false);
        setViewParent(false);
        getParents();
      }
    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("codeflam01_token");
        router.push("/login");
      } else {
        toast.error("Failed to delete parent ❌");
      }
    } finally {
      setProcessing(false);
    }
  }
  return (
    <div className="fixed inset-0 bg-black/30 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto p-4">

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-3xl p-6 relative animate-fadeIn border border-gray-200 dark:border-gray-700">

        {/* Edit + Delete Buttons (Top Right) */}
        <div className="absolute top-4 right-4 flex gap-3">
          <button
            onClick={() => setRegisterForm(true)}
            className="flex cursor-pointer items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm rounded-md transition"
          >
            <FiEdit size={16} /> Edit
          </button>

          <button
            onClick={onDelete}
            className="flex cursor-pointer items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white text-sm rounded-md transition"
          >
            <FiTrash size={16} /> Delete
          </button>
        </div>

        <br /><br />

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-3">
          Parent Details
        </h2>

        {/* Parent Information */}
        <div className="text-[15px] sm:text-[18px] mt-4 space-y-2 text-gray-700 dark:text-gray-300">
          <p><span className="font-medium text-gray-900 dark:text-gray-100">Name:</span> {parent.name}</p>
          <p><span className="font-medium text-gray-900 dark:text-gray-100">Email:</span> {parent.email}</p>
          <p><span className="font-medium text-gray-900 dark:text-gray-100">Phone:</span> {parent.phone}</p>
          <p>
            <span className="font-medium text-gray-900 dark:text-gray-100">Created:</span>{" "}
            {new Date(parent.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Children Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Children Information
          </h3>

          {/* Table */}
          <div className="overflow-auto border border-gray-300 dark:border-gray-700 rounded-lg">
            <table className="min-w-[800px] w-full border border-gray-300 dark:border-gray-700 text-sm table-auto whitespace-nowrap">
              <thead className="bg-gray-100 dark:bg-gray-800 text-left text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="p-2 border border-gray-300 dark:border-gray-700">Name</th>
                  <th className="p-2 border border-gray-300 dark:border-gray-700">Class</th>
                  <th className="p-2 border border-gray-300 dark:border-gray-700">Batch</th>
                  <th className="p-2 border border-gray-300 dark:border-gray-700 text-center">View</th>
                </tr>
              </thead>

              <tbody>
                {parent.childrens?.map((child: any, index: number) => (
                  <tr
                    key={child._id}
                    className="border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="p-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                      {child.name}
                    </td>
                    <td className="p-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                      {child.class?.name}
                    </td>
                    <td className="p-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                      {child.batch?.name}
                    </td>

                    <td className="p-2 border border-gray-200 dark:border-gray-700 text-center">
                      <Link
                        href={`/admin/student/${child._id}/${index + 1}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                        title="View Student"
                      >
                        <FiEye className="w-5 h-5 mx-auto" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setViewParent(false)}
          className="mt-5 px-5 py-2 cursor-pointer bg-gray-700 hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500 text-white rounded-lg w-fit transition"
        >
          Close
        </button>

      </div>

      {/* Modal */}
      {registerForm && (
        <ParentPortalAccessForm
          parent={parent}
          setViewParent={setViewParent}
          setRegisterForm={setRegisterForm}
          getParents={getParents}
        />
      )}

      {/* Confirmation Modal */}
      {confirmationForm && (
        <Confirmation
          onClose={onClose}
          onConfirm={onConfirm}
          name={parent.name}
          info="This action cannot be undone and will permanently remove all related records including 
      academic, attendance, and payment data associated with this parent."
          processing={processing}
        />
      )}
    </div>
  );
}

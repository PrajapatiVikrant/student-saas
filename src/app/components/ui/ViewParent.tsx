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
        `http://localhost:4000/api/v1/parent/${parent._id}`,
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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto p-4">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 relative animate-fadeIn">

        {/* Edit + Delete Buttons (Top Right) */}
        <div className="absolute top-4 right-4 flex gap-3">
          <button
            onClick={() => setRegisterForm(true)}
            className="flex cursor-pointer items-center gap-1 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
          >
            <FiEdit size={16} /> Edit
          </button>

          <button
            onClick={onDelete}
            className="flex cursor-pointer items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
          >
            <FiTrash size={16} /> Delete
          </button>
        </div>
        <br /><br />
        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
          Parent Details
        </h2>

        {/* Parent Information */}
        <div className="text-[15px] sm:text-[18px] mt-4 space-y-2 text-gray-700">
          <p><span className="font-medium">Name:</span> {parent.name}</p>
          <p><span className="font-medium">Email:</span> {parent.email}</p>
          <p><span className="font-medium">Phone:</span> {parent.phone}</p>
          <p><span className="font-medium">Created:</span> {new Date(parent.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Children Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Children Information
          </h3>

          {/* Table */}
          <div className="overflow-auto border rounded-lg">
            <table className="min-w-[800px]  w-full  border  border-gray-300 text-sm table-auto whitespace-nowrap">
              <thead className="bg-gray-100 text-left text-gray-600">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Class</th>
                  <th className="p-2 border">Batch</th>
                  <th className="p-2 border">Phone</th>
                  <th className="p-2 border text-center">View</th>
                </tr>
              </thead>

              <tbody>
                {parent.childrens?.map((child: any, index: number) => (
                  <tr key={child._id} className="border hover:bg-gray-50">
                    <td className="p-2 border">{child.name}</td>
                    <td className="p-2 border">{child.class?.name}</td>
                    <td className="p-2 border">{child.batch?.name}</td>
                    <td className="p-2 border">{child.phone}</td>

                    <td className="p-2 border text-center">
                      <Link
                        href={`/admin/student/${child._id}/${index + 1}`}
                        className="text-blue-600 hover:text-blue-800 transition"
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
          className="mt-5 px-5 py-2 cursor-pointer bg-gray-700 text-white rounded-lg hover:bg-gray-900 w-fit"
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

      {/* --- Confirmation Modal --- */}
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

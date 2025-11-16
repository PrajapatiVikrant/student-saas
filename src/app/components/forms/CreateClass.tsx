"use client";

import axios from "axios";
import { useState, FormEvent } from "react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CircularIndeterminate from "../ui/CircularIndeterminate";

interface ClassCreationProps {
  id: string;
  class_name: string;
  setForm: (value: boolean) => void;
}

export default function CreateClass({ id, class_name, setForm }: ClassCreationProps) {
  const [name, setName] = useState(id?class_name:"");
  const [nameError, setNameError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Validation
  const validate = () => {
    if (!name.trim()) {
      setNameError("Class name is required");
      return false;
    }
    setNameError("");
    return true;
  };

  // Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Please log in first.");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/kaksha",
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(response.data.message || "Class created successfully!");
      setName("");
      setForm(false);
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("adminToken");
        router.push("/login");
      } else {
        toast.error("Failed to create class ❌");
      }
    } finally {
      setLoading(false);
      window.location.reload()
    }
  };


  // edit
  const handleEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Please log in first.");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/kaksha/${id}` ,
        { class_name:name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(response.data.message || "Class edit successfully!");
      setName("");
      setForm(false);
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("adminToken");
        router.push("/login");
      } else {
        toast.error("Failed to edit class ❌");
      }
    } finally {
      setLoading(false);
      window.location.reload()
    }
  };






 
  return (
    <div className="fixed inset-0 bg-black/25 overflow-auto flex items-center justify-center z-50">
      <div className="p-4 bg-white w-[35%] rounded-lg shadow-md">
        {/* Close Button */}
        <p className="text-black flex justify-end text-2xl">
          <button
            onClick={() => setForm(false)}
            className="cursor-pointer rounded-md hover:bg-gray-100 p-1.5"
          >
            <RxCross2 />
          </button>
        </p>

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{id?"Edit":"Create"} Class</h2>

        {/* Form */}
        <form className="space-y-4" onSubmit={id?handleEdit:handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Class Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 focus:ring-blue-500 ${nameError ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="Enter class name"
            />
            {nameError && (
              <p className="text-red-500 text-sm mt-1">{nameError}</p>
            )}
          </div>

          {/* Submit */}
          <div className="text-right">
            <button
              disabled={loading}
              type="submit"
              className={`${loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
                } text-white px-4 cursor-pointer py-2 rounded-md transition disabled:cursor-not-allowed`}
            >
              {loading ? <CircularIndeterminate size={30} /> : (id?"Edit":"Create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

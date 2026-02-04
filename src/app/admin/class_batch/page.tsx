"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlinePlus } from "react-icons/ai";

import CreateClass from "@/app/components/forms/CreateClass";
import ClassRoomCard from "@/app/components/ui/ClassRoomCard";
import Variants from "@/app/components/ui/Variants";


// ✅ Proper TypeScript types
type VariantLayout = {
  variant: "rectangular" | "text" | "circular";
  width: number;
  height: number;
};

type ClassInfo = {
  _id: string;
  class: {
    thumbnail: string;
    name: string;
    subjects: string[];
    batches: string[];
  };
};

// ✅ Skeleton layout adjusted to match class card
const classCardSkeleton: VariantLayout[] = [
  { variant: "rectangular", width: 300, height: 160 }, // card rectangle
  { variant: "text", width: 200, height: 20 },         // title
  { variant: "text", width: 150, height: 18 },         // subtitle
];

export default function ClassBatch() {
  const [registerForm, setRegisterForm] = useState(false);

  const [classList, setClassList] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getAllClasses();
  }, []);

  async function getAllClasses() {
    try {
      const token = localStorage.getItem("codeflam01_token");
      if (!token) {
        toast.error("No token found. Please login again.");
        router.push("/login");
        return;
      }

      const response = await axios.get("http://localhost:4000/api/v1/kaksha", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClassList(response.data);
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

  return (
    <>
      <main className="flex-grow bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Classes
            </h2>
            <button
              onClick={() => setRegisterForm(true)}
              className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-600 transition-colors"
            >
              <AiOutlinePlus className="text-lg" />
              <span>Add Class</span>
            </button>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? // ✅ Skeleton while loading
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="p-2">
                  <Variants layout={classCardSkeleton} />
                </div>
              ))
              : // ✅ Render real class cards
              classList.map((kaksha, index) => (
                <ClassRoomCard
                  key={kaksha._id}
                  id={kaksha._id}
                  imageUrl={kaksha.class.thumbnail}
                  name={kaksha.class.name}
                  subject={kaksha.class.subjects.length.toString()}
                  batch={kaksha.class.batches.length.toString()}
                />
              ))}
          </div>
        </div>
      </main>
        
      {registerForm && <CreateClass id="" class_name="" setForm={setRegisterForm} />}
    </>
  );
}

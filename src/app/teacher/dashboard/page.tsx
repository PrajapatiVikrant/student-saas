"use client";

import CircularIndeterminate from "@/app/components/ui/CircularIndeterminate";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";

/* TYPES */

type class_teacher = {
  class_id: any;
  batch_id: any;
}


type Subject = {
  _id: string;
  name: string;
};

type Profile = {
  _id: string;
  admin_id: string;
  name: string;
  email: string;
  class_teacher: class_teacher;
  classes: any;
  phone: string;
  is_active: boolean;
  salary_amount: number;
  salary_type: string;
  subject: Subject[];
};

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);
    try {
      const token = localStorage.getItem("teacherToken");

      if (!token) {
        router.push("/teacher/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:4000/api/v1/teacher/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setProfile(response.data);
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        toast.error("Session expired. Please login again ❌");
        router.push("/teacher/login");
        return;
      }

      toast.error("Failed to fetch profile data ❌");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
      return (
        <main className="flex flex-col h-screen justify-center items-center">
          <CircularIndeterminate size={80} />
          <span>Loading...</span>
        </main>
      );
    }

  return (
    <main className="grow pb-24">
      <h1 className="text-[#111318] dark:text-white text-[32px] font-bold px-4 pb-3 pt-2">
        Good Morning, {profile?.name ?? "Teacher"}
      </h1>

      {/* HOMEROOM CARD */}
      <div className="p-4">
        <div className="flex flex-col xl:flex-row rounded-xl shadow-sm bg-white dark:bg-background-dark dark:border dark:border-gray-700">
          <div
            className="w-full bg-center bg-cover aspect-video rounded-t-xl"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDmb2nuuaOlVeT_aY7TmRwjMBh3THJ8PTI5MQyoMscVNG7JelhyQOAi2pF2Kwin9viV7Robvq-Fu7KWMZneQaa00PMN6J0n7MVf3cc0APEyAJ5-QRoNih_yawoqBcTrrgw4z88xSM2JRP9M95h6kA19QMKHCl9lVG8iDD8EBtCz-EhdGnlxCCn-as-TP4dF7yAYOVw0GlZOnRqsfaPPa7bF3HWRfsXhWBDrnXiDkLVELSVyhvBB7YnEVu8RcSXAD0aerMtggvNIvDrl")',
            }}
          />

          <div className="flex flex-col gap-2 w-full py-4 px-4">
            <p className="text-[#111318] dark:text-white text-lg font-bold">
              Homeroom: {profile?.class_teacher?.class_id?.class?.name ?? "Not Assigned"}
            </p>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#616f89] dark:text-gray-400">
                  Attendance Pending
                </p>
                <p className="text-[#616f89] dark:text-gray-400">
                  {profile?.classes?.length ?? 0} Classes
                </p>
              </div>

              <button className="h-10 px-4 bg-primary text-white rounded-lg">
                Take Attendance
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <h2 className="text-[#111318] dark:text-white text-[22px] font-bold px-4 pb-3 pt-5">
        My Classes
      </h2>

      <div className="px-4 py-3">
        <div className="flex h-12 rounded-lg bg-white dark:bg-gray-800">
          <div className="flex items-center pl-4 text-xl text-gray-400">
            <FiSearch />
          </div>
          <input
            className="w-full px-4 bg-transparent outline-none text-[#111318] dark:text-white"
            placeholder="Find a class"
          />
        </div>
      </div>

      {/* CLASS LIST */}
      <div className="flex flex-col gap-3 px-4">
        {profile?.classes?.map((cls:any) => (
          <div
            key={cls._id}
            className="flex items-center justify-between rounded-xl p-4 bg-white dark:bg-background-dark dark:border dark:border-gray-700 shadow-sm"
          >
            <div>
              <p className="font-bold">{cls.class_name}</p>
              <p className="text-sm text-gray-500">{cls.room}</p>
            </div>

            <Link href={`/teacher/class/${cls.class_id}`} className="h-9 text-2xl cursor-pointer hover:bg-amber-100 text-blue-400 px-4 rounded-lg bg-primary/10 text-primary">
              <FaEye/> 
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}

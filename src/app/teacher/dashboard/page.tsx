"use client";

// import CircularIndeterminate from "@/app/components/ui/CircularIndeterminate";
// import axios from "axios";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { FaEye } from "react-icons/fa";
// import { FiSearch } from "react-icons/fi";
// import { toast } from "react-toastify";

// /* TYPES */

// type class_teacher = {
//   class_id: any;
//   batch_id: any;
// }


// type Subject = {
//   _id: string;
//   name: string;
// };

// type Profile = {
//   _id: string;
//   admin_id: string;
//   name: string;
//   email: string;
//   class_teacher: class_teacher;
//   classes: any;
//   phone: string;
//   is_active: boolean;
//   salary_amount: number;
//   salary_type: string;
//   subject: Subject[];
// };

// export default function Dashboard() {
//   const [profile, setProfile] = useState<Profile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [greeting,setGreeting] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     getGreeting();
//     fetchProfile();
//   }, []);



//   function getGreeting() {
//   const hour = new Date().getHours();
//   console.log("hour", hour);
//   if (hour >= 5 && hour < 12) {

//     setGreeting("Good Morning ☀️")
//     return "Good Morning";
//   } else if (hour >= 12 && hour < 16) {

//     setGreeting("Good Afternoon")
//     return "Good Afternoon 🌤️";
//   } else if (hour >= 16 && hour < 21) {
//     setGreeting("Good Evening")
//     return "Good Evening 🌆";
//   } else {
//     setGreeting("Good Night")
//     return "Good Night 🌙";
//   }
// }


//   async function fetchProfile() {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("codeflam01_token");

//       if (!token) {
//         router.push("/teacher/login");
//         return;
//       }

//       const response = await axios.get(
//         "http://localhost:4000/api/v1/teacher/profile",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log(response.data);
//       setProfile(response.data);
//     } catch (error: any) {
//       const status = error?.response?.status;

//       if (status === 401 || status === 403) {
//         toast.error("Session expired. Please login again ❌");
//         router.push("/teacher/login");
//         return;
//       }

//       toast.error("Failed to fetch profile data ❌");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (loading) {
//       return (
//         <main className="flex flex-col h-screen justify-center items-center">
//           <CircularIndeterminate size={80} />
//           <span>Loading...</span>
//         </main>
//       );
//     }

//   return (
//     <main className="grow pb-24">
//       <h1 className="text-[#111318] dark:text-white text-[32px] font-bold px-4 pb-3 pt-2">
//         {greeting}, {profile?.name ?? "Teacher"}
//       </h1>

//       {/* HOMEROOM CARD */}
//       <div className="p-4">
//         <div className="flex flex-col xl:flex-row rounded-xl shadow-sm bg-white dark:bg-background-dark dark:border dark:border-gray-700">
//           <div
//             className="w-full bg-center bg-cover aspect-video rounded-t-xl"
//             style={{
//               backgroundImage:
//                 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDmb2nuuaOlVeT_aY7TmRwjMBh3THJ8PTI5MQyoMscVNG7JelhyQOAi2pF2Kwin9viV7Robvq-Fu7KWMZneQaa00PMN6J0n7MVf3cc0APEyAJ5-QRoNih_yawoqBcTrrgw4z88xSM2JRP9M95h6kA19QMKHCl9lVG8iDD8EBtCz-EhdGnlxCCn-as-TP4dF7yAYOVw0GlZOnRqsfaPPa7bF3HWRfsXhWBDrnXiDkLVELSVyhvBB7YnEVu8RcSXAD0aerMtggvNIvDrl")',
//             }}
//           />

//           <div className="flex flex-col gap-2 w-full py-4 px-4">
//             <p className="text-[#111318] dark:text-white text-lg font-bold">
//               Homeroom: {profile?.class_teacher?.class_id?.class?.name ?? "Not Assigned"}
//             </p>

//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-[#616f89] dark:text-gray-400">
//                   Attendance Pending
//                 </p>
//                 <p className="text-[#616f89] dark:text-gray-400">
//                   {profile?.classes?.length ?? 0} Classes
//                 </p>
//               </div>

//               <button className="h-10 px-4 bg-primary text-white rounded-lg">
//                 Take Attendance
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* SEARCH */}
//       <h2 className="text-[#111318] dark:text-white text-[22px] font-bold px-4 pb-3 pt-5">
//         My Classes
//       </h2>

//       <div className="px-4 py-3">
//         <div className="flex h-12 rounded-lg bg-white dark:bg-gray-800">
//           <div className="flex items-center pl-4 text-xl text-gray-400">
//             <FiSearch />
//           </div>
//           <input
//             className="w-full px-4 bg-transparent outline-none text-[#111318] dark:text-white"
//             placeholder="Find a class"
//           />
//         </div>
//       </div>

//       {/* CLASS LIST */}
//       <div className="flex flex-col gap-3 px-4">
//         {profile?.classes?.map((cls:any) => (
//           <div
//             key={cls._id}
//             className="flex items-center justify-between rounded-xl p-4 bg-white dark:bg-background-dark dark:border dark:border-gray-700 shadow-sm"
//           >
//             <div>
//               <p className="font-bold">{cls.class_name}</p>
//               <p className="text-sm text-gray-500">{cls.room}</p>
//             </div>

//             <Link href={`/teacher/class/${cls.class_id}`} className="h-9 text-2xl cursor-pointer hover:bg-amber-100 text-blue-400 px-4 rounded-lg bg-primary/10 text-primary">
//               <FaEye/> 
//             </Link>
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  Search,
  Menu,
  Bell,
  Users,
  BookOpen,
  ArrowRight,
  Clock,
  CalendarDays,
  MoreVertical,
  LogOut,
  GraduationCap,
  MapPin
} from "lucide-react";


import { Button } from "@/app/components/ui/attendanceUi/Button";
import { Input } from "@/app/components/ui/attendanceUi/Input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/app/components/ui/attendanceUi/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/attendanceUi/Avatar";
import { Skeleton } from "@/app/components/ui/attendanceUi/Skeleton";
import { Badge } from "@/app/components/ui/attendanceUi/Badge";
import { Separator } from "@/app/components/ui/attendanceUi/Separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@//app/components/ui/attendanceUi/Dropdown-menu";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CircularIndeterminate from "@/app/components/ui/CircularIndeterminate";
import { toast } from "react-toastify";

// --- Types (Preserved from user code) ---
type class_teacher = {
  class_id: any;
  batch_id: any;
};

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
  const [homeclass, setHomeclass] = useState<any>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [todayAttendanceStatus,setTodayAttendanceStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Helper function for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  useEffect(() => {
    setGreeting(getGreeting());

    // Simulate API fetch
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("codeflam01_token");

        if (!token) {
          router.push("/teacher/login");
          return;
        }

        const profileResponse = await axios.get(
          "http://localhost:4000/api/v1/teacher/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(profileResponse.data);
        setProfile(profileResponse.data);
        const today = new Date().toISOString().split("T")[0];
        const homeclassResponse = await axios.get(
          `http://localhost:4000/api/v1/attendance/${today}/${profileResponse.data.class_teacher.class_id._id}/${profileResponse.data.class_teacher.batch_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
         if(homeclassResponse?.data?.message==="No attendance found for this class, batch, and date") {
                   setTodayAttendanceStatus(false)
                   setTotalStudents(homeclassResponse?.data?.numberOfStudent || 0)
                  return;
          }
          setTotalStudents(homeclass?.data?.attendance.length)

       
       
      } catch (error:any) {
        
        console.log(error)
        toast.error("Failed to fetch profile data");
         const status = error?.response?.status;
              

               if (status === 401 || status === 403) {
                toast.error("Session expired. Please login again ❌");
                router.push("/teacher/login");
                return;
              }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const filteredClasses = profile?.classes.filter((cls: any) =>
    cls.class_name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <CircularIndeterminate size={60} />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className=" bg-slate-50 dark:bg-slate-900 pb-20 font-sans">
     


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {greeting}, {profile?.name.split(' ')[0]}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Here's what's happening in your classes today.
            </p>
          </div>
          <div className="flex items-center text-sm font-medium text-slate-500 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
            <CalendarDays className="w-4 h-4 mr-2 text-indigo-500" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Homeroom Hero Card */}
        <section>
          <div className="relative overflow-hidden rounded-2xl bg-indigo-900 shadow-xl">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1586144131462-fa2a2b6d070c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Classroom"
                className="w-full h-full object-cover opacity-40 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 to-indigo-900/40" />
            </div>

            <div className="relative p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-4 max-w-xl">
                <Badge className="bg-indigo-500/20 text-indigo-100 hover:bg-indigo-500/30 border-0">
                  <Users className="w-3 h-3 mr-1" /> Homeroom Class
                </Badge>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {profile?.class_teacher?.class_id?.class?.name ?? "Not Assigned"}
                  </h2>
                  <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
                    You have <span className="font-semibold text-white">{totalStudents}</span> students in this batch.
                    {!todayAttendanceStatus && "Attendance for today has not been marked yet."}
                  </p>
                </div>
              </div>
              <Link href="/teacher/attendance" className="bg-white flex items-center justify-between p-2.5 rounded-xs text-indigo-900 hover:bg-indigo-50 shadow-lg font-semibold border-0 w-full md:w-auto">
                Take Attendance <ArrowRight className="w-4 h-4 ml-2" />
              </Link>

            </div>
          </div>
        </section>

        {/* Classes Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              My Classes
            </h2>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search classes or rooms..."
                className="pl-9 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.map((cls: any) => (
              <Link
                key={cls._id}
                href={`/teacher/class/${cls.class_id}`}
                className="group"
              >
                <Card className="h-24 flex items-center justify-center 
        bg-white dark:bg-slate-800 
        border border-slate-200 dark:border-slate-700
        hover:border-indigo-500 hover:shadow-md 
        transition-all duration-200"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white 
          group-hover:text-indigo-600 transition-colors">
                    {cls.class_name}
                  </h3>
                </Card>
              </Link>
            ))}
          </div>

          {filteredClasses.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                <Search className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No classes found</h3>
              <p className="text-slate-500">We couldn't find any classes matching "{searchQuery}"</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}


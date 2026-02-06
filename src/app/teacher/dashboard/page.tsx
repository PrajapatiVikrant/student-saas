"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  BookOpen,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import { Input } from "@/app/components/ui/attendanceUi/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/attendanceUi/Card";
import { Badge } from "@/app/components/ui/attendanceUi/Badge";
import CircularIndeterminate from "@/app/components/ui/CircularIndeterminate";

import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

// --- Types ---
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

  const [totalStudents, setTotalStudents] = useState(0);
  const [todayAttendanceStatus, setTodayAttendanceStatus] = useState(false);

  const [todayEvents, setTodayEvents] = useState<any[]>([]);
  const [eventLoading, setEventLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  // Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning ☀️";
    if (hour >= 12 && hour < 17) return "Good Afternoon 🌤️";
    if (hour >= 17 && hour < 21) return "Good Evening 🌆";
    return "Good Night 🌙";
  };

  // Fetch profile + attendance + events
  useEffect(() => {
    setGreeting(getGreeting());

    const fetchDashboardData = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("codeflam01_token");

        if (!token) {
          router.push("/teacher/login");
          return;
        }

        // 1) Fetch Profile
        const profileResponse = await axios.get(
          "http://localhost:4000/api/v1/teacher/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProfile(profileResponse.data);

        const teacherId = profileResponse.data._id;

        const today = new Date().toISOString().split("T")[0];
        const classId = profileResponse.data.class_teacher.class_id._id;
        const batchId = profileResponse.data.class_teacher.batch_id;

        // 2) Fetch Attendance (Today)
        try {
          const homeclassResponse = await axios.get(
            `http://localhost:4000/api/v1/attendance/${today}/${classId}/${batchId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (
            homeclassResponse?.data?.message ===
            "No attendance found for this class, batch, and date"
          ) {
            setTodayAttendanceStatus(false);
            setTotalStudents(homeclassResponse?.data?.numberOfStudent || 0);
          } else {
            setTodayAttendanceStatus(true);
            setTotalStudents(homeclassResponse?.data?.attendance?.length || 0);
          }
        } catch (err) {
          console.log("Attendance fetch error:", err);
        }

        // 3) Fetch Events
        setEventLoading(true);

        const eventRes = await axios.get(
          "http://localhost:4000/api/v1/event",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const allEvents = eventRes.data.events || [];

        // FILTER: only today's events AND added by this teacher
        const filteredTodayEvents = allEvents.filter((event: any) => {
          const eventDate = event.date?.split("T")[0];
          const isToday = eventDate === today;

          const addedById = event?.added_by?._id || event?.added_by;
          const isTeacherEvent = addedById === teacherId;

          return isToday && isTeacherEvent;
        });

        setTodayEvents(filteredTodayEvents);
      } catch (error: any) {
        console.log(error);

        const status = error?.response?.status;

        if (status === 401 || status === 403) {
          toast.error("Session expired. Please login again ❌");
          router.push("/teacher/login");
          return;
        }

        toast.error("Failed to fetch dashboard data ❌");
      } finally {
        setEventLoading(false);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const filteredClasses =
    profile?.classes.filter((cls: any) =>
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
    <div className="bg-slate-50 dark:bg-slate-900 pb-20 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {greeting}, {profile?.name?.split(" ")[0] || "Teacher"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Here's what's happening in your classes today.
            </p>
          </div>

          <div className="flex items-center text-sm font-medium text-slate-500 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
            <CalendarDays className="w-4 h-4 mr-2 text-indigo-500" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Homeroom Hero Card */}
        <section>
          <div className="relative overflow-hidden rounded-2xl bg-indigo-900 shadow-xl">
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
                    {profile?.class_teacher?.class_id?.class?.name ??
                      "Not Assigned"}
                  </h2>

                  <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
                    You have{" "}
                    <span className="font-semibold text-white">
                      {totalStudents}
                    </span>{" "}
                    students in this batch.{" "}
                    {!todayAttendanceStatus &&
                      " Attendance for today has not been marked yet."}
                  </p>
                </div>
              </div>

              <Link
                href="/teacher/attendance"
                className="bg-white flex items-center justify-between p-3 rounded-lg text-indigo-900 hover:bg-indigo-50 shadow-lg font-semibold border-0 w-full md:w-auto"
              >
                Take Attendance <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* TODAY EVENTS SECTION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-indigo-600" />
              My Today Events
            </h2>

            <Link
              href="/teacher/event"
              className="text-sm font-semibold text-indigo-600 hover:underline"
            >
              View All
            </Link>
          </div>

          {eventLoading ? (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-slate-500">Loading events...</p>
            </div>
          ) : todayEvents.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <p className="text-slate-500 font-medium">
                No events created by you for today 📌
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayEvents.map((event: any) => (
                <Card
                  key={event._id}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md transition"
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription className="text-sm text-slate-500">
                      {event.class?.class_name} • {event.batch?.batch_name}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {event.description || "No description"}
                    </p>

                    <p className="mt-3 text-xs text-slate-500">
                      Added by:{" "}
                      <span className="font-semibold">
                        {event?.added_by?.name || profile?.name}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
                placeholder="Search classes..."
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
                <Card className="h-24 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:shadow-md transition-all duration-200">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
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
              <h3 className="text-lg font-medium text-slate-900">
                No classes found
              </h3>
              <p className="text-slate-500">
                We couldn't find any classes matching "{searchQuery}"
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

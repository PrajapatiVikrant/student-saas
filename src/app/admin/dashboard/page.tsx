"use client";

import { JSX, useEffect, useMemo, useState } from "react";
import { PiStudentBold } from "react-icons/pi";
import { FaPeopleGroup, FaLayerGroup } from "react-icons/fa6";
import { MdOutlinePayments } from "react-icons/md";
import { GiTimeTrap } from "react-icons/gi";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import Variants from "@/app/components/ui/Variants";
import Quickstatus from "@/app/components/ui/QuickStatus";
import { CalendarDays, School } from "lucide-react";

// ================= TYPES =================
type DashboardCard = {
  title: string;
  data: string;
  icon: JSX.Element;
  bg: string;
};

type QuickStatus = {
  icon: string;
  title: string;
  desc: string;
  value: string;
};

type VariantLayout = {
  variant: "rectangular" | "text" | "circular";
  width: number;
  height: number;
};

type EventType = {
  _id: string;
  title: string;
  date: string;
  description: string;
  added_by: string;
  class: {
    id: string;
    class_name: string;
  };
  batch: {
    id: string;
    batch_name: string;
  };
};

// ================= SKELETON =================
const dashboardSkeleton: VariantLayout[] = [
  { variant: "rectangular", width: 300, height: 90 },
];

const quickStsSkeleton: VariantLayout[] = [
  { variant: "rectangular", width: 1000, height: 100 },
];

const eventSkeleton: VariantLayout[] = [
  { variant: "rectangular", width: 1000, height: 140 },
];

// ================= UTILS =================
const formatDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const isSameDay = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

export default function Dashboard() {
  const router = useRouter();

  const [dashboardCards, setDashboardCards] = useState<DashboardCard[]>([
    {
      title: "Total Students",
      data: "0",
      icon: <PiStudentBold className="text-2xl text-blue-600" />,
      bg: "from-blue-50 to-blue-100",
    },
    {
      title: "Total Teachers",
      data: "0",
      icon: <FaPeopleGroup className="text-2xl text-green-600" />,
      bg: "from-green-50 to-green-100",
    },
    {
      title: "Total Classes",
      data: "0",
      icon: <FaLayerGroup className="text-2xl text-purple-600" />,
      bg: "from-purple-50 to-purple-100",
    },
    {
      title: "Fee Collected",
      data: `₹0`,
      icon: <MdOutlinePayments className="text-2xl text-emerald-600" />,
      bg: "from-emerald-50 to-emerald-100",
    },
    {
      title: "Pending Dues",
      data: `₹0`,
      icon: <GiTimeTrap className="text-2xl text-red-600" />,
      bg: "from-red-50 to-red-100",
    },
  ]);

  const [quickSts, setQuickSts] = useState<QuickStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const [events, setEvents] = useState<EventType[]>([]);
  const [myId, setMyId] = useState<string>("");

  useEffect(() => {
    getDashboardData();
    getEvents();
  }, []);

  // ================= FETCH DASHBOARD =================
  async function getDashboardData() {
    if (!localStorage.getItem("codeflam01_token")) {
      toast.error("Please login to access the admin dashboard.");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("codeflam01_token");

      const response = await axios.get(
        "/api/v1/admin/dashboard/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;
      console.log("Dashboard Data:", data);
      setDashboardCards([
        {
          title: "Total Students",
          data: data.totalStudents?.toString() || "0",
          icon: <PiStudentBold className="text-2xl text-blue-600" />,
          bg: "from-blue-50 to-blue-100",
        },
        {
          title: "Total Teachers",
          data: data.totalTeachers?.toString() || "0",
          icon: <FaPeopleGroup className="text-2xl text-green-600" />,
          bg: "from-green-50 to-green-100",
        },
        {
          title: "Total Classes",
          data: data.totalClasses?.toString() || "0",
          icon: <FaLayerGroup className="text-2xl text-purple-600" />,
          bg: "from-purple-50 to-purple-100",
        },
        {
          title: "Fee Collected",
          data: `₹${data.totalFeeCollected || 0}`,
          icon: <MdOutlinePayments className="text-2xl text-emerald-600" />,
          bg: "from-emerald-50 to-emerald-100",
        },
        {
          title: "Pending Dues",
          data: `₹${data.totalPendingDues || 0}`,
          icon: <GiTimeTrap className="text-2xl text-red-600" />,
          bg: "from-red-50 to-red-100",
        },
      ]);

      setQuickSts([
        {
          icon: "📊",
          title: "Attendance",
          desc: "Today",
          value: data.overallAttendancePercentage || "0%",
        },
        {
          icon: "📅",
          title: "Scheduled Events",
          desc: "This month",
          value: data.totalEvent?.toString() || "0",
        },
      ]);
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("codeflam01_token");
        router.push("/login");
      } else {
        toast.error("Failed to fetch dashboard data ❌");
      }
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  // ================= FETCH EVENTS =================
  async function getEvents() {
    try {
      const token = localStorage.getItem("codeflam01_token");
      if (!token) return;

      const res = await axios.get("/api/v1/event", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMyId(res.data.userId);
      setEvents(res.data.events || []);
    } catch (err) {
      console.log(err);
    }
  }

  // ================= TODAY & UPCOMING =================
  const todayEvents = useMemo(() => {
    return events
      .filter((e) => e.added_by === myId)
      .filter((e) => isSameDay(e.date));
  }, [events, myId]);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    return events
      .filter((e) => new Date(e.date) > today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 6);
  }, [events]);
return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">

    {/* Header */}
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <School className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Dashboard
            </h1>

            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Overview of students, teachers, fees and events.
            </p>
          </div>
        </div>
      </div>
    </div>

    <main className="max-w-6xl mx-auto p-6">

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {dashboardCards.map((card, index) => (
          <div key={index}>
            {loading ? (
              <Variants layout={dashboardSkeleton} />
            ) : (
              <div
                className={`flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r ${card.bg} dark:from-slate-800 dark:to-slate-700 p-5 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition`}
              >
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {card.title}
                  </p>

                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                    {card.data}
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700">
                  {card.icon}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <h2 className="mt-10 mb-4 text-xl font-bold text-slate-800 dark:text-white">
        Quick Stats
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <>
            <Variants layout={quickStsSkeleton} />
            <Variants layout={quickStsSkeleton} />
          </>
        ) : (
          quickSts.map((stat, i) => (
            <Quickstatus
              key={i}
              icon={stat.icon}
              title={stat.title}
              desc={stat.desc}
              value={stat.value}
            />
          ))
        )}
      </div>

      {/* EVENTS SECTION */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* TODAY EVENTS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="text-blue-600 dark:text-blue-400" size={20} />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Today Events (Added By You)
            </h2>
          </div>

          {loading ? (
            <Variants layout={eventSkeleton} />
          ) : todayEvents.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No events added by you for today.
            </p>
          ) : (
            <div className="space-y-4">
              {todayEvents.map((event) => (
                <div
                  key={event._id}
                  className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-800"
                >
                  <h3 className="font-bold text-slate-800 dark:text-white">
                    {event.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    📅 {formatDate(event.date)}
                  </p>

                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">
                    <span className="font-semibold">Class:</span>{" "}
                    {event.class.class_name} |{" "}
                    <span className="font-semibold">Batch:</span>{" "}
                    {event.batch.batch_name}
                  </p>

                  {event.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                      {event.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* UPCOMING EVENTS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="text-emerald-600 dark:text-emerald-400" size={20} />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Upcoming Events
            </h2>
          </div>

          {loading ? (
            <Variants layout={eventSkeleton} />
          ) : upcomingEvents.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No upcoming events available.
            </p>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event._id}
                  className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-slate-800 dark:text-white">
                      {event.title}
                    </h3>

                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 font-semibold">
                      {formatDate(event.date)}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">
                    <span className="font-semibold">Class:</span>{" "}
                    {event.class.class_name} |{" "}
                    <span className="font-semibold">Batch:</span>{" "}
                    {event.batch.batch_name}
                  </p>

                  {event.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                      {event.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>

    <br /><br />
  </div>
);

}

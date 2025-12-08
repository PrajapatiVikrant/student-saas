"use client";
import { JSX, useEffect, useState } from "react";
import { PiStudentBold } from "react-icons/pi";
import { FaPeopleGroup, FaLayerGroup } from "react-icons/fa6";
import { MdOutlinePayments } from "react-icons/md";
import { GiTimeTrap } from "react-icons/gi";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import Variants from "@/app/components/ui/Variants";
import Quickstatus from "@/app/components/ui/QuickStatus";

// ✅ Correct primitive types
type DashboardCard = {
  title: string;
  data: string;
  icon: JSX.Element;
};

type QuickStatus = {
  icon: string; // ✅ lowercase string
  title: string;
  desc: string;
  value: string;
};

type VariantLayout = {
  variant: "rectangular" | "text" | "circular"; // ✅ matches MUI Skeleton variants
  width: number;
  height: number;
};

// ✅ Skeleton layouts
const dashboardSkeleton: VariantLayout[] = [
  {
    variant: "rectangular",
    width: 210,
    height: 60,
  },
];

const quickStsSkeleton: VariantLayout[] = [
  {
    variant: "rectangular",
    width: 1000,
    height: 100,
  },
];

export default function Dashboard() {
  const [dashboardCards, setDashboardCards] = useState<DashboardCard[]>([
    {
          title: "Total Students",
          data: "0",
          icon: <PiStudentBold className="text-2xl text-blue-600" />,
        },
        {
          title: "Total Teachers",
          data: "0",
          icon: <FaPeopleGroup className="text-2xl text-green-600" />,
        },
        {
          title: "Total Classes",
          data: "0",
          icon: <FaLayerGroup className="text-2xl text-purple-600" />,
        },
        {
          title: "Fee Collected",
          data: `₹0`,
          icon: <MdOutlinePayments className="text-2xl text-emerald-600" />,
        },
        {
          title: "Pending Dues",
          data: `₹0`,
          icon: <GiTimeTrap className="text-2xl text-red-600" />,
        },
  ]);
  const [quickSts, setQuickSts] = useState<QuickStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getDashboardData();
  }, []);

  async function getDashboardData() {
    if(!localStorage.getItem("adminToken")){
      toast.error("Please login to access the admin dashboard.");
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("No token found. Please login again.");
        router.push("/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:4000/api/v1/admin/dashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      setDashboardCards([
        {
          title: "Total Students",
          data: data.totalStudents?.toString() || "0",
          icon: <PiStudentBold className="text-2xl text-blue-600" />,
        },
        {
          title: "Total Teachers",
          data: data.totalTeachers?.toString() || "0",
          icon: <FaPeopleGroup className="text-2xl text-green-600" />,
        },
        {
          title: "Total Classes",
          data: data.totalClasses?.toString() || "0",
          icon: <FaLayerGroup className="text-2xl text-purple-600" />,
        },
        {
          title: "Fee Collected",
          data: `₹${data.totalFeeCollected || 0}`,
          icon: <MdOutlinePayments className="text-2xl text-emerald-600" />,
        },
        {
          title: "Pending Dues",
          data: `₹${data.totalPendingDues || 0}`,
          icon: <GiTimeTrap className="text-2xl text-red-600" />,
        },
      ]);

      setQuickSts([
        {
          icon: "📊",
          title: "Attendance",
          desc: "Today",
          value: data.overallAttendancePercentage,
        },
        {
          icon: "📅",
          title: "Upcoming Exams",
          desc: "This month",
          value: data.totalEvent,
        },
        {
          icon: "🔔",
          title: "Reminders",
          desc: "Pending",
          value: "3",
        },
      ]);

      toast.success("Welcome to EduConnect Admin Portal 🚀");
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("adminToken");
        router.push("/login");
      } else {
        toast.error("Failed to fetch dashboard data ❌");
      }
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header>
        <h1 className="font-bold text-3xl m-5">Dashboard</h1>
      </header>

      <main className="p-4">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardCards.map((card, index) => (
            <div key={index}>
              {loading ? (
                <div className="flex justify-center items-center">
                  <Variants layout={dashboardSkeleton} />
                </div>
              ) : (
                <div className="flex items-center gap-4 rounded-xl bg-blue-50 p-4 shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {card.data}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <h2 className="mt-8 mb-4 text-lg font-bold text-gray-900 dark:text-white">
          Quick Stats
        </h2>

        <div className="space-y-3">
          {loading ? (
            <>
            <Variants layout={quickStsSkeleton} />
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
      </main>
    </>
  );
}

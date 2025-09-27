import { PiStudentBold } from "react-icons/pi";
import { FaPeopleGroup, FaLayerGroup } from "react-icons/fa6";
import { MdOutlinePayments } from "react-icons/md";
import { GiTimeTrap } from "react-icons/gi";
import { JSX } from "react";

type DashboardCard = {
  title: string;
  data: string;
  icon: JSX.Element;
};

const dashboardCards: DashboardCard[] = [
  {
    title: "Total Students",
    data: "250",
    icon: <PiStudentBold className="text-2xl text-blue-600" />,
  },
  {
    title: "Total Teachers",
    data: "15",
    icon: <FaPeopleGroup className="text-2xl text-green-600" />,
  },
  {
    title: "Total Batches",
    data: "20",
    icon: <FaLayerGroup className="text-2xl text-purple-600" />,
  },
  {
    title: "Fee Collected",
    data: "₹800000",
    icon: <MdOutlinePayments className="text-2xl text-emerald-600" />,
  },
  {
    title: "Pending Dues",
    data: "₹5000",
    icon: <GiTimeTrap className="text-2xl text-red-600" />,
  },
];

export default function Dashboard() {
  return (
    <>
      <header>
        <h1 className="font-bold text-3xl m-5">Dashboard</h1>
      </header>

      <main className="p-4">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-xl bg-blue-50 p-4 shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
            >
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
          ))}
        </div>

        {/* Quick Stats */}
        <h2 className="mt-8 mb-4 text-lg font-bold text-gray-900 dark:text-white">
          Quick Stats
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-4 rounded-lg bg-white dark:bg-gray-800 p-3 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <span className="text-blue-600">📊</span>
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                Attendance
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Today</p>
            </div>
            <div className="text-lg font-bold text-blue-600">95%</div>
          </div>

          <div className="flex items-center gap-4 rounded-lg bg-white dark:bg-gray-800 p-3 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <span className="text-green-600">📅</span>
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                Upcoming Exams
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This month
              </p>
            </div>
            <div className="text-lg font-bold text-green-600">2</div>
          </div>

          <div className="flex items-center gap-4 rounded-lg bg-white dark:bg-gray-800 p-3 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <span className="text-red-600">🔔</span>
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                Reminders
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pending
              </p>
            </div>
            <div className="text-lg font-bold text-red-600">3</div>
          </div>
        </div>
      </main>
    </>
  );
}

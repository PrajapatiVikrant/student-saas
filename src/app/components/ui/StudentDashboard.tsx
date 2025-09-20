"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdOutlineDashboard,
  MdOutlineGroup,
  MdOutlinePayments,
  MdBarChart,
} from "react-icons/md";
import { CgCalendarToday } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUserGraduate } from "react-icons/fa";

export default function StudentDashboard() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", icon: <MdOutlineDashboard />, path: "/dashboard" },
    { name: "Students", icon: <MdOutlineGroup />, path: "/students" },
    { name: "Fees", icon: <MdOutlinePayments />, path: "/fees" },
    { name: "Attendance", icon: <CgCalendarToday />, path: "/attendance" },
    { name: "Reports", icon: <MdBarChart />, path: "/reports" },
    { name: "Settings", icon: <IoSettingsOutline />, path: "/settings" },
  ];

  return (
    <div
      className="relative flex  h-[90vh] w-full flex-col  overflow-x-hidden"
      style={{ fontFamily: "Manrope, Noto Sans, sans-serif" }}
    >
      <div className="layout-container flex  grow flex-col">
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="w-72 flex-shrink-0 border-r border-gray-200 bg-white">
            <div className="flex h-full  flex-col justify-between p-4">
              <div className="flex flex-col gap-4">
                {/* Logo / Header */}
                <div className="flex flex-col justify-center items-center gap-2 px-3 py-2">
                  <FaUserGraduate className="text-3xl text-blue-600" />
                  <h1 className="text-gray-800 text-lg font-bold">
                    Student Management
                  </h1>
                </div>

                {/* Navigation */}
                <div className="flex flex-col gap-1 mt-4">
                  {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={item.name}
                        href={item.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                          isActive
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <span>{item.icon}</span>
                        <p className="text-sm">{item.name}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
}

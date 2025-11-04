"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdOutlineDashboard,
  MdOutlineGroup,
  MdOutlinePayments,
  MdBarChart,
  MdMoreHoriz,
} from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUserGraduate } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";

export default function StudentDashboard() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: <MdOutlineDashboard />, path: "/admin/dashboard" },
    { name: "Fee & Finance", icon: <MdOutlinePayments />, path: "/admin/finance" },
    { name: "Class & Batches", icon: <SiGoogleclassroom />, path: "/admin/class_batch" },
    { name: "Reports", icon: <MdBarChart />, path: "/admin/reports" },
    { name: "Settings", icon: <IoSettingsOutline />, path: "/admin/settings" },
  ];

  // Main 4 for mobile navbar
  const mainNavItems = navItems.slice(0, 4);
  const moreNavItems = navItems.slice(4);

  return (
    <div
      className="relative flex h-[90vh] w-full flex-col overflow-x-hidden"
      style={{ fontFamily: "Manrope, Noto Sans, sans-serif" }}
    >
      <div className="layout-container flex grow flex-col">
        <div className="flex flex-1">
          {/* SIDEBAR for Desktop */}
          <div className="hidden md:block w-72 flex-shrink-0 border-r border-gray-200 bg-white">
            <div className="flex h-full flex-col justify-between p-4">
              <div className="flex flex-col gap-4">
                {/* Logo */}
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

      {/* BOTTOM NAVBAR for Mobile */}
      <div className="fixed bottom-0 z-30 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center py-2 shadow-md md:hidden">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center text-xs ${
                isActive ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <p>{item.name.split(" ")[0]}</p>
            </Link>
          );
        })}

        {/* More Button */}
        <div className="relative">
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex flex-col items-center text-xs text-gray-500"
          >
            <MdMoreHoriz className="text-2xl" />
            <p>More</p>
          </button>

          {/* Dropdown for More Options */}
          {showMore && (
            <div className="absolute bottom-14 right-0 bg-white border rounded-lg shadow-lg w-40 py-2">
              {moreNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 text-sm"
                  onClick={() => setShowMore(false)}
                >
                  <span>{item.icon}</span>
                  <p>{item.name}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

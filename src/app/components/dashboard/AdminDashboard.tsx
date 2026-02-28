"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdOutlineDashboard,
  MdOutlinePayments,
  MdMoreHoriz,
  MdFamilyRestroom,
} from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { SiGoogleclassroom } from "react-icons/si";
import { SlCalender } from "react-icons/sl";
import { GiTeacher } from "react-icons/gi";
import { FiLogOut } from "react-icons/fi";
import Image from "next/image";

export default function AdminDashboard() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: <MdOutlineDashboard />, path: "/admin/dashboard" },
    { name: "Fee & Finance", icon: <MdOutlinePayments />, path: "/admin/finance" },
    { name: "Class & Batches", icon: <SiGoogleclassroom />, path: "/admin/class_batch" },
    { name: "Events", icon: <SlCalender />, path: "/admin/event" },
    { name: "Teacher", icon: <GiTeacher />, path: "/admin/teacher" },
    { name: "Parent Portal", icon: <MdFamilyRestroom />, path: "/admin/parent" },
  ];

  function handleSignout() {
    localStorage.removeItem("codeflam01_token");
    window.location.href = "/";
  }

  const mainNavItems = navItems.slice(0, 3);
  const moreNavItems = navItems.slice(3);

  return (
    <div className="relative flex min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-gray-700 dark:text-gray-200">
      {/* SIDEBAR for Desktop */}
      <aside className="hidden md:flex w-80 flex-col border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        {/* Logo */}
        <div className="flex items-center px-6 py-5 border-b border-slate-100 dark:border-slate-700">
          <div className="flex border items-center bg-white justify-center rounded-xl text-white font-bold">
            <Image
              src="/plateform_logo.webp"
              width={100}
              height={100}
              alt="platform_logo"
              className="cursor-pointer border"
            />
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-bold text-slate-800 dark:text-gray-100">Codeflame</h1>
            <p className="text-xs text-slate-500 dark:text-gray-400 font-medium tracking-wide">
              ADMIN PANEL
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-6 pt-6 pb-3 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 dark:text-gray-400 tracking-wider mb-3">
            MAIN MENU
          </p>

          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold shadow-sm border border-blue-100 dark:border-blue-700"
                      : "text-slate-600 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <p className="text-sm">{item.name}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sign Out */}
        <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={handleSignout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition font-semibold"
          >
            <FiLogOut className="text-lg" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* BOTTOM NAVBAR for Mobile */}
      <div className="fixed bottom-0 z-30 left-0 w-full bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-around items-center py-2 shadow-md md:hidden">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center text-xs ${
                isActive ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-slate-500 dark:text-gray-300"
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
            className="flex flex-col items-center text-xs text-slate-500 dark:text-gray-300"
          >
            <MdMoreHoriz className="text-2xl" />
            <p>More</p>
          </button>

          {/* Dropdown */}
          {showMore && (
            <div className="absolute bottom-14 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg w-44 py-2 overflow-hidden">
              {moreNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm"
                  onClick={() => setShowMore(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <p>{item.name}</p>
                </Link>
              ))}

              {/* Sign Out */}
              <div className="border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={handleSignout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition font-semibold"
                >
                  <FiLogOut className="text-lg" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

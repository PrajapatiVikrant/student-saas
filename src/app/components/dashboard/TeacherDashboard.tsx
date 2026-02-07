"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdOutlineDashboard,
  MdOutlinePayments,
  MdMoreHoriz,
} from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { SiGoogleclassroom } from "react-icons/si";
import { SlCalender } from "react-icons/sl";
import { MdFamilyRestroom } from "react-icons/md";
import { GiTeacher } from "react-icons/gi";
import { FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";

export default function AdminDashboard() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const navItems = [
   {
      name: "Dashboard",
      icon: <MdOutlineDashboard />,
      path: "/teacher/dashboard",
    },
    {
      name: "Attendance",
      icon: <SiGoogleclassroom />,
      path: "/teacher/attendance",
    },
    {
      name: "Events",
      icon: <SlCalender />,
      path: "/teacher/event",
    },
  ];

  function handleSignout() {
    // Sign out logic here
    localStorage.removeItem("codeflam01_token");
    window.location.href = "/teacher/login";
  }


  // Main 4 for mobile navbar
  const mainNavItems = navItems.slice(0, 4);
  const moreNavItems = navItems.slice(4);

  return (
    <div className="relative flex min-h-screen w-full bg-slate-50">
      {/* SIDEBAR for Desktop */}
      <aside className="hidden md:flex w-80 flex-col border-r border-slate-200 bg-white">
        {/* Logo */}
        <div className="flex items-center  px-6 py-5 border-b border-slate-100">
          <div className="flex  border items-center justify-center rounded-xl  text-white font-bold">
            <Image
              src="/plateform_logo.png"
              width={100}
              height={100}
              alt="platform_logo"
              className="cursor-pointer border"
            />

          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Codeflame</h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide">
              TEACHE PANEL
            </p>
          </div>
        </div>



        {/* Navigation */}
        <div className="flex-1 px-6 pt-6 pb-3 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 tracking-wider mb-3">
            MAIN MENU
          </p>

          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive
                      ? "bg-blue-50 text-blue-600 font-semibold shadow-sm border border-blue-100"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
        <div className="px-6 py-5 border-t border-slate-100">
          <button onClick={handleSignout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition font-semibold">
            <FiLogOut className="text-lg" />
            Sign Out
          </button>
        </div>
      </aside>



      {/* BOTTOM NAVBAR for Mobile */}
      <div className="fixed bottom-0 z-30 left-0 w-full bg-white border-t border-slate-200 flex justify-around items-center py-2 shadow-md md:hidden">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center text-xs ${isActive ? "text-blue-600 font-semibold" : "text-slate-500"
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
            className="flex flex-col items-center text-xs text-slate-500"
          >
            <MdMoreHoriz className="text-2xl" />
            <p>More</p>
          </button>

          {/* Dropdown */}
          {showMore && (
            <div className="absolute bottom-14 right-0 bg-white border border-slate-200 rounded-xl shadow-lg w-44 py-2 overflow-hidden">
              {moreNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 text-sm"
                  onClick={() => setShowMore(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <p>{item.name}</p>
                </Link>
              ))}

              {/* Sign Out */}
              <div className=" border-t border-slate-100">
                <button onClick={handleSignout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition font-semibold">
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

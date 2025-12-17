"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ICONS
import { MdOutlineDashboard } from "react-icons/md";
import { GiTeacher } from "react-icons/gi";
import { SiGoogleclassroom } from "react-icons/si";
import { SlCalender } from "react-icons/sl";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";
import { FaChalkboardTeacher } from "react-icons/fa";
import { HiMiniUserGroup } from "react-icons/hi2";
import { MdMoreHoriz } from "react-icons/md";

export default function TeacherDashboard() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  // --------------------------
  // TEACHER NAVIGATION ITEMS
  // --------------------------
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
      name: "Notifications",
      icon: <MdOutlineNotificationsActive />,
      path: "/teacher/notification",
    },
    {
      name: "Events",
      icon: <SlCalender />,
      path: "/teacher/event",
    },
   
   
  ];

  const mainNavItems = navItems.slice(0, 3);
  const moreNavItems = navItems.slice(3);

  return (
    <div
      className="relative flex h-[90vh] w-full flex-col overflow-x-hidden"
      style={{ fontFamily: "Manrope, Noto Sans, sans-serif" }}
    >
      <div className="layout-container flex grow flex-col">
        <div className="flex flex-1">
          {/* SIDEBAR (DESKTOP) */}
          <div className="hidden md:block w-72 flex-shrink-0 border-r border-gray-200 bg-white">
            <div className="flex h-full flex-col justify-between p-4">
              <div className="flex flex-col gap-4">
                {/* LOGO */}
                <div className="flex flex-col justify-center items-center gap-2 px-3 py-2">
                  <GiTeacher className="text-3xl text-blue-600" />
                  <h1 className="text-gray-800 text-lg font-bold">
                    Teacher Portal
                  </h1>
                </div>

                {/* NAVIGATION LINKS */}
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
                        <span className="text-lg">{item.icon}</span>
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

      {/* MOBILE BOTTOM NAVBAR */}
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

        {/* MORE BUTTON */}
        <div className="relative">
          <button
            onClick={() => setShowMore(!showMore)}
            className={`flex flex-col items-center text-xs ${
              showMore ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <MdMoreHoriz className="text-2xl" />
            <p>More</p>
          </button>

          {/* MORE DROPDOWN */}
          {showMore && (
            <div className="absolute bottom-14 right-0 bg-white border rounded-lg shadow-lg w-44 py-2">
              {moreNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 text-sm"
                  onClick={() => setShowMore(false)}
                >
                  <span className="text-lg">{item.icon}</span>
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

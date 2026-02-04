"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// ICONS
import { MdOutlineDashboard, MdMoreHoriz } from "react-icons/md";
import { GiTeacher } from "react-icons/gi";
import { SiGoogleclassroom } from "react-icons/si";
import { SlCalender } from "react-icons/sl";
import { FaUserCog } from "react-icons/fa";

export default function TeacherDashboard() {
  const pathname = usePathname();
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);

  // SIGN OUT
  const signOut = () => {
    localStorage.removeItem("codeflam01_token");
    router.push("/teacher/login");
  };

  // --------------------------
  // NAV ITEMS
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
      name: "Events",
      icon: <SlCalender />,
      path: "/teacher/event",
    },
    {
      name: "Sign Out",
      icon: <FaUserCog />,
      handler: signOut,
    },
  ];

  const mainNavItems = navItems.slice(0, 3);
  const moreNavItems = navItems.slice(3);

  return (
    <div className="relative flex h-[90vh] w-full flex-col overflow-x-hidden">
      <div className="flex grow">
        {/* ================= SIDEBAR (DESKTOP) ================= */}
        <aside className="hidden md:flex w-72 flex-col border-r border-gray-200 bg-white p-4">
          {/* LOGO */}
          <div className="flex flex-col items-center gap-2 py-3">
            <GiTeacher className="text-3xl text-blue-600" />
            <h1 className="text-lg font-bold text-gray-800">
              Teacher Portal
            </h1>
          </div>

          {/* NAV */}
          <nav className="mt-6 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;

              // 🔴 HANDLER ITEM (Sign Out)
              if (item.handler) {
                return (
                  <button
                    key={item.name}
                    onClick={item.handler}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm">{item.name}</span>
                  </button>
                );
              }

              // 🟢 NORMAL LINK
              return (
                <Link
                  key={item.name}
                  href={item.path!}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
      </div>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="fixed bottom-0 left-0 z-30 w-full border-t bg-white shadow md:hidden">
        <div className="flex justify-around py-2">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.name}
                href={item.path!}
                className={`flex flex-col items-center text-xs ${
                  isActive ? "text-blue-600" : "text-gray-500"
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* MORE */}
          <div className="relative">
            <button
              onClick={() => setShowMore(!showMore)}
              className={`flex flex-col items-center text-xs ${
                showMore ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <MdMoreHoriz className="text-2xl" />
              <span>More</span>
            </button>

            {showMore && (
              <div className="absolute bottom-14 right-0 w-44 rounded-lg border bg-white shadow-lg">
                {moreNavItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      item.handler?.();
                      setShowMore(false);
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

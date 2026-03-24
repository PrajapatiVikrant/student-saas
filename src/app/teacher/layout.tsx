"use client";

import TeacherDashboard from "../components/dashboard/TeacherDashboard";
import { usePathname } from "next/navigation";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 👇 jis route pe dashboard hide karna hai
  const hideDashboard =
    pathname === "/teacher/email" ||
    pathname.startsWith("/teacher/otp/verify");

  return (
    <section className="flex">
      
      {!hideDashboard && (
        <aside>
          <TeacherDashboard />
        </aside>
      )}

      <section className="bg-white h-[90vh] dark:bg-slate-900 overflow-auto w-full">
        {children}
      </section>

    </section>
  );
}
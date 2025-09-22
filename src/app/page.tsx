import Image from "next/image";
import Navbar from "./components/layout/Navbar";
import ToolCard from "./components/ui/ToolCard";
import { FaUserGraduate, FaChalkboardTeacher, FaChartLine, FaTools } from "react-icons/fa";

const tools = [
  {
    title: "Student Management",
    description: "Manage students, attendance, and fee records.",
    href: "/student/dashboard",
    icon: FaUserGraduate,
  },
  {
    title: "Teacher Management",
    description: "Track teachers, schedules, and payroll.",
    href: "/teachers",
    icon: FaChalkboardTeacher,
  },
  {
    title: "Sales Tool",
    description: "Manage leads, CRM, and performance reports.",
    href: "/sales",
    icon: FaChartLine,
  },
  {
    title: "Admin Panel",
    description: "Manage settings, roles, and permissions.",
    href: "/admin/dashboard",
    icon: FaTools,
  },
];

export default function Home() {
  return (
    <>
      
      <main className=" flex flex-col justify-center items-center max-w-7xl mx-auto px-6 py-10">
       

        <div className="grid w-[80%] grid-cols-1 sm:grid-cols-2  gap-16">
          {tools.map((tool, index) => (
            <ToolCard
              key={index}
              title={tool.title}
              description={tool.description}
              href={tool.href}
              icon={tool.icon}
            />
          ))}
        </div>
      </main>
    </>
  );
}


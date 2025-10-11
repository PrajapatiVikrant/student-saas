"use client";
import Link from "next/link";
import { FiUserPlus } from "react-icons/fi";

export default function Students() {
  return (
    <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Class 10 - Batch A</h1>
          <button className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition">
            <FiUserPlus className="h-4 w-4" />
            <span>Add Student</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-800">
          <div className="flex gap-8 px-4">
            <Link href="/admin/class_batch/class/batch/students" className="border-b-2 border-blue-600 py-3 text-sm font-semibold text-blue-600">
              Students
            </Link>
            <Link
              href="/admin/class_batch/class/batch/attendance"
              className="border-b-2 border-transparent py-3 text-sm font-medium text-slate-500  dark:text-slate-400 "
            >
              Attendance
            </Link>
          </div>
        </div>

        {/* Student Table */}
        <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Student Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Roll Number
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Gender
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {[
                  { name: "Ethan Harper", roll: "101", gender: "Male" },
                  { name: "Olivia Bennett", roll: "102", gender: "Female" },
                  { name: "Noah Carter", roll: "103", gender: "Male" },
                  { name: "Ava Morgan", roll: "104", gender: "Female" },
                  { name: "Liam Foster", roll: "105", gender: "Male" },
                ].map((student, i) => (
                  <tr key={i}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      {student.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {student.roll}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {student.gender}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <Link
                        href="#"
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        View Student
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

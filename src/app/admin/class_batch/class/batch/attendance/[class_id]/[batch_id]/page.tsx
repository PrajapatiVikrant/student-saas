"use client";
import Link from "next/link";
import { FiCalendar, FiSave } from "react-icons/fi";

export default function Attendance() {
  return (
    <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Class 10 - Batch A</h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-800">
          <div className="flex gap-8 px-4">
            <Link
              href="/admin/class_batch/class/batch/students"
              className="border-b-2 border-transparent py-3 text-sm font-medium text-slate-500 dark:text-slate-400"
            >
              Students
            </Link>
            <Link
              href="/admin/class_batch/class/batch/attendance"
              className="border-b-2 border-blue-600 py-3 text-sm font-semibold text-blue-600"
            >
              Attendance
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <label
              htmlFor="attendance-date"
              className="text-sm font-medium text-slate-600 dark:text-slate-300"
            >
              Select Date:
            </label>
            <div className="relative">
              <input
                className="w-full cursor-pointer rounded border-slate-300 bg-white pr-10 text-sm focus:border-blue-600 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                id="attendance-date"
                name="attendance-date"
                type="date"
                defaultValue="2023-10-27"
              />
            </div>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition">
            <FiSave className="h-4 w-4" />
            <span>Save Attendance</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow">
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
                  <th className="w-1/4 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Comments
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {[
                  { name: "Ethan Harper", roll: "101", status: "Present" },
                  { name: "Olivia Bennett", roll: "102", status: "Absent", comment: "Family emergency" },
                  { name: "Noah Carter", roll: "103", status: "Present" },
                  { name: "Ava Morgan", roll: "104", status: "Present" },
                  { name: "Liam Foster", roll: "105", status: "Present" },
                ].map((student) => (
                  <tr key={student.roll}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      {student.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {student.roll}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <div className="flex items-center gap-4">
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            defaultChecked={student.status === "Present"}
                            className="form-radio border-slate-300 text-blue-600 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800"
                            name={`status-${student.roll}`}
                            type="radio"
                          />
                          <span className="text-slate-700 dark:text-slate-300">Present</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            defaultChecked={student.status === "Absent"}
                            className="form-radio border-slate-300 text-blue-600 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800"
                            name={`status-${student.roll}`}
                            type="radio"
                          />
                          <span className="text-slate-700 dark:text-slate-300">Absent</span>
                        </label>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <input
                        className="w-full rounded border-slate-300 bg-white text-sm focus:border-blue-600 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        placeholder="Add a comment..."
                        type="text"
                        defaultValue={student.comment || ""}
                      />
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

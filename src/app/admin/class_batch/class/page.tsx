"use client";
import SubjectCard from "@/app/components/ui/SubjectCard";
import {
  FiBookOpen,
  FiLayers,
  FiPlusCircle,
} from "react-icons/fi";
import { useState } from "react";
import BatchCard from "@/app/components/ui/BatchCard";

export default function Kaksha() {
  return (
    <>
      <header className="p-6">
        <h1 className="text-3xl font-bold">Class 10th</h1>
      </header>

      <main className="px-6 space-y-6">
        {/* ---------- Subjects Section ---------- */}
        <section>
          {/* Subject Cards */}
          <section className="grid grid-cols-3 w-[300px] gap-2">
            <SubjectCard />
            <SubjectCard />
            <SubjectCard />
            <SubjectCard />
          </section>

          {/* Add Subject */}
          <section className="border-dashed border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 mt-4 flex items-center gap-4 w-fit">
            <input
              className="outline-none border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              type="text"
              placeholder="Subject name"
            />
            <button className="px-4 py-2 flex items-center gap-2 cursor-pointer text-sm font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none">
              <FiBookOpen size={16} /> Add
            </button>
          </section>
        </section>

        {/* ---------- Batches Section ---------- */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center text-2xl font-bold gap-2">
              <FiLayers /> <span>Batches</span>
            </h2>

            {/* Create Batch Button */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white font-medium text-sm shadow hover:bg-green-600 focus:ring-2 focus:ring-green-300 focus:outline-none">
              <FiPlusCircle size={18} /> Create Batch
            </button>
          </div>

          {/* Batch Cards */}
          <section className="grid grid-cols-3 gap-2">
            <BatchCard />
            <BatchCard />
            <BatchCard />
          </section>
        </section>
      </main>
    </>
  );
}

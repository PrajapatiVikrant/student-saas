"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CircularIndeterminate from "@/app/components/ui/CircularIndeterminate";

interface Payment {
  month: number;
  year: number;
  amount: number;
}

interface Student {
  _id: string;
  name: string;
  class: { name: string };
  batch: { name: string; fee?: number };

  payment_status: {
    last_payment?: Payment[];
  };
}

export default function MonthlyFinance() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [submitRecord, setSubmitRecord] = useState<any[]>([]);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [amount, setAmount] = useState("");

  const router = useRouter();

  const getToken = () => {
    const token = localStorage.getItem("codeflam01_token");
    if (!token) {
      router.push("/login");
      throw new Error("No token");
    }
    return token;
  };

  const fetchStudents = async () => {
    try {
      const token = getToken();
      const res = await axios.get(
        "https://codeflame-edu-backend.xyz/api/v1/fee/status",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(res.data);
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  // ✅ Paid check
  const getPayment = (student: Student, monthIndex: number) => {
    return student.payment_status.last_payment?.find(
      (m) => m.month === monthIndex + 1 && m.year === selectedYear
    );
  };

  const isSelected = (student: Student, monthIndex: number) => {
    return submitRecord.some(
      (r) =>
        r.studentId === student._id &&
        r.month === monthIndex + 1 &&
        r.year === selectedYear
    );
  };

  const handleClick = (student: Student, monthIndex: number) => {
    if (getPayment(student, monthIndex)) return;

    setSelectedStudent(student);
    setSelectedMonth(monthIndex);

    setAmount(String(student.batch.fee));
  };

  const handleAddRecord = () => {
    if (!selectedStudent || selectedMonth === null) return;

    setSubmitRecord((prev) => [
      ...prev,
      {
        studentId: selectedStudent._id,
        month: selectedMonth + 1,
        monthFee: selectedStudent.batch.fee,
        year: selectedYear,
        amount: Number(amount),
      },
    ]);

    toast.success("Added ✅");
    setSelectedStudent(null);
  };

  const handleBulkSave = async () => {
    const token = getToken();
    if (submitRecord.length === 0) return toast.error("No data");

   await axios.post(
  "https://codeflame-edu-backend.xyz/api/v1/fee/record",
  { records: submitRecord },
  { headers: { Authorization: `Bearer ${token}` } }
);

    toast.success("Saved (Demo)");
    setSubmitRecord([]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularIndeterminate size={80} />
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-900 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between mb-5 gap-3">
        <h1 className="text-xl font-bold text-white">
          📊 Monthly Fee
        </h1>

        <div className="flex gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border px-3 py-1 rounded"
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>

          <button
            onClick={handleBulkSave}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>

      {/* STUDENT LIST */}
      <div className="grid gap-4">
        {students.map((student) => (
          <div
            key={student._id}
            className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow"
          >
            <h2 className="font-semibold">{student.name}</h2>
            <p className="text-sm text-gray-500">
              {student.class.name} | {student.batch.name}
            </p>

            {/* MONTH GRID */}
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 mt-3">

              {months.map((m, i) => {
                const payment = getPayment(student, i);
                const selected = isSelected(student, i);

                return (
                  <div
                    key={i}
                    onClick={() => handleClick(student, i)}
                    className={`text-center text-[10px] p-1 rounded cursor-pointer
                      ${
                        payment
                          ? "bg-green-500 text-white"
                          : selected
                          ? "bg-yellow-400"
                          : "bg-red-400 text-white"
                      }
                    `}
                  >
                    {m}

                    {/* 👇 SHOW AMOUNT */}
                    <div className="text-[9px]">
                      {payment ? `₹${payment.amount}` : ""}
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedStudent && selectedMonth !== null && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl w-80">

            <h2 className="text-center font-bold mb-2">
              Record Fee
            </h2>

            <p className="text-center">{selectedStudent.name}</p>

            <p className="text-center">
              {months[selectedMonth]} - {selectedYear}
            </p>

            <p className="text-center text-green-600">
              Monthly Fee: ₹{selectedStudent.batch.fee || 500}
            </p>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border w-full p-2 mt-3"
            />

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setSelectedStudent(null)}
                className="border w-full py-1"
              >
                Cancel
              </button>

              <button
                onClick={handleAddRecord}
                className="bg-blue-600 text-white w-full py-1"
              >
                Add
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
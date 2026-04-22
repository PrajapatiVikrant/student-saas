"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CircularIndeterminate from "@/app/components/ui/CircularIndeterminate";
import Link from "next/link";

export default function MonthlyFinance() {
  const currentYear = new Date().getFullYear();
  const [students, setStudents] = useState<any[]>([]);
  const [classList, setClassList] = useState<any[]>([]);
  const [batchList, setBatchList] = useState<any[]>([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  const [loading, setLoading] = useState(true);

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [submitRecord, setSubmitRecord] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [clickedMonth, setClickedMonth] = useState<number | null>(null);
  const [amount, setAmount] = useState("");


 
  const router = useRouter();

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // ================= TOKEN =================
  const getToken = () => {
    const token = localStorage.getItem("codeflam01_token");
    if (!token) {
      router.push("/login");
      throw new Error("No token");
    }
    return token;
  };

  // ================= FETCH =================
  const fetchStudents = async () => {
    try {
      const token = getToken();

      const [studentRes, classRes] = await Promise.all([
        axios.get(
          "https://codeflame-edu-backend.xyz/api/v1/fee/status",
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
          "https://codeflame-edu-backend.xyz/api/v1/kaksha",
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);
      console.log("Student Response:", studentRes.data);
      console.log("Class Response:", classRes.data);
      setStudents(studentRes.data);
      setClassList(classRes.data);

    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ================= CLASS CHANGE =================
  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    setSelectedBatch("");

    const cls = classList.find((c: any) => c._id === classId);
    setBatchList(cls?.class?.batches || []);
  };

  // ================= FINAL PAYMENT =================
  const getFinalPayment = (student: any, monthIndex: number) => {
    let totalFee = student.batch?.fee || 0;

    const backend = student.monthly_fees?.find(
      (m: any) =>
        m.month === monthIndex + 1 &&
        (selectedYear === "All" || m.year === Number(selectedYear))
    );

    const local = submitRecord.find(
      (r) =>
        r.studentId === student._id &&
        r.month === monthIndex + 1
    );

    let paid = 0;
    let isLocal = false;

    if (backend) {
      totalFee = backend.totalFee;
      paid = backend.paidAmount || 0;
    }
    if (local) {
      paid = local.amount;
      isLocal = true;
    }

    if (paid === 0) return null;

    return {
      total: totalFee,
      paid,
      remaining: totalFee - paid,
      status:
        paid >= totalFee
          ? "Paid"
          : paid > 0
            ? "Partial"
            : "Pending",
      isLocal,
    };
  };

  const isSelected = (student: any, monthIndex: number) => {
    return submitRecord.some(
      (r) =>
        r.studentId === student._id &&
        r.month === monthIndex + 1
    );
  };

  const handleClick = (student: any, monthIndex: number) => {
    const payment = getFinalPayment(student, monthIndex);

    setSelectedStudent(student);
    setClickedMonth(monthIndex);

    // 🔥 agar already payment hai to uska amount show karo
    if (payment) {
      setAmount(String(payment.paid));
    } else {
      setAmount(String(student.batch?.fee || 0));
    }
  };

  // ================= ADD =================
  const handleAddRecord = () => {
    if (!selectedStudent || clickedMonth === null) return;

    const month = clickedMonth + 1;

    setSubmitRecord((prev) => {
      const exists = prev.find(
        (r) =>
          r.studentId === selectedStudent._id &&
          r.month === month
      );

      if (exists) {
        // 🔥 UPDATE
        return prev.map((r) =>
          r.studentId === selectedStudent._id && r.month === month
            ? { ...r, amount: Number(amount) }
            : r
        );
      }

      // 🔥 ADD NEW
      return [
        ...prev,
        {
          studentId: selectedStudent._id,
          month,
          monthFee: selectedStudent.batch?.fee,
          year:
            selectedYear === "All"
              ? new Date().getFullYear()
              : Number(selectedYear),
          amount: Number(amount),
        },
      ];
    });

    setSelectedStudent(null);
  };

  // ================= UNDO =================
  const handleUndo = (studentId: string, month: number) => {
    setSubmitRecord((prev) =>
      prev.filter(
        (r) => !(r.studentId === studentId && r.month === month)
      )
    );

  };

  // ================= SAVE =================
  const handleBulkSave = async () => {
    if (submitRecord.length === 0) return toast.error("No data");

    const token = getToken();

    await axios.post(
      "https://codeflame-edu-backend.xyz/api/v1/fee/record",
      { records: submitRecord },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Saved ✅");
    setSubmitRecord([]);
    fetchStudents();
  };

  


















  // ================= FILTER =================
  const filteredStudents = students.filter((student) => {
    const matchSearch = student.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchClass = selectedClass
      ? student.class?.class_id === selectedClass
      : true;

    const matchBatch = selectedBatch
      ? student.batch?.batch_id === selectedBatch
      : true;

    if (!matchSearch || !matchClass || !matchBatch) return false;

    const monthIndexes =
      selectedMonth === "All"
        ? months.map((_, i) => i)
        : [Number(selectedMonth) - 1];

    if (statusFilter === "All") return true;

    const hasPaid = monthIndexes.some((i) => {
      const p = getFinalPayment(student, i);
      return p?.status === "Paid";
    });

    const hasPartial = monthIndexes.some((i) => {
      const p = getFinalPayment(student, i);
      return p?.status === "Partial";
    });

    if (statusFilter === "Paid") return hasPaid;
    if (statusFilter === "Pending") return !hasPaid && !hasPartial;

    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularIndeterminate size={80} />
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-100 dark:bg-slate-900 min-h-screen">

      {/* HEADER */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow mb-4 flex justify-between flex-wrap gap-3 items-center">

        <h1 className="font-bold text-lg dark:text-white">
          📊 Finance Management
        </h1>

        <div className="flex gap-2 flex-wrap">

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border px-3 py-1 rounded bg-white dark:bg-slate-700 dark:text-white"
          >
            <option value="All">All Years</option>
            {[2024, 2025, 2026].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border px-3 py-1 rounded bg-white dark:bg-slate-700 dark:text-white"
          >
            <option value="All">All Months</option>
            {months.map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </select>

          {/* NEW FILTERS */}
          <select
            value={selectedClass}
            onChange={(e) => handleClassChange(e.target.value)}
            className="border px-3 py-1 rounded bg-white dark:bg-slate-700 dark:text-white"
          >
            <option value="">All Classes</option>
            {classList.map((cls: any) => (
              <option key={cls._id} value={cls._id}>
                {cls.class.name}
              </option>
            ))}
          </select>

          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="border px-3 py-1 rounded bg-white dark:bg-slate-700 dark:text-white"
          >
            <option value="">All Batches</option>
            {batchList.map((b: any) => (
              <option key={b._id} value={b._id}>
                {b.batch_name}
              </option>
            ))}
          </select>

          <button
            onClick={handleBulkSave}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
          >
            Save
          </button>

        </div>
      </div>


      {/* TABS */}
      <div className="flex gap-2 mb-3">
        {["All", "Paid", "Pending"].map((t) => (
          <button
            key={t}
            onClick={() => setStatusFilter(t)}
            className={`px-3 py-1 rounded-full text-sm ${statusFilter === t
              ? "bg-blue-600 text-white"
              : "bg-white dark:bg-slate-800 border dark:border-slate-600"
              }`}
          >
            {t} {statusFilter === t && filteredStudents.length}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <input
        placeholder="🔍 Search student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-4 bg-white dark:bg-slate-800 dark:text-white"
      />

      {/* STUDENTS */}
      <div className="grid gap-4 sm:gap-5">
        {filteredStudents.map((student) => (
          <div
            key={student._id}
            className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-xl shadow border dark:border-slate-700"
          >
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">

              {/* LEFT SIDE */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-wrap">

                <Link
                  href={`/admin/student/${student._id}/profile`}
                  className="font-semibold text-sm sm:text-base hover:text-blue-600 hover:border-b-2 hover:border-blue-500 dark:text-white w-fit"
                >
                  {student.name}
                </Link>

                <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-300">
                  {student.gender === "Male" ? "S/O " : "D/O "}
                  {student.parentInfo?.fatherName
                    ? student.parentInfo.fatherName
                    : student.parentInfo?.motherName
                      ? student.parentInfo.motherName
                      : "N/A"}
                </span>
              </div>

              {/* RIGHT SIDE */}
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-300">
                {student.class?.name || "No Class"} - {student.batch?.name || "No Batch"}
              </span>
            </div>

            {/* MONTH GRID */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 sm:gap-3">
              {months.map((m, i) => {

                if (
                  selectedMonth !== "All" &&
                  Number(selectedMonth) !== i + 1
                ) return null;

                const final = getFinalPayment(student, i);

                return (
                  <div key={i} className="relative">
                    <div
                      onClick={() => handleClick(student, i)}
                      className={`group relative  p-2 sm:p-3 rounded-xl text-center border transition-all duration-200 cursor-pointer

                ${final?.status === "Paid"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : final?.status === "Partial"
                            ? "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : "bg-white text-slate-600 border-slate-200 hover:shadow-md hover:scale-[1.03] dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                        }
                `}
                    >

                      {/* Month */}
                      <div className="font-semibold text-[10px] sm:text-xs md:text-sm">
                        {m}
                      </div>

                      {/* Amount */}
                      <div className="mt-1 flex flex-wrap items-center justify-center gap-[2px] leading-tight">
                        <span className="font-bold text-[10px] sm:text-xs md:text-sm break-words">
                          ₹{final?.paid || 0}
                        </span>

                        <span className="text-[9px] sm:text-[10px] md:text-xs text-slate-400">
                          / ₹{final?.total || student.batch?.fee}
                        </span>
                      </div>

                      {/* Status */}
                      {(() => {
                        const label =
                          new Date().getMonth() < months.indexOf(m)
                            ? final?.status === "Paid"
                              ? "Paid"
                              : "Record"
                            : final?.status || "Pending";

                        return (
                          <div
                            className={`mt-1 text-[9px] sm:text-[10px] px-1 py-[2px] rounded-full inline-block
        ${label === "Paid"
                                ? "bg-emerald-200 text-emerald-800 dark:bg-emerald-800/40 dark:text-emerald-300"
                                : label === "Partial"
                                  ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-800/40 dark:text-yellow-300"
                                  : label === "Record"
                                    ? "bg-blue-200 text-blue-800 dark:bg-blue-800/40 dark:text-blue-300"
                                    : "bg-red-500 text-white"
                              }
      `}
                          >
                            {label}
                          </div>
                        );
                      })()}

                      {/* Hover icon */}
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition text-[10px]">
                        💰
                      </div>

                    </div>

                    {/* UNDO BUTTON */}
                    {final?.isLocal && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUndo(student._id, i + 1);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <br /><br />
      </div>

      {/* MODAL */}
      {selectedStudent && clickedMonth !== null && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl w-80">
            <h2 className="text-center font-bold mb-2 dark:text-white">
              Add Fee
            </h2>

            <input
              type="number"
              value={amount}
             
              onChange={(e) => setAmount(e.target.value)}
              className="border w-full p-2 mb-3 rounded bg-white dark:bg-slate-700 dark:text-white"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedStudent(null)}
                className="border w-full py-1 rounded dark:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleAddRecord}
                className="bg-blue-600 text-white w-full py-1 rounded"
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
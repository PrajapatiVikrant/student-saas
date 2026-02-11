"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CircularIndeterminate from "@/app/components/ui/CircularIndeterminate";
import { School } from "lucide-react";

interface Student {
  _id: string;
  name: string;
  gender: string;
  class: { class_id: string; name: string };
  batch: { batch_id: string; name: string };
  payment_status: { total_amount: number; pay_amount: number };
  payment_date: string;
}

export default function FinanceManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "paid" | "pending">("all");
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [batchList, setBatchList] = useState<any[]>([]);
  const [classList, setClassList] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectPaymentMethod, setSelectPaymentMethod] = useState<"select payment method" | "Cash" | "UPI" | "Card" | "Bank Transfer">("select payment method")
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // ================= Helper for token =================
  const getToken = () => {
    const token = localStorage.getItem("codeflam01_token");
    if (!token) {
      toast.error("Session expired. Please login again.");
      router.push("/login");
      throw new Error("No token found");
    }
    return token;
  };

  // ================= Fetch Classes =================
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get("/api/v1/kaksha", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClassList(response.data);
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("codeflam01_token");
      }
      toast.error("Failed to load class list ❌");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= Fetch Students =================
  const getAllstudent = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get("/api/v1/fee/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data);
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("codeflam01_token");
      }
      toast.error("Failed to fetch student data ❌");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    getAllstudent();
  }, []);

  // ================= Fee Summary =================
  const totalFee = students.reduce((acc, s) => acc + (s.payment_status?.total_amount || 0), 0);
  const collectedFee = students.reduce((acc, s) => acc + (s.payment_status?.pay_amount || 0), 0);
  const pendingFee = totalFee - collectedFee;

  // ================= Filters =================
  const filteredStudents = students.filter((student) => {
    const isPaid = student.payment_status.pay_amount >= student.payment_status.total_amount;
    const matchesStatus = filterStatus === "all" ? true : filterStatus === "paid" ? isPaid : !isPaid;
    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass ? student.class.class_id === selectedClass : true;
    const matchesBatch = selectedBatch ? student.batch.batch_id === selectedBatch : true;
    return matchesStatus && matchesSearch && matchesClass && matchesBatch;
  });

  const handleChangeClass = (classId: string) => {
    setSelectedClass(classId);
    setSelectedBatch(""); // reset batch when class changes
    setBatchList(classList.find((cls: any) => cls._id === classId)?.class.batches || []);
  };

  // ================= Record Payment =================
  const handleRecordFee = async () => {
    if (!selectedStudent || !amount || selectPaymentMethod === "select payment method")
      return toast.error("Please fill all fields (amount and payment method)");

    if (Number(amount) <= 0) return toast.error("Amount must be greater than 0");

    try {
      setProcessing(true);
      const token = getToken();
      const response = await axios.post(
        `/api/v1/fee/record`,
        {
          studentId: selectedStudent._id,
          recordAmount: Number(amount),
          paymentMethod: selectPaymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message);
      setAmount("");
      setSelectPaymentMethod("select payment method");
      setSelectedStudent(null);
      getAllstudent();
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("codeflam01_token");
      }
      toast.error("Failed to record payment ❌");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  // ================= Loading State =================
  if (loading) {
    return (
      <main className="flex flex-col  dark:bg-slate-900 dark:text-white h-screen justify-center items-center">
        <CircularIndeterminate size={80} />
        <span>Loading...</span>
      </main>
    );
  }

  // ================= UI =================
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-900 dark:text-white min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <School className="w-6 h-6 text-indigo-600" />
                Finance Management
              </h1>
              <p className="text-slate-500 dark:text-slate-300 text-sm mt-1">
                Manage student fees, payments, and financial records efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>

      <br />

      {/* Fee Summary */}
      <div className="grid px-4 dark:bg-slate-900 dark:text-white sm:px-6 grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-xl text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">Total Fee</p>
          <p className="text-xl font-bold text-blue-700 dark:text-blue-300">₹{totalFee}</p>
        </div>
        <div className="p-4 bg-green-100 dark:bg-green-900 rounded-xl text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">Collected Fee</p>
          <p className="text-xl font-bold text-green-700 dark:text-green-300">₹{collectedFee}</p>
        </div>
        <div className="p-4 bg-red-100 dark:bg-red-900 rounded-xl text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">Pending Fee</p>
          <p className="text-xl font-bold text-red-700 dark:text-red-300">₹{pendingFee}</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex px-4 sm:px-6 dark:bg-slate-900  justify-center sm:justify-start gap-3 mb-6 flex-wrap">
        {["all", "paid", "pending"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as "all" | "paid" | "pending")}
            className={`px-4 py-2 rounded-full border font-medium transition-all ${filterStatus === status
              ? "bg-blue-600 text-white"
              : "bg-white dark:bg-slate-800 dark:text-white text-gray-700 border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex dark:bg-slate-900 px-4 sm:px-6 flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="🔍 Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-md w-full sm:w-60"
          />

          <select
            value={selectedClass}
            onChange={(e) => handleChangeClass(e.target.value)}
            className="border px-3 py-2 rounded-md"
          >
            <option value="">All Classes</option>
            {classList.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.class.name}
              </option>
            ))}
          </select>

          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="border px-3 py-2 rounded-md"
          >
            <option value="">All Batches</option>
            {batchList.map((batch) => (
              <option key={batch._id} value={batch._id}>
                {batch.batch_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Table */}
      <div className="overflow-x-auto px-4 sm:px-6 w-full">
        <table className="min-w-[800px] w-full border border-gray-300 text-sm table-auto whitespace-nowrap">
          <thead className="bg-gray-100 dark:bg-slate-700">
            <tr>
              <th className="border px-3 py-2">#</th>
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Gender</th>
              <th className="border px-3 py-2">Class</th>
              <th className="border px-3 py-2">Batch</th>
              <th className="border px-3 py-2">Total Fee</th>
              <th className="border px-3 py-2">Paid</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => {
                const isPaid = student.payment_status.pay_amount >= student.payment_status.total_amount;
                return (
                  <tr className="bg-white dark:bg-slate-800" key={student._id}>
                    <td className="border px-3 py-2 text-center">{index + 1}</td>
                    <td className="border px-3 py-2 truncate max-w-[150px]">{student.name}</td>
                    <td className="border px-3 py-2">{student.gender}</td>
                    <td className="border px-3 py-2">{student.class.name}</td>
                    <td className="border px-3 py-2">{student.batch.name}</td>
                    <td className="border px-3 py-2 text-center">₹{student.payment_status.total_amount}</td>
                    <td className="border px-3 py-2 text-center">₹{student.payment_status.pay_amount}</td>
                    <td className={`border px-3 py-2 text-center font-semibold ${isPaid ? "text-green-600" : "text-red-600"}`}>
                      {isPaid ? "Paid" : "Pending"}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {isPaid ? (
                        <span className="text-green-700 font-medium">✅ Paid</span>
                      ) : (
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="bg-blue-600 cursor-pointer text-white px-3 py-1 rounded-md hover:bg-blue-700"
                        >
                          Record Payment
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="text-center text-gray-500 py-4 border">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Record Payment Modal */}
      {selectedStudent && (
        <div className="fixed p-4 sm:p-6 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-11/12 sm:w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Record Payment for <span className="text-blue-600">{selectedStudent.name}</span>
            </h2>
            <p className="text-sm mb-2">Total Fee: ₹{selectedStudent.payment_status.total_amount}</p>
            <p className="text-sm mb-4">Paid So Far: ₹{selectedStudent.payment_status.pay_amount}</p>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="border rounded-md px-3 py-2 w-full mb-3 dark:bg-slate-700 dark:text-white"
            />

            <select
              value={selectPaymentMethod}
              onChange={(e) => setSelectPaymentMethod(e.target.value as any)}
              className="border rounded-md px-3 py-2 w-full mb-4 dark:bg-slate-700 dark:text-white"
            >
              <option value="select payment method" disabled>Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>

            <div className="flex justify-end gap-3">
              <button onClick={() => setSelectedStudent(null)} className="border px-3 py-2 rounded-md dark:border-gray-400">
                Cancel
              </button>
              <button
                onClick={handleRecordFee}
                disabled={processing}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                {processing ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <br /><br /><br />
    </div>
  );
}

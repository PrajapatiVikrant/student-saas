"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CircularIndeterminate from "@/app/components/ui/CircularIndeterminate";

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
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectPaymentMethod, setSelectPaymentMethod] = useState<"select payment method"|"Cash" | "UPI" | "Card" | "Bank Transfer">("select payment method")
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);




  const router = useRouter();

  // Fetch students
  useEffect(() => {
    getAllstudent()
  }, []);


  function getAllstudent() {
    try {
      const token = localStorage.getItem("adminToken");
      axios
        .get("http://localhost:4000/api/v1/fee/status", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setStudents(res.data))
        .catch(() => toast.error("Failed to load students"));
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("adminToken");
        router.push("/login");
      } else {
        toast.error("Failed to fetch student data ❌");
      }
      console.error("Error fetching student data:", error);
    } finally {
      setLoading(false)
    }
  }

  // Extract unique classes and batches
  const uniqueClasses = Array.from(
    new Map(students.map((s) => [s.class.class_id, s.class])).values()
  );
  const uniqueBatches = Array.from(
    new Map(students.map((s) => [s.batch.batch_id, s.batch])).values()
  );

  // Fee summary
  const totalFee = students.reduce(
    (acc, s) => acc + (s.payment_status?.total_amount || 0),
    0
  );
  const collectedFee = students.reduce(
    (acc, s) => acc + (s.payment_status?.pay_amount || 0),
    0
  );
  const pendingFee = totalFee - collectedFee;

  // Filtering logic
  const filteredStudents = students.filter((student) => {
    const isPaid =
      student.payment_status.pay_amount >= student.payment_status.total_amount;

    const matchesStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "paid"
          ? isPaid
          : !isPaid;

    const matchesSearch = student.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesClass = selectedClass
      ? student.class.class_id === selectedClass
      : true;

    const matchesBatch = selectedBatch
      ? student.batch.batch_id === selectedBatch
      : true;

    return matchesStatus && matchesSearch && matchesClass && matchesBatch;
  });

  const handleRecordFee = async () => {
    if (!selectedStudent || !amount || selectPaymentMethod === "select payment method")
      return toast.error("Please fill all fields (amount and payment method)");

    try {
      setProcessing(true);
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(
        `http://localhost:4000/api/v1/fee/record`,
        {
          studentId: selectedStudent._id,
          recordAmount: Number(amount),
          paymentMethod: selectPaymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(response.data.message);
      setAmount("");
      setSelectPaymentMethod("select payment method");
      setSelectedStudent(null);

      getAllstudent();
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("adminToken");
        router.push("/login");
      } else {
        toast.error("Failed to record payment ❌");
      }
      console.error("Error recording payment:", error);
    } finally {
      setProcessing(false);
    }
  };


  if (loading) {
    return (
      <main className="flex flex-col h-screen justify-center items-center">
        <CircularIndeterminate size={80} />
        <span>Loading...</span>
      </main>
    )

  }


  return (
    <div className="p-4 sm:p-6">
      {/* Header Summary */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center sm:text-left">
        Finance Management
      </h1>

      {/* Fee Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-100 rounded-xl text-center">
          <p className="text-gray-600 text-sm">Total Fee</p>
          <p className="text-xl font-bold text-blue-700">₹{totalFee}</p>
        </div>
        <div className="p-4 bg-green-100 rounded-xl text-center">
          <p className="text-gray-600 text-sm">Collected Fee</p>
          <p className="text-xl font-bold text-green-700">₹{collectedFee}</p>
        </div>
        <div className="p-4 bg-red-100 rounded-xl text-center">
          <p className="text-gray-600 text-sm">Pending Fee</p>
          <p className="text-xl font-bold text-red-700">₹{pendingFee}</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex justify-center sm:justify-start gap-3 mb-6 flex-wrap">
        {["all", "paid", "pending"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as any)}
            className={`px-4 py-2 rounded-full border font-medium transition-all ${filterStatus === status
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
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
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border px-3 py-2 rounded-md"
          >
            <option value="">All Classes</option>
            {uniqueClasses.map((cls) => (
              <option key={cls.class_id} value={cls.class_id}>
                {cls.name}
              </option>
            ))}
          </select>

          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="border px-3 py-2 rounded-md"
          >
            <option value="">All Batches</option>
            {uniqueBatches.map((batch) => (
              <option key={batch.batch_id} value={batch.batch_id}>
                {batch.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-[800px] w-full border border-gray-300 text-sm table-auto whitespace-nowrap">
          <thead className="bg-gray-100">
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
                const isPaid =
                  student.payment_status.pay_amount >=
                  student.payment_status.total_amount;

                return (
                  <tr key={student._id}>
                    <td className="border px-3 py-2 text-center">{index + 1}</td>
                    <td className="border px-3 py-2 truncate max-w-[150px]">{student.name}</td>
                    <td className="border px-3 py-2">{student.gender}</td>
                    <td className="border px-3 py-2">{student.class.name}</td>
                    <td className="border px-3 py-2">{student.batch.name}</td>
                    <td className="border px-3 py-2 text-center">
                      ₹{student.payment_status.total_amount}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      ₹{student.payment_status.pay_amount}
                    </td>
                    <td
                      className={`border px-3 py-2 text-center font-semibold ${isPaid ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {isPaid ? "Paid" : "Pending"}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {isPaid ? (
                        <span className="text-green-700 font-medium">✅ Paid</span>
                      ) : (
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="bg-blue-600 cursor-grab text-white px-3 py-1 rounded-md hover:bg-blue-700"
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

      {/* Record Payment Form */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-11/12 sm:w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Record Payment for{" "}
              <span className="text-blue-600">{selectedStudent.name}</span>
            </h2>
            <p className="text-sm mb-2">
              Total Fee: ₹{selectedStudent.payment_status.total_amount}
            </p>
            <p className="text-sm mb-4">
              Paid So Far: ₹{selectedStudent.payment_status.pay_amount}
            </p>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="border rounded-md px-3 py-2 w-full mb-3"
            />

            <select
              value={selectPaymentMethod}
              onChange={(e) =>
                setSelectPaymentMethod(e.target.value as "Cash" | "UPI" | "Card" | "Bank Transfer")
              }
              className="border rounded-md px-3 py-2 w-full mb-4"
            >
              <option value="select payment method" disabled>
                Select Payment Method
              </option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>


            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedStudent(null)}
                className="border px-3 py-2 rounded-md"
              >
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
    </div>
  );
}

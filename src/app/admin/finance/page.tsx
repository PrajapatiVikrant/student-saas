"use client";
import { useState } from "react";
import jsPDF from "jspdf";

export default function Finance() {
  // Fee Records State
  const [records, setRecords] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  // Form Data State
  const [form, setForm] = useState({
    student: "",
    course: "",
    amount: "",
    date: "",
    method: "",
    status: "Pending",
  });

  // Handle Form Input
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Generate Receipt PDF
  const generateReceipt = (record: any) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Fee Receipt", 80, 20);
    doc.setFontSize(12);
    doc.text(`Student: ${record.student}`, 20, 40);
    doc.text(`Course: ${record.course}`, 20, 50);
    doc.text(`Amount: ₹${record.amount}`, 20, 60);
    doc.text(`Date: ${record.date}`, 20, 70);
    doc.text(`Payment Method: ${record.method}`, 20, 80);
    doc.text(`Status: ${record.status}`, 20, 90);
    doc.text("Powered by Codeflame Technology", 20, 110);
    doc.save(`Receipt_${record.student}.pdf`);
  };

  // Handle Form Submit
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setRecords([...records, { ...form, id: Date.now() }]);
    setForm({
      student: "",
      course: "",
      amount: "",
      date: "",
      method: "",
      status: "Pending",
    });
  };

  // Filter Records
  const filteredRecords = records.filter((r) =>
    filter === "all" ? true : r.status.toLowerCase() === filter
  );

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Fee & Finance Management
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage student fees, generate receipts, and view financial reports.
          </p>
        </header>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-8 -mb-px">
            <button
              className={`py-4 px-1 border-b-2 ${
                filter === "all"
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent text-gray-500"
              }`}
              onClick={() => setFilter("all")}
            >
              All Records
            </button>
            <button
              className={`py-4 px-1 border-b-2 ${
                filter === "paid"
                  ? "border-green-600 text-green-600 font-semibold"
                  : "border-transparent text-gray-500"
              }`}
              onClick={() => setFilter("paid")}
            >
              Paid
            </button>
            <button
              className={`py-4 px-1 border-b-2 ${
                filter === "pending"
                  ? "border-red-600 text-red-600 font-semibold"
                  : "border-transparent text-gray-500"
              }`}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>
          </nav>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Form */}
          <section className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">
              Record Student Fee
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                name="student"
                value={form.student}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg bg-gray-200 outline-none text-gray-700"
                placeholder="Student Name"
                required
              />
              <input
                name="course"
                value={form.course}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg bg-gray-200 outline-none text-gray-700"
                placeholder="Course"
                required
              />
              <input
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg bg-gray-200 outline-none text-gray-700"
                placeholder="Fee Amount"
                type="number"
                required
              />
              <input
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg bg-gray-200 outline-none text-gray-700"
                placeholder="Payment Date"
                type="date"
                required
              />
              <select
                name="method"
                value={form.method}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg bg-gray-200 outline-none text-gray-700"
                required
              >
                <option value="">Select Method</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="NetBanking">NetBanking</option>
              </select>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg bg-gray-200 outline-none text-gray-700"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
              <div className="flex justify-end">
                <button
                  className="bg-blue-700 cursor-pointer hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
                  type="submit"
                >
                  Record Fee
                </button>
              </div>
            </form>
          </section>

          {/* Records Table */}
          <section className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">
              Fee Records
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((r) => (
                      <tr
                        key={r.id}
                        className="border-b border-gray-200 dark:border-gray-700"
                      >
                        <td className="py-2 px-4">{r.student}</td>
                        <td className="py-2 px-4">{r.course}</td>
                        <td className="py-2 px-4">₹{r.amount}</td>
                        <td className="py-2 px-4">{r.date}</td>
                        <td className="py-2 px-4">
                          {r.status === "Paid" ? (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              Paid
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {r.status === "Paid" ? (
                            <button
                              onClick={() => generateReceipt(r)}
                              className="text-blue-600 hover:underline"
                            >
                              Download Receipt
                            </button>
                          ) : (
                            <button className="text-red-600 hover:underline">
                              Send Reminder
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center text-gray-500 py-4"
                      >
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

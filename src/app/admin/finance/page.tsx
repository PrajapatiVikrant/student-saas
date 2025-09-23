"use client";

import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";

type RecordItem = {
  id: string;
  student: string;
  course: string;
  amount: number;
  date: string; // yyyy-mm-dd
  method: string;
  status: "Paid" | "Pending";
  receiptId?: string;
  reminderSent?: boolean;
};

const LOCAL_KEY = "cf_finance_records_v1";

export default function Finance() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [filter, setFilter] = useState<"all" | "paid" | "pending">("all");
  const [form, setForm] = useState({
    student: "",
    course: "",
    amount: "",
    date: "",
    method: "",
    status: "Pending",
  });

  // load from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      try {
        setRecords(JSON.parse(raw));
      } catch {}
    }
  }, []);

  // save to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(records));
  }, [records]);

  // helper to generate unique receipt id
  const generateReceiptId = () => {
    const ts = Date.now().toString().slice(-6);
    const rnd = Math.floor(Math.random() * 900 + 100).toString();
    return `REC-${new Date().getFullYear()}-${ts}${rnd}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const resetForm = () =>
    setForm({
      student: "",
      course: "",
      amount: "",
      date: "",
      method: "",
      status: "Pending",
    });

  // record fee
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.student || !form.amount || !form.date || !form.method) {
      alert("Please complete required fields.");
      return;
    }
    const newRecord: RecordItem = {
      id: Date.now().toString(),
      student: form.student,
      course: form.course || "General",
      amount: Number(form.amount),
      date: form.date,
      method: form.method,
      status: form.status === "Paid" ? "Paid" : "Pending",
      receiptId: form.status === "Paid" ? generateReceiptId() : undefined,
      reminderSent: false,
    };
    setRecords((r) => [newRecord, ...r]);
    resetForm();
  };

  // generate PDF receipt (uses jsPDF)
  const generateReceipt = (r: RecordItem) => {
    const receiptId = r.receiptId ?? generateReceiptId();
    // if record didn't have receipt id and is paid, update record
    if (r.status === "Paid" && !r.receiptId) {
      setRecords((rs) =>
        rs.map((it) => (it.id === r.id ? { ...it, receiptId } : it))
      );
    }

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const left = 40;
    let y = 60;

    doc.setFontSize(18);
    doc.text("Fee Receipt", 300, y, { align: "center" });
    y += 30;

    doc.setFontSize(11);
    doc.text(`Receipt ID: ${receiptId}`, left, y);
    y += 20;
    doc.text(`Student: ${r.student}`, left, y);
    y += 18;
    doc.text(`Course: ${r.course}`, left, y);
    y += 18;
    doc.text(`Amount: ₹${r.amount}`, left, y);
    y += 18;
    doc.text(`Payment Date: ${r.date}`, left, y);
    y += 18;
    doc.text(`Payment Method: ${r.method}`, left, y);
    y += 24;

    doc.setFontSize(10);
    doc.text("This is a system-generated receipt by Codeflame Technology.", left, y);
    y += 14;
    doc.text("Verify receipt at: https://your-domain.com/verify (enter Receipt ID)", left, y);
    y += 30;

    doc.setFontSize(12);
    doc.text("Thank you!", 300, y, { align: "center" });

    doc.save(`Receipt_${r.student}_${receiptId}.pdf`);
  };

  // open WhatsApp with prefilled message (web/mobile)
  const shareViaWhatsApp = (r: RecordItem) => {
    const receiptId = r.receiptId ?? generateReceiptId();
    // if paid and no receiptId, persist it
    if (r.status === "Paid" && !r.receiptId) {
      setRecords((rs) =>
        rs.map((it) => (it.id === r.id ? { ...it, receiptId } : it))
      );
    }

    const messageLines = [
      `*Fee Receipt*`,
      `Receipt ID: ${receiptId}`,
      `Student: ${r.student}`,
      `Course: ${r.course}`,
      `Amount: ₹${r.amount}`,
      `Date: ${r.date}`,
      `Payment Method: ${r.method}`,
      ``,
      `Verify at: https://your-domain.com/verify (enter Receipt ID)`,
      `Powered by Codeflame Technology`,
    ];
    const text = encodeURIComponent(messageLines.join("\n"));
    // open WhatsApp web/mobile
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  // send reminder (simulated client-side)
  const sendReminder = (id: string) => {
    setRecords((rs) => rs.map((r) => (r.id === id ? { ...r, reminderSent: true } : r)));
    alert("Reminder marked as sent (simulate sending). Later integrate SMS/WhatsApp API.");
  };

  // Filtered records list
  const filtered = records.filter((r) =>
    filter === "all" ? true : filter === "paid" ? r.status === "Paid" : r.status === "Pending"
  );

  // Financial summaries (by month & year)
  const summary = useMemo(() => {
    const totals = { paid: 0, pending: 0, countPaid: 0, countPending: 0 } as any;
    const monthly: Record<string, number> = {}; // YYYY-MM -> total paid
    const yearly: Record<string, number> = {}; // YYYY -> total paid

    for (const r of records) {
      if (r.status === "Paid") {
        totals.paid += r.amount;
        totals.countPaid++;
        const d = new Date(r.date);
        const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const yKey = `${d.getFullYear()}`;
        monthly[mKey] = (monthly[mKey] || 0) + r.amount;
        yearly[yKey] = (yearly[yKey] || 0) + r.amount;
      } else {
        totals.pending += r.amount;
        totals.countPending++;
      }
    }

    return { totals, monthly, yearly };
  }, [records]);

  // Export CSV (simple)
  const exportCSV = () => {
    const headers = ["ReceiptId","Student","Course","Amount","Date","Method","Status","ReminderSent"];
    const rows = records.map(r => [
      r.receiptId ?? "",
      r.student,
      r.course,
      r.amount,
      r.date,
      r.method,
      r.status,
      r.reminderSent ? "Yes" : "No"
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fee_records.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Fee & Finance Management</h2>
          <p className="text-sm text-gray-600 mt-1">Record fees, generate receipts, send reminders and view financial reports.</p>
        </header>

        {/* Tabs & Actions */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex gap-2">
            <button
              className={`py-2 px-3 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`py-2 px-3 rounded ${filter === "paid" ? "bg-green-600 text-white" : "bg-gray-100"}`}
              onClick={() => setFilter("paid")}
            >
              Paid
            </button>
            <button
              className={`py-2 px-3 rounded ${filter === "pending" ? "bg-red-600 text-white" : "bg-gray-100"}`}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>
          </div>

          <div className="flex gap-2">
            <button className="py-2 px-3 bg-indigo-600 text-white rounded" onClick={exportCSV}>Export CSV</button>
            <button className="py-2 px-3 bg-gray-200 rounded" onClick={() => { localStorage.removeItem(LOCAL_KEY); setRecords([]); }}>Clear All (dev)</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <section className="lg:col-span-1 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Record Student Fee</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="student" value={form.student} onChange={handleChange} placeholder="Student name" className="w-full p-2 border rounded" required />
              <input name="course" value={form.course} onChange={handleChange} placeholder="Course / Batch" className="w-full p-2 border rounded" />
              <input name="amount" value={form.amount} onChange={handleChange} placeholder="Amount (₹)" type="number" className="w-full p-2 border rounded" required />
              <input name="date" value={form.date} onChange={handleChange} type="date" className="w-full p-2 border rounded" required />
              <select name="method" value={form.method} onChange={handleChange} className="w-full p-2 border rounded" required>
                <option value="">Select payment method</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="NetBanking">NetBanking</option>
              </select>
              <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 border rounded">
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
              <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Record Fee</button>
              </div>
            </form>

            <div className="mt-4 text-sm text-gray-600">
              Tip: Mark status as <b>Paid</b> to auto-generate a receipt id and allow download/share.
            </div>
          </section>

          {/* Records Table */}
          <section className="lg:col-span-2 bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Fee Records</h3>
              <div className="text-sm text-gray-600">
                Total Paid: <b>₹{summary.totals.paid}</b> • Pending: <b>₹{summary.totals.pending}</b>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-sm text-gray-600">
                  <tr>
                    <th className="py-2 px-3">Receipt ID</th>
                    <th className="py-2 px-3">Student</th>
                    <th className="py-2 px-3">Course</th>
                    <th className="py-2 px-3">Amount</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-gray-500">No records found.</td>
                    </tr>
                  ) : (
                    filtered.map((r) => (
                      <tr key={r.id} className="border-t">
                        <td className="py-2 px-3 text-sm text-gray-700">{r.receiptId ?? "-"}</td>
                        <td className="py-2 px-3 text-sm">{r.student}</td>
                        <td className="py-2 px-3 text-sm">{r.course}</td>
                        <td className="py-2 px-3 text-sm">₹{r.amount}</td>
                        <td className="py-2 px-3 text-sm">{r.date}</td>
                        <td className="py-2 px-3 text-sm">
                          {r.status === "Paid" ? <span className="text-green-700">Paid</span> : <span className="text-red-700">Pending</span>}
                        </td>
                        <td className="py-2 px-3 text-sm space-x-2">
                          {r.status === "Paid" ? (
                            <>
                              <button className="underline text-blue-600" onClick={() => generateReceipt(r)}>Download Receipt</button>
                              <button className="underline text-green-600" onClick={() => shareViaWhatsApp(r)}>Share on WhatsApp</button>
                            </>
                          ) : (
                            <>
                              <button className="underline text-indigo-600" onClick={() => {
                                // mark as paid quickly (simulate)
                                setRecords(rs => rs.map(it => it.id === r.id ? { ...it, status: "Paid", receiptId: generateReceiptId() } : it));
                              }}>Mark Paid</button>
                              <button className="underline text-red-600" onClick={() => sendReminder(r.id)}>{r.reminderSent ? "Reminder Sent" : "Send Reminder"}</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Simple Reports */}
            <div className="mt-4 border-t pt-4">
              <h4 className="font-semibold">Simple Financial Reports</h4>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Total Paid</div>
                  <div className="text-xl font-bold">₹{summary.totals.paid}</div>
                  <div className="text-xs text-gray-500">Transactions: {summary.totals.countPaid}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Total Pending</div>
                  <div className="text-xl font-bold">₹{summary.totals.pending}</div>
                  <div className="text-xs text-gray-500">Transactions: {summary.totals.countPending}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Net</div>
                  <div className="text-xl font-bold">₹{summary.totals.paid - summary.totals.pending}</div>
                </div>
              </div>

              <div className="mt-4">
                <h5 className="font-medium">Monthly Paid Breakdown</h5>
                <div className="text-sm text-gray-700 mt-2">
                  {Object.keys(summary.monthly).length === 0 ? (
                    <div className="text-gray-500">No paid transactions yet.</div>
                  ) : (
                    <ul className="list-disc pl-6">
                      {Object.entries(summary.monthly).map(([k, v]) => (
                        <li key={k}>{k}: ₹{v}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <h5 className="font-medium">Yearly Paid Breakdown</h5>
                <div className="text-sm text-gray-700 mt-2">
                  {Object.keys(summary.yearly).length === 0 ? (
                    <div className="text-gray-500">No paid transactions yet.</div>
                  ) : (
                    <ul className="list-disc pl-6">
                      {Object.entries(summary.yearly).map(([k, v]) => (
                        <li key={k}>{k}: ₹{v}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

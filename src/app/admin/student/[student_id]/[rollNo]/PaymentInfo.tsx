"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type PaymentInfoProps = {
  student: {
    id: string;
    name: string;
    class_name?: string;
    batch_name?: string;
  };
};

interface FeeStatusResponse {
  message: string;
  student: {
    _id: string;
    name: string;
    organization_name: string;
    totalAmount?: number;
    totalPaid?: number;
    remainingAmount?: number;
  };
  receipts: {
    _id: string;
    receiptNumber: string;
    amountPaid: number;
    totalAmount: number;
    paymentMethod: string;
    paymentDate: string;
    monthsPaid: {
      month: number;
      year: number;
      monthFee: number;
      paidAmount: number;
    }[];
  }[];
}

export default function PaymentInfo({ student }: PaymentInfoProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [feeData, setFeeData] = useState<FeeStatusResponse | null>(null);
  const [instituteName, setInstituteName] = useState("");

  useEffect(() => {
    getFeeStatus();
  }, []);

  async function getFeeStatus() {
    try {
      const token = localStorage.getItem("codeflam01_token");

      const { data } = await axios.get<FeeStatusResponse>(
        `https://codeflame-edu-backend.xyz/api/v1/fee/status/${student.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setInstituteName(data.student.organization_name);
      setFeeData(data);
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("codeflam01_token");
        router.push("/login");
      } else {
        toast.error("Failed to fetch fee details ❌");
      }
    } finally {
      setLoading(false);
    }
  }

  const getMonthName = (month: number) =>
    new Date(0, month - 1).toLocaleString("en", { month: "short" });

  // 🔥 PROFESSIONAL PRINT RECEIPT
  const handlePrintReceipt = (receipt: any) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const rows = receipt.monthsPaid
      .map((m: any, i: number) => {
        const remaining = m.monthFee - m.paidAmount;
        const status = remaining === 0 ? "Paid" : "Partial";

        return `
        <tr>
          <td>${i + 1}</td>
          <td>${getMonthName(m.month)} ${m.year}</td>
          <td>₹${m.monthFee}</td>
          <td>₹${m.paidAmount}</td>
          <td>₹${remaining}</td>
          <td style="color:${status === "Paid" ? "green" : "orange"}">
            ${status}
          </td>
        </tr>
      `;
      })
      .join("");

    printWindow.document.write(`
<html>
<head>
  <title>Fee Receipt</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial;
      background: #f5f5f5;
      padding: 20px;
    }

    .receipt {
      max-width: 800px;
      margin: auto;
      background: #fff;
      padding: 25px;
      border: 1px solid #ddd;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    .header {
      text-align: center;
      margin-bottom: 10px;
    }

    .header h2 {
      margin: 0;
    }

    .sub-title {
      font-size: 14px;
      color: #555;
    }

    .divider {
      border-top: 1px dashed #aaa;
      margin: 15px 0;
    }

    .info {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      margin-bottom: 5px;
    }

    .info div {
      width: 48%;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      font-size: 14px;
    }

    th {
      background: #f0f0f0;
      border: 1px solid #ccc;
      padding: 8px;
    }

    td {
      border: 1px solid #ccc;
      padding: 8px;
      text-align: center;
    }

    .paid {
      color: green;
      font-weight: 600;
    }

    .partial {
      color: orange;
      font-weight: 600;
    }

    .summary {
      margin-top: 15px;
      border: 1px solid #ccc;
      padding: 10px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin: 4px 0;
      font-size: 14px;
    }

    .total-highlight {
      font-size: 16px;
      font-weight: bold;
    }

    .footer {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
    }

    .sign {
      text-align: center;
    }

    @media print {
      body { background: none; }
      .receipt { box-shadow: none; border: none; }
    }
  </style>
</head>

<body>
  <div class="receipt">

    <div class="header">
      <h2>${instituteName}</h2>
      <div class="sub-title">Fee Payment Receipt</div>
    </div>

    <div class="divider"></div>

    <div class="info">
      <div><b>Receipt No:</b> ${receipt.receiptNumber}</div>
      <div><b>Date:</b> ${new Date(receipt.paymentDate).toLocaleDateString()}</div>
    </div>

    <div class="info">
      <div><b>Student:</b> ${student.name}</div>
      <div><b>Class:</b> ${student.class_name}</div>
    </div>

    <div class="info">
      <div><b>Batch:</b> ${student.batch_name}</div>
      <div><b>Payment Mode:</b> ${receipt.paymentMethod}</div>
    </div>

    <div class="divider"></div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Month</th>
          <th>Total Fee</th>
          <th>Paid</th>
          <th>Remaining</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        ${receipt.monthsPaid.map((m, i) => {
      const remaining = m.monthFee - m.paidAmount;
      const status = remaining === 0 ? "Paid" : "Partial";

      return `
            <tr>
              <td>${i + 1}</td>
              <td>${new Date(0, m.month - 1).toLocaleString("en", { month: "long" })} ${m.year}</td>
              <td>₹${m.monthFee}</td>
              <td>₹${m.paidAmount}</td>
              <td>₹${remaining}</td>
              <td class="${status === "Paid" ? "paid" : "partial"}">
                ${status}
              </td>
            </tr>
          `;
    }).join("")}
      </tbody>
    </table>

    <div class="summary">
      <div class="summary-row">
        <span>Total Fee:</span>
        <span>₹${receipt.totalAmount}</span>
      </div>

      <div class="summary-row total-highlight">
        <span>Total Paid:</span>
        <span>₹${receipt.amountPaid}</span>
      </div>

      <div class="summary-row">
        <span>Remaining:</span>
        <span>₹${receipt.totalAmount - receipt.amountPaid}</span>
      </div>
    </div>

    <div class="footer">
      <div class="sign">
        <p>________________</p>
        <p>Authorized Signature</p>
      </div>

      <div class="sign">
        <p>________________</p>
        <p>Stamp</p>
      </div>
    </div>

  </div>

  <script>
    window.print();
  </script>
</body>
</html>
`);
    printWindow.document.close();
  };

  if (loading)
    return <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>;

  if (!feeData)
    return <p className="text-center text-red-500 dark:text-red-400">No data</p>;

  const { receipts, student: s } = feeData;

  return (
    <div className="space-y-6 text-gray-800 dark:text-gray-200">
      <h2 className="text-xl font-semibold border-b pb-2 border-gray-300 dark:border-gray-700">
        Payment Info
      </h2>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
          Total: ₹{s.totalAmount || 0}
        </div>
        <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
          Paid: ₹{s.totalPaid || 0}
        </div>
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
          Remaining: ₹{s.remainingAmount || 0}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Months</th>
              <th className="border p-2">Breakdown</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-900">
            {receipts.map((r) => (
              <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="border p-2">
                  {new Date(r.paymentDate).toLocaleDateString()}
                </td>

                <td className="border p-2">
                  {r.monthsPaid.map((m) => `${getMonthName(m.month)} ${m.year}`).join(", ")}
                </td>

                <td className="border p-2">
                  {r.monthsPaid.map((m, i) => {
                    const remaining = m.monthFee - m.paidAmount;
                    return (
                      <div key={i}>
                        {getMonthName(m.month)}: ₹{m.paidAmount} / ₹{m.monthFee}
                        {remaining > 0 && (
                          <span className="text-orange-500"> (Due ₹{remaining})</span>
                        )}
                      </div>
                    );
                  })}
                </td>

                <td className="border p-2 font-semibold">₹{r.amountPaid}</td>

                <td className="border p-2">
                  <button
                    onClick={() => handlePrintReceipt(r)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                  >
                    Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type PaymentInfoProps = {
  student: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    admissionDate?: string;
    gender?: string;
    class_name?: string;
    classId?: string;
    batch_name?: string;
    batchId?: string;
  };
};

interface FeeStatusResponse {
  message: string;
  student: {
    _id: string;
    name: string;
    class: { class_id: string; name: string };
    batch: { batch_id: string; name: string };
    totalAmount: number;
    totalPaid: number;
    remainingAmount: number;
    organization_name: string;

  };
  receipts: {
    _id: string;
    receiptNumber: string;
    amountPaid: number;
    totalAmount: number;
    paymentMethod: string;
    paymentDate: string;
  }[];
}

export default function PaymentInfo({ student }: PaymentInfoProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [feeData, setFeeData] = useState<FeeStatusResponse | null>(null);
  const [instituteName, setInstituteName] = useState("");

  useEffect(() => {
    const savedInstitute = localStorage.getItem("instituteName");
    if (savedInstitute) setInstituteName(savedInstitute);
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

  // ✅ PRINT RECEIPT FUNCTION
  const handlePrintReceipt = (receipt: any) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            .receipt { max-width: 600px; margin: auto; border: 2px solid #000; padding: 20px; }
            h2 { text-align: center; margin-bottom: 10px; }
            .row { display: flex; justify-content: space-between; margin: 5px 0; }
            .bold { font-weight: bold; }
            .divider { border-top: 1px dashed #000; margin: 10px 0; }
            .footer { margin-top: 30px; display: flex; justify-content: space-between; }
            .sign { text-align: center; }
          </style>
        </head>

        <body>
          <div class="receipt">
            <h2>${instituteName}</h2>
            <p style="text-align:center;">Fee Receipt</p>

            <div class="divider"></div>

            <div class="row">
              <span>Receipt No:</span>
              <span>${receipt.receiptNumber}</span>
            </div>

            <div class="row">
              <span>Date:</span>
              <span>${new Date(receipt.paymentDate).toLocaleDateString()}</span>
            </div>

            <div class="divider"></div>

            <div class="row">
              <span>Student Name:</span>
              <span>${student.name}</span>
            </div>

            <div class="row">
              <span>Class:</span>
              <span>${student.class_name}</span>
            </div>

            <div class="row">
              <span>Batch:</span>
              <span>${student.batch_name}</span>
            </div>

            <div class="divider"></div>

            <div class="row bold">
              <span>Amount Paid:</span>
              <span>₹${receipt.amountPaid}</span>
            </div>

            <div class="row">
              <span>Payment Method:</span>
              <span>${receipt.paymentMethod}</span>
            </div>

            <div class="divider"></div>

            <div class="footer">
              <div class="sign">
                <p>________________</p>
                <p>Authorized Sign</p>
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
    return <p className="text-center text-gray-500">Loading payment info...</p>;

  if (!feeData)
    return (
      <p className="text-center text-red-500">
        No payment data available for this student.
      </p>
    );

  const { student: s, receipts } = feeData;

  return (
    <div className="space-y-6 text-gray-700 dark:text-gray-200">
      <h2 className="text-xl font-semibold border-b pb-2 border-gray-300 dark:border-gray-600">
        Payment Information
      </h2>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
          <p className="font-semibold">Total Fee</p>
          <p className="text-lg font-bold text-green-700">₹{s.totalAmount}</p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <p className="font-semibold">Paid</p>
          <p className="text-lg font-bold text-blue-700">₹{s.totalPaid}</p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
          <p className="font-semibold">Remaining</p>
          <p className="text-lg font-bold text-red-700">₹{s.remainingAmount}</p>
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Payment History</h3>

        <div className="overflow-x-auto">
          <table className="w-full border text-sm border-gray-300 dark:border-gray-600">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="border px-3 py-2 text-left">Date</th>
                <th className="border px-3 py-2 text-left">Amount (₹)</th>
                <th className="border px-3 py-2 text-left">Payment Method</th>
                <th className="border px-3 py-2 text-left">Receipt</th>
              </tr>
            </thead>

            <tbody>
              {receipts.map((r) => (
                <tr key={r._id}>
                  <td className="border px-3 py-2">
                    {new Date(r.paymentDate).toLocaleDateString()}
                  </td>

                  <td className="border px-3 py-2">{r.amountPaid}</td>

                  <td className="border px-3 py-2">{r.paymentMethod}</td>

                  <td className="border px-3 py-2">
                    <button
                      onClick={() => handlePrintReceipt(r)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
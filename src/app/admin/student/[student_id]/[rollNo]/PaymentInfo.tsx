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
  const [instituteName, setInstituteName] = useState("Your Institute Name");

  useEffect(() => {
    const savedInstitute = localStorage.getItem("instituteName");
    if (savedInstitute) setInstituteName(savedInstitute);
    getFeeStatus();
  }, []);

  async function getFeeStatus() {
    try {
      const token = localStorage.getItem("codeflam01_token");
      const { data } = await axios.get<FeeStatusResponse>(
        `/api/v1/fee/status/${student.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFeeData(data);
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("codeflam01_token");
        router.push("/login");
      } else {
        toast.error("Failed to fetch fee details ❌");
      }
      console.error("Error fetching fee status:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <p className="text-center text-gray-500 dark:text-gray-300">Loading payment info...</p>;

  if (!feeData)
    return (
      <p className="text-center text-red-500 dark:text-red-400">
        No payment data available for this student.
      </p>
    );

  const { student: s, receipts } = feeData;

  return (
    <div className="space-y-6 text-gray-700 dark:text-gray-200">
      <h2 className="text-xl font-semibold border-b pb-2 border-gray-300 dark:border-gray-600">
        Payment Information
      </h2>

      {/* --- Summary Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-900/30 dark:border dark:border-green-700 p-4 rounded-lg shadow-sm">
          <p className="font-semibold">Total Fee</p>
          <p className="text-lg font-bold text-green-700 dark:text-green-300">₹{s.totalAmount}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/30 dark:border dark:border-blue-700 p-4 rounded-lg shadow-sm">
          <p className="font-semibold">Paid</p>
          <p className="text-lg font-bold text-blue-700 dark:text-blue-300">₹{s.totalPaid}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/30 dark:border dark:border-red-700 p-4 rounded-lg shadow-sm">
          <p className="font-semibold">Remaining</p>
          <p className="text-lg font-bold text-red-700 dark:text-red-300">₹{s.remainingAmount}</p>
        </div>
      </div>

      {/* --- Payment History --- */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Payment History</h3>
        {receipts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300">No payments made yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-sm border-gray-300 dark:border-gray-600">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="border px-3 py-2 text-left">Date</th>
                  <th className="border px-3 py-2 text-left">Amount (₹)</th>
                  <th className="border px-3 py-2 text-left">Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((r) => (
                  <tr key={r._id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-slate-800 dark:even:bg-slate-700">
                    <td className="border px-3 py-2">{new Date(r.paymentDate).toLocaleDateString()}</td>
                    <td className="border px-3 py-2">{r.amountPaid}</td>
                    <td className="border px-3 py-2">{r.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

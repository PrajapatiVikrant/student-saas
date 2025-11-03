"use client";

export default function PaymentInfo() {
  const payment = {
    totalFee: 20000,
    paidFee: 15000,
    remaining: 5000,
    history: [
      { date: "2024-06-10", amount: 5000 },
      { date: "2024-08-01", amount: 5000 },
      { date: "2024-09-15", amount: 5000 },
    ],
  };

  return (
    <div className="space-y-6 text-gray-700">
      <h2 className="text-xl font-semibold border-b pb-2">Payment Information</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="font-semibold">Total Fee</p>
          <p className="text-lg font-bold text-green-700">₹{payment.totalFee}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="font-semibold">Paid</p>
          <p className="text-lg font-bold text-blue-700">₹{payment.paidFee}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="font-semibold">Remaining</p>
          <p className="text-lg font-bold text-red-700">₹{payment.remaining}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Payment History</h3>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Date</th>
              <th className="border px-3 py-2 text-left">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {payment.history.map((p, i) => (
              <tr key={i}>
                <td className="border px-3 py-2">{p.date}</td>
                <td className="border px-3 py-2">{p.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

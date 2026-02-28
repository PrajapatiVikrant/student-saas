"use client";

import axios from "axios";
import { useState, FormEvent } from "react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import CircularIndeterminate from "../ui/CircularIndeterminate";
import { useRouter } from "next/navigation";

interface BatchFormProps {
  setBatchForm: (value: boolean) => void;
  batch:any;
  class_id: string;
  refresh: () => void;
}

export default function BatchForm({ setBatchForm, batch,class_id,refresh }: BatchFormProps) {
  // ✅ Batch fields
  const [batchName, setBatchName] = useState(batch?batch.batch_name:"");
  const [batchFee, setBatchFee] = useState(batch?batch.batch_fee:"");
  const [batchTiming, setBatchTiming] = useState(batch?batch.batch_timing:"");
  const [batchDays, setBatchDays] = useState(batch?batch.batch_days:"");
  const [feeMethod, setFeeMethod] = useState(batch?batch.fee_method:"Per Month"); // Default value

  //process state
  const [processing,setProcessing] = useState(false);


  // ✅ Error states
  const [batchNameError, setBatchNameError] = useState("");
  const [batchFeeError, setBatchFeeError] = useState("");
  const [batchTimingError, setBatchTimingError] = useState("");
  const [batchDaysError, setBatchDaysError] = useState("");
  const [feeMethodError, setFeeMethodError] = useState("");

  //for navigation
  const router = useRouter();

  // ✅ Validation
  const validate = () => {
    let isValid = true;

    if (!batchName.trim()) {
      setBatchNameError("Batch name is required");
      isValid = false;
    } else setBatchNameError("");
    console.log(batchFee)
    if (!batchFee || isNaN(Number(batchFee))) {
      setBatchFeeError("Valid batch fee is required");
      isValid = false;
    } else setBatchFeeError("");

    if (!batchTiming.trim()) {
      setBatchTimingError("Batch timing is required");
      isValid = false;
    } else setBatchTimingError("");

    if (!batchDays.trim()) {
      setBatchDaysError("Batch days are required");
      isValid = false;
    } else setBatchDaysError("");

    if (!feeMethod.trim()) {
      setFeeMethodError("Fee method is required");
      isValid = false;
    } else setFeeMethodError("");

    return isValid;
  };

  // ✅ Submit Form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem("codeflam01_token");

    const data = {
      batch_name: batchName,
      batch_fee: Number(batchFee),
      batch_timing: batchTiming,
      batch_days: batchDays,
      fee_method: feeMethod, // ✅ new field added
    };
    setProcessing(true);
    try {
      await axios.post(
        `/api/v1/batch/${class_id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Batch created successfully 🎉");

      // Reset
      setBatchName("");
      setBatchFee("");
      setBatchTiming("");
      setBatchDays("");
      setFeeMethod("Per Month");
      setBatchForm(false);
      refresh(); // Refresh the batch list after creation
    } catch (error:any) {
       if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("codeflam01_token");
        router.push("/login");
      } else {
        toast.error("Failed to create batch ❌");
      }
    } finally{
      
      setProcessing(false)
    }
  };
  
  
  
  // ✅ Submit Form
  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem("codeflam01_token");

    const data = {
      batch_name: batchName,
      batch_fee: Number(batchFee),
      batch_timing: batchTiming,
      batch_days: batchDays,
      fee_method: feeMethod, // ✅ new field added
    };
    setProcessing(true);
    try {
      await axios.put(
        `/api/v1/batch/${class_id}/${batch._id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Batch edited successfully 🎉");

      // Reset
      setBatchName("");
      setBatchFee("");
      setBatchTiming("");
      setBatchDays("");
      setFeeMethod("Per Month");
      setBatchForm(false);
      refresh(); // Refresh the batch list after editing
    } catch (error:any) {
       console.log(error)
       if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("codeflam01_token");
        router.push("/login");
      } else {
        console.log(error)
        toast.error("Failed to edit batch ❌");
      }
    } finally{
      
      setProcessing(false)
    }
  };

  return (
  <div className="fixed inset-0 bg-black/40 dark:bg-black/70 overflow-auto flex items-center justify-center z-50">
  <div className="p-6 bg-white dark:bg-gray-900 w-[90%] lg:w-[35%] rounded-lg shadow-md dark:shadow-gray-800">

    {/* Close Button */}
    <div className="flex justify-end text-2xl text-gray-700 dark:text-gray-300">
      <button
        className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md cursor-pointer p-1 transition"
        onClick={() => setBatchForm(false)}
      >
        <RxCross2 />
      </button>
    </div>

    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
      Create New Batch
    </h2>

    <form className="space-y-4" onSubmit={batch ? handleEdit : handleSubmit}>

      {/* Batch Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Batch Name
        </label>
        <input
          type="text"
          value={batchName}
          onChange={(e) => setBatchName(e.target.value)}
          placeholder="Enter batch name"
          className={`mt-1 block w-full rounded-md shadow-sm p-2 bg-white dark:bg-gray-800 
          text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
          focus:ring-blue-500 focus:outline-none
          ${batchNameError ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
        />
        {batchNameError && (
          <p className="text-red-500 text-sm mt-1">{batchNameError}</p>
        )}
      </div>

      {/* Batch Fee */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Batch Fee (₹)
        </label>
        <input
          type="number"
          value={batchFee}
          onChange={(e) => setBatchFee(e.target.value)}
          placeholder="Enter batch fee"
          className={`mt-1 block w-full rounded-md shadow-sm p-2 bg-white dark:bg-gray-800 
          text-gray-900 dark:text-white
          focus:ring-blue-500 focus:outline-none
          ${batchFeeError ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
        />
        {batchFeeError && (
          <p className="text-red-500 text-sm mt-1">{batchFeeError}</p>
        )}
      </div>

      {/* Fee Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Fee Method
        </label>
        <select
          value={feeMethod}
          onChange={(e) => setFeeMethod(e.target.value)}
          className={`mt-1 block w-full rounded-md shadow-sm p-2 bg-white dark:bg-gray-800 
          text-gray-900 dark:text-white
          focus:ring-blue-500 focus:outline-none
          ${feeMethodError ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
        >
          <option value="Per Month">Per Month</option>
          <option value="One Time">One Time</option>
        </select>
        {feeMethodError && (
          <p className="text-red-500 text-sm mt-1">{feeMethodError}</p>
        )}
      </div>

      {/* Batch Timing */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Batch Timing
        </label>
        <input
          type="text"
          value={batchTiming}
          onChange={(e) => setBatchTiming(e.target.value)}
          placeholder="e.g. 10:00 AM - 12:00 PM"
          className={`mt-1 block w-full rounded-md shadow-sm p-2 bg-white dark:bg-gray-800 
          text-gray-900 dark:text-white
          focus:ring-blue-500 focus:outline-none
          ${batchTimingError ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
        />
        {batchTimingError && (
          <p className="text-red-500 text-sm mt-1">{batchTimingError}</p>
        )}
      </div>

      {/* Batch Days */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Batch Days
        </label>
        <input
          type="text"
          value={batchDays}
          onChange={(e) => setBatchDays(e.target.value)}
          placeholder="e.g. Mon, Wed, Fri"
          className={`mt-1 block w-full rounded-md shadow-sm p-2 bg-white dark:bg-gray-800 
          text-gray-900 dark:text-white
          focus:ring-blue-500 focus:outline-none
          ${batchDaysError ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
        />
        {batchDaysError && (
          <p className="text-red-500 text-sm mt-1">{batchDaysError}</p>
        )}
      </div>

      {/* Submit */}
      <div className="text-right">
        <button
          type="submit"
          disabled={processing}
          className={`${processing ? "bg-blue-300" : "bg-blue-600 dark:bg-blue-500"} 
          text-white px-4 py-2 rounded-md 
          hover:bg-blue-500 dark:hover:bg-blue-400 transition`}
        >
          {processing ? (
            <div className="flex items-center justify-center gap-1.5">
              <CircularIndeterminate size={25} />
              <span>Creating</span>
            </div>
          ) : (
            <span>Create</span>
          )}
        </button>
      </div>

    </form>
  </div>
</div>
  );
}

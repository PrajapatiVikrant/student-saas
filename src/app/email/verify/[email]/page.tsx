"use client";
import CircularIndeterminate from "@/app/components/ui/CircularIndeterminate";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { MdEmail } from "react-icons/md";
import { toast } from "react-toastify";

export default function VerifyEmailPage() {
  const [processing, setProcessing] = useState(false);
  const params = useParams();
  const rawEmail = params.email as string;
  const email = decodeURIComponent(rawEmail || "");

  // Refs for OTP inputs
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // State for OTP values
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

  useEffect(() => {
    // auto-focus first field when mounted
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if filled
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerify = async(e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      toast.info("Pease enter all 6 digit of the OTP.")
      return;
    }

    setProcessing(true);
    try {
      const response =  await axios.post("http://localhost:4000/api/v1/admin/verify-otp", {
      email,
      otp: enteredOtp,
    });
    if(response.status === 200){
      console.log(response);
      toast.success(response.data.message || "OTP verified successfully 🎉"); 
       localStorage.setItem("adminToken", response.data.token); 

      window.location.href = '/admin/dashboard'
     

    }
  }
    catch (error) {
      toast.error("OTP verification failed ❌");
       setProcessing(false);
      
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="text-center">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
              <MdEmail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Verify Your Email
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Please enter the 6-digit code sent to{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-300">
                {email}
              </span>
              .
            </p>
          </div>

          {/* OTP Inputs */}
          <form className="mt-8" >
            <div className="flex justify-center gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    if (el) inputRefs.current[i] = el;
                  }}
                  type="text"
                  maxLength={1}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="w-12 h-12 text-center text-lg font-semibold border rounded-lg border-gray-300 dark:border-gray-600 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary outline-none"
                />
              ))}
            </div>

            {/* Resend */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Didn’t receive the code?
              </p>
              <button
                type="button"
                className="mt-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Resend Code
              </button>
            </div>

            {/* Verify Button */}
            <div className="mt-8">
              <button
                type="submit"
                onClick={handleVerify}
                disabled={processing}
                className={`w-full flex justify-center items-center ${processing?"bg-blue-300":"bg-blue-700"}  cursor-pointer text-white font-semibold py-3 rounded-lg hover:bg-blue-300 transition-all duration-300`}
              >
                {processing ? <CircularIndeterminate /> : "Verify Account"}
              </button>
            </div>

            {/* Back to login */}
            <div className="mt-4 text-center">
              <a
                href="/login"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary/80 transition-colors"
              >
                ← Back to login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import ParentPortalAccessForm from "@/app/components/forms/ParentForm";
import { Button } from "@/app/components/ui/attendanceUi/Button";
import ViewParent from "@/app/components/ui/ViewParent";
import axios from "axios";
import { PlusCircle, School } from "lucide-react";
import { useEffect, useState } from "react";

export default function ParentPage() {
  const [registerForm, setRegisterForm] = useState(false);
  const [viewParent, setViewParent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parents, setParents] = useState<any[]>([]);
  const [parent, setParent] = useState<any>({});
  const [darkMode, setDarkMode] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("codeflam01_token") : null;

  useEffect(() => {
    // Load dark mode preference
    const stored = localStorage.getItem("dark-mode") === "true";
    setDarkMode(stored);
    if (stored) document.documentElement.classList.add("dark");
    getAllPortalParent();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("dark-mode", (!darkMode).toString());
  };

  const getAllPortalParent = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://student-backend-saas.vercel.app/api/v1/parent`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParents(res.data || []);
    } catch (error) {
      console.log("Error fetching portal parents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewParent = (p: any) => {
    setParent(p);
    setViewParent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-gray-900 dark:text-gray-100">
      
    

     {/* Header */}
<div className="bg-white dark:bg-slate-800 border-b mb-2.5 border-slate-200 dark:border-slate-700 sticky top-0 z-10">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:items-center items-start justify-between gap-4">
    
    {/* Title & Description */}
    <div className="flex flex-col gap-1 text-start md:text-left">
      <h1 className="text-2xl font-bold flex items-start justify-center md:justify-start gap-2">
        <School className="w-6 h-6 text-indigo-600" />
        Parent Portal
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-300">
        Manage parent access and view parent details
      </p>
    </div>

    {/* Give Access Button */}
    <div className="flex justify-center md:justify-end">
      <Button
        onClick={() => setRegisterForm(true)}
        className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
      >
        <PlusCircle size={18} className="mr-2" /> Give Access
      </Button>
    </div>
  </div>
</div>


      {/* Loading */}
      {loading && <p className="text-center mt-4">Loading parents...</p>}

      {/* Table */}
      {!loading && parents.length > 0 && (
        <div className="overflow-x-auto rounded-lg p-6">
          <table className="min-w-[800px] w-full border border-gray-300 dark:border-gray-600 text-sm table-auto whitespace-nowrap bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
            <thead>
              <tr className="bg-gray-100 dark:bg-slate-700 text-left text-sm md:text-base">
                <th className="p-3 border border-gray-300 dark:border-gray-600">Name</th>
                <th className="p-3 border border-gray-300 dark:border-gray-600">Email</th>
                <th className="p-3 border border-gray-300 dark:border-gray-600">Phone</th>
                <th className="p-3 border border-gray-300 dark:border-gray-600">Childrens</th>
                <th className="p-3 border border-gray-300 dark:border-gray-600 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {parents.map((p: any) => (
                <tr key={p._id} className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-sm md:text-base">
                  <td className="p-3 border border-gray-300 dark:border-gray-600">{p.name}</td>
                  <td className="p-3 border border-gray-300 dark:border-gray-600">{p.email}</td>
                  <td className="p-3 border border-gray-300 dark:border-gray-600">{p.phone}</td>
                  <td className="p-3 border border-gray-300 dark:border-gray-600">{p.childrens?.length || 0}</td>
                  <td className="p-3 border border-gray-300 dark:border-gray-600 text-center">
                    <button onClick={() => handleViewParent(p)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && parents.length === 0 && (
        <p className="text-center mt-4 text-gray-500 dark:text-gray-400">No Parent Records Found</p>
      )}

      {/* View Parent Modal */}
      {viewParent && (
        <ViewParent parent={parent} setViewParent={setViewParent} getParents={getAllPortalParent} />
      )}

      {/* Register Form Modal */}
      {registerForm && (
        <ParentPortalAccessForm
          parent={null}
          setViewParent={setViewParent}
          setRegisterForm={setRegisterForm}
          getParents={getAllPortalParent}
        />
      )}
      <br /><br /><br />
    </div>
  );
}

"use client";

import ParentPortalAccessForm from "@/app/components/forms/ParentForm";
import { Button } from "@/app/components/ui/attendanceUi/Button";
import ViewParent from "@/app/components/ui/ViewParent";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { School } from "lucide-react";
import { useEffect, useState } from "react";

export default function ParentPage() {
  const [registerForm, setRegisterForm] = useState(false);
  const [viewParent, setViewParent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parents, setParents] = useState([]);
  const [parent, setParent] = useState({});

  const token = typeof window !== "undefined" ? localStorage.getItem("codeflam01_token") : null;

  useEffect(() => {
    getAllPortalParent();
  }, []);

  const getAllPortalParent = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:4000/api/v1/parent`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Portal Parents:", res.data);
      setParents(res.data || []);
    } catch (error) {
      console.log("Error fetching portal parents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewParent = (p:any) => {
   
    setParent(p);
    setViewParent(true);

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ">
         <div className="bg-white border-b mb-2.5 border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <School className="w-6 h-6 text-indigo-600" />
                        Parent Portal
                      </h1>
                      <p className="text-slate-500 text-sm mt-1">
                        Manage parent access and view parent details
                      </p>
                    </div>
        
                  
        
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

      {/* Responsive Table */}
      {!loading && parents.length > 0 && (
        <div className="overflow-x-auto  rounded-lg p-6">
          <table className="min-w-[800px]  w-full  border  border-gray-300 text-sm table-auto whitespace-nowrap">
            <thead>
              <tr className="bg-gray-100 text-left text-sm md:text-base">
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Phone</th>
                <th className="p-3 border">Childrens</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {parents.map((p:any) => (
                <tr key={p._id} className="bg-white text-sm md:text-base">
                  <td className="p-3 border">{p.name}</td>
                  <td className="p-3 border">{p.email}</td>
                  <td className="p-3 border">{p.phone}</td>
                  <td className="p-3 border">{p.childrens?.length || 0}</td>
                  <td className="p-3 border text-center">
                    <button onClick={()=>handleViewParent(p)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* If No Parents */}
      {!loading && parents.length === 0 && (
        <p className="text-center mt-4 text-gray-500">No Parent Records Found</p>
      )}


      {viewParent && (
       <ViewParent 
       parent={parent}
       setViewParent={setViewParent}
       getParents={getAllPortalParent}
       />
      )}

      {/* Modal */}
      {registerForm && (
        <ParentPortalAccessForm
          parent={null}
          setViewParent={setViewParent}
          setRegisterForm={setRegisterForm}
          getParents={getAllPortalParent}
         
        />
      )}
    </div>
  );
}

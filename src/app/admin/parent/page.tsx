"use client";

import ParentPortalAccessForm from "@/app/components/forms/ParentForm";
import ViewParent from "@/app/components/ui/ViewParent";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ParentPage() {
  const [registerForm, setRegisterForm] = useState(false);
  const [viewParent, setViewParent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parents, setParents] = useState([]);
  const [parent, setParent] = useState({});

  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

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
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-xl">Parent Portal</h1>
        <button
          onClick={() => setRegisterForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Give Access
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="text-center mt-4">Loading parents...</p>}

      {/* Responsive Table */}
      {!loading && parents.length > 0 && (
        <div className="overflow-x-auto shadow-md rounded-lg">
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
                <tr key={p._id} className="hover:bg-gray-50 text-sm md:text-base">
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
          setRegisterForm={setRegisterForm}
          getParents={getAllPortalParent}
         
        />
      )}
    </div>
  );
}

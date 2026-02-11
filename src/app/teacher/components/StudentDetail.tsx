"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function StudentDetail({id,student,setStudent}:{id:string,student?:any,setStudent?:any}) {
   
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    // Fetch student details based on the id prop
    useEffect(() => {
         getStudent();
    },[]);

     async function getStudent() {
        const token = localStorage.getItem("codeflam01_token");
        try {
          const response = await axios.get(
            `http://13.53.160.202/api/v1/student/student/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Student Data:", response.data);
          const data = response.data;
          setStudent({
            id: data._id,
            profile_picture:
              data.profile_picture ||
              "https://images.pexels.com/photos/6345317/pexels-photo-6345317.jpeg",
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            gender: data.gender,
            admissionDate: data.admissionDate,
            class_name: data.class?.name || "N/A",
            classId: data.class?.class_id || "",
            batch_name: data.batch?.name || "N/A",
            batchId: data.batch?.batch_id || "",
          });
        } catch (error: any) {
          console.error("Error fetching student:", error);
          if (error.response?.status === 401 || error.response?.status === 403) {
            toast.error("Session expired. Please log in again.");
            localStorage.removeItem("adminToken");
            router.push("/login");
          } else {
            toast.error("Failed to fetch student.");
          }
        } finally {
          setLoading(false);
        }
      }
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
       <div className="space-y-4 text-gray-700">
      <h2 className="text-xl font-semibold border-b pb-2">Student Information</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Class</p>
          <p>{student.class_name}</p>
        </div>
        <div>
          <p className="font-semibold">Batch</p>
          <p>{student.batch_name}</p>
        </div>
        <div>
          <p className="font-semibold">Name</p>
          <p>{student.name}</p>
        </div>
       
        <div>
          <p className="font-semibold">Admission Date</p>
          <p>{new Date(student.admissionDate).toDateString()}</p>
        </div>
      </div>
    </div>
    )
}
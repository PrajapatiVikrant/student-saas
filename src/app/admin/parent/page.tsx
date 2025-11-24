"use client"
import ParentPortalAccessForm from "@/app/components/forms/ParentForm";
import { useState } from "react"


export default function parent(){
  const [registerForm,setRegisterForm]=useState(false);
  const getAllPortalParent = ()=>{

  }
    return (
        <>
        <h1>Parent Portal</h1>
        <button onClick={()=>setRegisterForm(true)}>Give Access</button>
           {/* Student Registration Modal */}
                {registerForm && (
                  <ParentPortalAccessForm
                   
                    setRegisterForm={setRegisterForm}
                    getTeacher={getAllPortalParent}
                    admisson = {false}
                  />)}
        </>
    )
}
import axios from "axios";
import { useRouter } from "next/navigation";
import {  useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
type subjectCareProps = {
  id: string;
  subject: string;
 
  removeSubject:(id: string) => void;
}
export default function SubjectCard({ id, subject, class_id,removeSubject }: subjectCareProps) {
  const router = useRouter();
  
 
  return (
    <article className=" flex items-center gap-1 w-fit justify-between p-1 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-blue-800 text-white  dark:bg-gray-800">
      <span>{subject}</span>
      <button onClick={()=>removeSubject(id)} className="text-xl cursor-pointer"><RxCross2 /></button>
    </article>
  )
}
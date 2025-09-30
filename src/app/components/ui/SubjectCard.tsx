import { RxCross2 } from "react-icons/rx";
export default function SubjectCard() {

    return (
        <article className=" flex items-center gap-1 w-fit justify-between p-1 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-blue-800 text-white  dark:bg-gray-800">
          <span>Science</span> 
          <button className="text-xl cursor-pointer"><RxCross2/></button>
        </article>
    )
}
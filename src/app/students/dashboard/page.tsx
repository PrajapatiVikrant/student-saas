import { PiStudentBold } from "react-icons/pi";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaLayerGroup } from "react-icons/fa6";
import { MdOutlinePayments } from "react-icons/md";
import { GiTimeTrap } from "react-icons/gi";
export default function Dashboard(){
    return (
       <main className="flex-1">
<div className="p-6 md:p-8">
<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
<div>
<h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
<p className="text-gray-500 dark:text-gray-400 mt-1">Overview of your institution's key metrics.</p>
</div>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-4">
<div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
<span className="material-symbols-outlined text-blue-500 dark:text-blue-300"><PiStudentBold/></span>
</div>
<div>
<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</p>
<p className="text-2xl font-bold text-gray-900 dark:text-white">1,250</p>
</div>
</div>
<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-4">
<div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
<span className="material-symbols-outlined text-green-500 dark:text-green-300"><FaPeopleGroup/></span>
</div>
<div>
<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Teachers</p>
<p className="text-2xl font-bold text-gray-900 dark:text-white">75</p>
</div>
</div>
<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-4">
<div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
<span className="material-symbols-outlined text-purple-500 dark:text-purple-300"><FaLayerGroup/></span>
</div>
<div>
<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Batches</p>
<p className="text-2xl font-bold text-gray-900 dark:text-white">32</p>
</div>
</div>
<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-4">
<div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
<span className="material-symbols-outlined text-yellow-500 dark:text-yellow-300"><MdOutlinePayments/></span>
</div>
<div>
<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fees Collected</p>
<p className="text-2xl font-bold text-gray-900 dark:text-white">$1.2M</p>
</div>
</div>
<div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-4">
<div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
<span className="material-symbols-outlined text-red-500 dark:text-red-300"><GiTimeTrap/></span>
</div>
<div>
<p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Dues</p>
<p className="text-2xl font-bold text-gray-900 dark:text-white">$56K</p>
</div>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
<div className="lg:col-span-2">
<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Today's Attendance</h3>
<div className="flex items-center justify-between">
<span className="text-3xl font-bold text-green-500">92%</span>
<div className="w-24 h-24 relative">
<svg className="w-full h-full" viewBox="0 0 36 36">
<path className="text-gray-200 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3.8"></path>
<path className="text-green-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="none" strokeDasharray="92, 100" strokeLinecap="round" strokeWidth="3.8" transform="rotate(90 18 18)"></path>
</svg>
</div>
</div>
<p className="text-sm text-gray-500 dark:text-gray-400 mt-2">23 students absent today.</p>
</div>
<div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upcoming Exams</h3>
<ul className="space-y-3">
<li className="flex justify-between items-center">
<span className="text-gray-700 dark:text-gray-300">Mid-term Physics</span>
<span className="text-sm font-medium text-gray-500 dark:text-gray-400">Mar 25, 2024</span>
</li>
<li className="flex justify-between items-center">
<span className="text-gray-700 dark:text-gray-300">Final Chemistry</span>
<span className="text-sm font-medium text-gray-500 dark:text-gray-400">Apr 02, 2024</span>
</li>
<li className="flex justify-between items-center">
<span className="text-gray-700 dark:text-gray-300">History Paper</span>
<span className="text-sm font-medium text-gray-500 dark:text-gray-400">Apr 10, 2024</span>
</li>
</ul>
<a className="text-primary hover:underline text-sm font-medium mt-4 inline-block" href="#">View All Exams</a>
</div>
</div>
</div>
<div>
<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Important Reminders</h2>
<div className="space-y-4">
<div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-900/50">
<p className="font-medium text-yellow-800 dark:text-yellow-300">Parent-Teacher Meeting</p>
<p className="text-sm text-yellow-600 dark:text-yellow-400">Scheduled for March 28th, 4 PM - 6 PM.</p>
</div>
<div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
<p className="font-medium text-blue-800 dark:text-blue-300">Staff Meeting</p>
<p className="text-sm text-blue-600 dark:text-blue-400">All staff to assemble in the main hall at 1 PM tomorrow.</p>
</div>
<div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900/50">
<p className="font-medium text-red-800 dark:text-red-300">Fee Payment Deadline</p>
<p className="text-sm text-red-600 dark:text-red-400">Final reminder for fee submission by March 31st.</p>
</div>
</div>
</div>
</div>
</div>
</main>
    )
}
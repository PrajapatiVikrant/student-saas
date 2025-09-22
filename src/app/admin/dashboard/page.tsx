import { PiStudentBold } from "react-icons/pi";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaLayerGroup } from "react-icons/fa6";
import { MdOutlinePayments } from "react-icons/md";
import { GiTimeTrap } from "react-icons/gi";
type DashboardCard = {
    title: string;
    data: string;
};
const dashboardCards: DashboardCard[] = [
    {
        title: "Total Students",
        data: "250",
    },
    {
        title: "Total Teachers",
        data: "15",
    },
    {
        title: "Total Batches",
        data: "20",
    },
    {
        title: "Fee Collected",
        data: "₹800000",
    },
    {
        title: "Pending Dues",
        data: "₹5000",
    },
]
export default function Dashboard() {
    return (
        <>
            <header>
                <h1 className="font-bold text-3xl m-5">Dashboard</h1>
            </header>
            <main>
                <section className="flex flex-wrap p-5 gap-4 ">
                    {dashboardCards.map((cards,index) => {

                        return (<article key={index} className="flex flex-col gap-2  rounded-lg bg-white p-6 shadow-sm dark:bg-background-dark dark:border dark:border-primary/20">
                            <p className="text-base font-medium text-black/60 dark:text-white/60">{cards.title}</p>
                            <p className="text-3xl font-bold text-black dark:text-white">{cards.data}</p>
                        </article>)
                    })}

                </section>


                <div className="grid grid-cols-1 lg:grid-cols-3 m-5 gap-8">
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

            </main>
        </>
    )
}
"use client"
import Link from "next/link";
import { MdOutlineModeEdit } from "react-icons/md";
export default function BatchCard() {

    return (
        <article className="shadow-md  hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-3">
            <section className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Batch A</h1>
                <button className="cursor-pointer"><MdOutlineModeEdit /></button>
            </section>
            <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300  ">
                <p>Students:30</p>
                <p>Fee:500/month</p>
            </div>
            <center>
                <Link href={"/admin/class_batch/class/batch/students"}>
                <button className="bg-blue-700 text-white text-xs cursor-pointer hover:bg-blue-500 w-fit  p-2.5 rounded">View Class</button>
                </Link>
            </center>
        </article>
    )
}
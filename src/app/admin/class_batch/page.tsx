"use client"

import ClassRoomCard from "@/app/components/ui/ClassRoomCard"

export default function class_batch(){

    return (
        <>
        {/* class & batch page */}
        <section>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 p-6">Class & Batch Management</h1>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {/* Example ClassRoomCard components */}
                <ClassRoomCard />
                <ClassRoomCard />
                <ClassRoomCard />
                <ClassRoomCard />
                <ClassRoomCard />
                <ClassRoomCard />
            </section>
        </section>

       
        </>
    )
}
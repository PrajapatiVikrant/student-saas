"use client"
import { FiSearch } from "react-icons/fi";

export default function dashboard(){
    return (
        <>
           {/* MAIN */}
      <main className="grow pb-24">
        <h1 className="text-[#111318] dark:text-white text-[32px] font-bold px-4 pb-3 pt-2">
          Good Morning, Sarah
        </h1>

        {/* HOMEROOM CARD */}
        <div className="p-4">
          <div className="flex flex-col xl:flex-row rounded-xl shadow-sm bg-white dark:bg-background-dark dark:border dark:border-gray-700">

            {/* Image */}
            <div
              className="w-full bg-center bg-cover aspect-video rounded-t-xl"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDmb2nuuaOlVeT_aY7TmRwjMBh3THJ8PTI5MQyoMscVNG7JelhyQOAi2pF2Kwin9viV7Robvq-Fu7KWMZneQaa00PMN6J0n7MVf3cc0APEyAJ5-QRoNih_yawoqBcTrrgw4z88xSM2JRP9M95h6kA19QMKHCl9lVG8iDD8EBtCz-EhdGnlxCCn-as-TP4dF7yAYOVw0GlZOnRqsfaPPa7bF3HWRfsXhWBDrnXiDkLVELSVyhvBB7YnEVu8RcSXAD0aerMtggvNIvDrl")',
              }}
            ></div>

            {/* Content */}
            <div className="flex flex-col gap-2 w-full py-4 px-4">
              <p className="text-[#111318] dark:text-white text-lg font-bold">
                Homeroom: Grade 5A
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-[#616f89] dark:text-gray-400 text-base">Attendance Pending</p>
                  <p className="text-[#616f89] dark:text-gray-400 text-base">25 Students</p>
                </div>

                <button className="h-10 px-4 bg-primary text-white rounded-lg text-sm font-medium">
                  Take Attendance
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <h2 className="text-[#111318] dark:text-white text-[22px] font-bold px-4 pb-3 pt-5">
          My Classes
        </h2>

        <div className="px-4 py-3">
          <label className="flex flex-col h-12 w-full">
            <div className="flex items-stretch w-full rounded-lg h-full bg-white dark:bg-gray-800">
              <div className="flex items-center justify-center pl-4 text-[#616f89] dark:text-gray-400 text-xl">
                <FiSearch />
              </div>

              <input
                className="flex w-full px-4 bg-transparent border-none focus:outline-none text-[#111318] dark:text-white placeholder:text-[#616f89] dark:placeholder:text-gray-400"
                placeholder="Find a class"
              />
            </div>
          </label>
        </div>

        {/* CLASS LIST */}
        <div className="flex flex-col gap-3 px-4">

          {/* Card Component */}
          {[
            { title: "Math - Grade 5A", room: "Room 102" },
            { title: "Science - Grade 5B", room: "Room 205" },
            { title: "History - Grade 6", room: "Room 301" },
          ].map((cls, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl p-4 bg-white dark:bg-background-dark dark:border dark:border-gray-700 shadow-sm"
            >
              <div className="flex flex-col">
                <p className="text-[#111318] dark:text-white text-base font-bold">{cls.title}</p>
                <p className="text-[#616f89] dark:text-gray-400 text-sm">{cls.room}</p>
              </div>

              <button className="h-9 px-4 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium">
                Add Record
              </button>
            </div>
          ))}
        </div>
      </main>
        </>
    )
}
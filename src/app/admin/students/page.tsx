"use client";
import React from "react";
import { FaEye, FaEdit, FaTrash, FaWhatsapp, FaSearch } from "react-icons/fa";

export default function Students() {
    const students = [
        {
            rollNo: 1,
            name: "Amit Sharma",
            email: "amit.sharma@example.com",
            phone: "+91 9876543210",
            batch: "A",
            class: "10th",
            status: "Active",
            joined: "2023-06-15",
            parentPhone: "+91 9123456789",
        },
        {
            rollNo: 2,
            name: "Priya Verma",
            email: "priya.verma@example.com",
            phone: "+91 8765432109",
            batch: "B",
            class: "9th",
            status: "Inactive",
            joined: "2023-07-10",
            parentPhone: "+91 9876501234",
        },
        {
            rollNo: 3,
            name: "Rohit Singh",
            email: "rohit.singh@example.com",
            phone: "+91 7654321098",
            batch: "A",
            class: "10th",
            status: "Active",
            joined: "2023-08-01",
            parentPhone: "+91 9988776655",
        },
        {
            rollNo: 4,
            name: "Neha Patel",
            email: "neha.patel@example.com",
            phone: "+91 6543210987",
            batch: "C",
            class: "8th",
            status: "Active",
            joined: "2023-09-12",
            parentPhone: "+91 8877665544",
        },
        {
            rollNo: 5,
            name: "Arjun Mehta",
            email: "arjun.mehta@example.com",
            phone: "+91 9123456700",
            batch: "B",
            class: "9th",
            status: "Inactive",
            joined: "2023-10-05",
            parentPhone: "+91 7766554433",
        },
    ];

    return (
        <>
            {/* Header */}
            <header className="p-4  mb-4">
                <h1 className="text-2xl font-bold mb-3">Students</h1>

                {/* Filters */}
                <nav className="flex justify-center">
                    <form className="w-[70%] grid grid-cols-[2fr_1fr_1fr] gap-3.5">
                        {/* Search Input with Icon */}
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                className="border outline-none p-2 pl-10 rounded w-full"
                                type="text"
                                placeholder="Search Student by id, email or name"
                            />
                        </div>

                        {/* Batch Dropdown */}
                        <select className="outline-none border p-2 rounded" name="Batch">
                            <option value="">Batch</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                        </select>

                        {/* Year Dropdown */}
                        <select className="outline-none border p-2 rounded" name="Year">
                            <option value="">Year</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                        </select>
                    </form>
                </nav>
            </header>

            {/* Main Section */}
            <main className="p-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
                    New Admission
                </button>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="p-2 text-left border-b">Roll No</th>
                                <th className="p-2 text-left border-b">Name</th>
                                <th className="p-2 text-left border-b">Email</th>
                                <th className="p-2 text-left border-b">Phone</th>
                                <th className="p-2 text-left border-b">Batch</th>
                                <th className="p-2 text-left border-b">Class</th>
                                <th className="p-2 text-left border-b">Status</th>
                                <th className="p-2 text-left border-b">Joined</th>
                                <th className="p-2 text-center border-b">View</th>
                                <th className="p-2 text-center border-b">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, id) => (
                                <tr
                                    key={id}
                                    className="hover:bg-gray-50 bg-white transition-colors"
                                >
                                    <td className="p-2 ">{student.rollNo}</td>
                                    <td className="p-2 font-medium text-gray-800">{student.name}</td>
                                    <td className="p-2 text-gray-600">{student.email}</td>
                                    <td className="p-2 ">
                                        {student.phone}
                                        <a
                                            href={`https://wa.me/${student.phone.replace(/[^0-9]/g, "")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-2 text-green-600 hover:text-green-800 inline-block"
                                        >
                                            <FaWhatsapp />
                                        </a>
                                    </td>
                                    <td className="p-2 ">{student.batch}</td>
                                    <td className="p-2 ">{student.class}</td>
                                    <td className="p-2">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${student.status === "Active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="p-2 ">{student.joined}</td>
                                    
                                    <td className="p-2  text-center">
                                        <button className="text-blue-600 hover:text-blue-800">
                                            <FaEye />
                                        </button>
                                    </td>
                                    <td className="p-2  flex justify-center gap-3">
                                        <button className="text-green-600 hover:text-green-800">
                                            <FaEdit />
                                        </button>
                                        <button className="text-red-600 hover:text-red-800">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


            </main>
        </>
    );
}

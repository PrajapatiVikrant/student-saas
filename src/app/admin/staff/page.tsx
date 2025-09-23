"use client";
import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash, FaWhatsapp, FaSearch } from "react-icons/fa";

export default function Staff() {
  const [search, setSearch] = useState("");

  const staffList = [
    {
      id: 1,
      name: "Amit Sharma",
      email: "amit.sharma@example.com",
      phone: "+91 9876543210",
      class: "10th",
      batch: "A",
      subject: "Mathematics",
      role: "Teacher",
      joined: "2023-06-15",
    },
    {
      id: 2,
      name: "Priya Verma",
      email: "priya.verma@example.com",
      phone: "+91 8765432109",
      class: "9th",
      batch: "B",
      subject: "English",
      role: "Teacher",
      joined: "2023-07-10",
    },
    {
      id: 3,
      name: "Rohit Singh",
      email: "rohit.singh@example.com",
      phone: "+91 7654321098",
      class: "Finance",
      batch: "-",
      subject: "-",
      role: "Accountant",
      joined: "2023-08-01",
    },
    {
      id: 4,
      name: "Neha Patel",
      email: "neha.patel@example.com",
      phone: "+91 6543210987",
      class: "Office",
      batch: "-",
      subject: "-",
      role: "Receptionist",
      joined: "2023-09-12",
    },
  ];

  const filteredStaff = staffList.filter(
    (staff) =>
      staff.name.toLowerCase().includes(search.toLowerCase()) ||
      staff.email.toLowerCase().includes(search.toLowerCase()) ||
      staff.id.toString().includes(search)
  );

  return (
    <>
      {/* Header */}
      <header className="p-4 mb-4">
        <h1 className="text-2xl font-bold mb-3">Staff Management</h1>

        {/* Filters */}
        <nav className="flex justify-center">
          <form className="w-[80%] grid grid-cols-[2fr_1fr_1fr_1fr] gap-3.5">
            {/* Search Input with Icon */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                className="border outline-none p-2 pl-10 rounded w-full"
                type="text"
                placeholder="Search staff by id, email or name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Class Dropdown */}
            <select className="outline-none border p-2 rounded" name="Class">
              <option value="">Class</option>
              <option value="10th">Class 10th</option>
              <option value="9th">Class 9th</option>
              <option value="Office">Office Staff</option>
              <option value="Finance">Finance</option>
            </select>

            {/* Batch Dropdown */}
            <select className="outline-none border p-2 rounded" name="Batch">
              <option value="">Batch</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="-">-</option>
            </select>

            {/* Role Dropdown */}
            <select className="outline-none border p-2 rounded" name="Role">
              <option value="">Role</option>
              <option value="Teacher">Teacher</option>
              <option value="Accountant">Accountant</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Clerk">Clerk</option>
            </select>
          </form>
        </nav>
      </header>

      {/* Main Section */}
      <main className="p-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
          + New Staff
        </button>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2 text-left border-b">Id</th>
                <th className="p-2 text-left border-b">Name</th>
                <th className="p-2 text-left border-b">Email</th>
                <th className="p-2 text-left border-b">Phone</th>
                <th className="p-2 text-left border-b">Class</th>
                <th className="p-2 text-left border-b">Batch</th>
                <th className="p-2 text-left border-b">Subject</th>
                <th className="p-2 text-left border-b">Role</th>
                <th className="p-2 text-left border-b">Joined</th>
                <th className="p-2 text-center border-b">View</th>
                <th className="p-2 text-center border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff, id) => (
                <tr
                  key={id}
                  className="hover:bg-gray-50 bg-white transition-colors"
                >
                  <td className="p-2">{staff.id}</td>
                  <td className="p-2 font-medium text-gray-800">{staff.name}</td>
                  <td className="p-2 text-gray-600">{staff.email}</td>
                  <td className="p-2">
                    {staff.phone}
                    <a
                      href={`https://wa.me/${staff.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-green-600 hover:text-green-800 inline-block"
                    >
                      <FaWhatsapp />
                    </a>
                  </td>
                  <td className="p-2">{staff.class}</td>
                  <td className="p-2">{staff.batch}</td>
                  <td className="p-2">{staff.subject}</td>
                  <td className="p-2">{staff.role}</td>
                  <td className="p-2">{staff.joined}</td>
                  <td className="p-2 text-center">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEye />
                    </button>
                  </td>
                  <td className="p-2 flex justify-center gap-3">
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

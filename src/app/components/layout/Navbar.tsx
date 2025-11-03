"use client";

import { useState } from "react";
import Link from "next/link";
import { HiOutlineMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="flex justify-between items-center px-6 py-3 shadow-sm bg-white sticky top-0 z-50"
      style={{ fontFamily: "Manrope, sans-serif" }}
    >
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/plateform_logo.png"
          width="110"
          alt="platform_logo"
          className="cursor-pointer"
        />
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
        <li className="hover:text-blue-600 hover:border-b-2 border-blue-600 p-2 transition-all">
          <Link href="/">Dashboard</Link>
        </li>
        <li className="hover:text-blue-600 hover:border-b-2 border-blue-600 p-2 transition-all">
          <Link href="/dashboard">Profile</Link>
        </li>
        <li className="hover:text-blue-600 hover:border-b-2 border-blue-600 p-2 transition-all">
          <Link href="/dashboard">Plan</Link>
        </li>
        <li className="hover:text-blue-600 hover:border-b-2 border-blue-600 p-2 transition-all">
          <Link href="/dashboard">Setting</Link>
        </li>
      </ul>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-3xl text-gray-700"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <HiX /> : <HiOutlineMenu />}
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md py-4 md:hidden">
          <ul className="flex flex-col items-center gap-4 text-gray-700 font-medium">
            <li className="hover:text-blue-600 transition-all">
              <Link href="/" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
            </li>
            <li className="hover:text-blue-600 transition-all">
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
            </li>
            <li className="hover:text-blue-600 transition-all">
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                Plan
              </Link>
            </li>
            <li className="hover:text-blue-600 transition-all">
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                Setting
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

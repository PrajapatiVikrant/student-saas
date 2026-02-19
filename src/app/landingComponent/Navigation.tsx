"use client";

import Image from "next/image";
import { useState } from "react";
import logo from "./assets/logo.webp";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Navbar */}
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src={logo}
              alt="platform logo"
              width={65}
              height={65}
              priority
              className="object-contain"
            />

            <h1 className="text-xl font-bold text-gray-900">
              InstituteERP
            </h1>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10 font-medium text-[15px]">
            <a
              href="#features"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Features
            </a>

            <a
              href="#portals"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Portals
            </a>

            <a
              href="#contact"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {open && (
          <div className="md:hidden pb-4 pt-2 flex flex-col gap-3">
            <a
              href="#features"
              onClick={() => setOpen(false)}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Features
            </a>

            <a
              href="#portals"
              onClick={() => setOpen(false)}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Portals
            </a>

            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Contact
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

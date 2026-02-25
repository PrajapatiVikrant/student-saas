"use client";

import Image from "next/image";
import logo from "./assets/logo.webp";
import {
  Facebook,
  Linkedin,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Globe,
  AtSign,
  Mail,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-10 mb-10">

          {/* Logo + About */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white rounded-xl p-2 shadow-md flex items-center justify-center">
                <Image
                  src={logo}
                  alt="InstituteERP Logo"
                  width={65}
                  height={65}
                  className="object-contain"
                  priority
                />
              </div>

              <span className="font-semibold text-xl text-white">
                InstituteERP
              </span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              InstituteERP is an all-in-one school and coaching management platform
              that helps institutions manage students, staff, fees, attendance,
              and parent communication in real-time.
            </p>

            <p className="text-gray-400 text-sm mt-4">
              Powered by{" "}
              <span className="text-white font-medium">
                CodeFlame Technology
              </span>
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#portals" className="hover:text-white transition-colors">
                  Portals
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-white transition-colors">
                  Security
                </a>
              </li>
              <li>
                <a href="#updates" className="hover:text-white transition-colors">
                  Updates
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>

            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-300 mt-1" />
                <span>
                  CodeFlame Technology <br />
                  Ghaziabad, Uttar Pradesh - 201102, India
                </span>
              </li>

              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-300" />
                <a
                  href="tel:+919149209580"
                  className="hover:text-white transition-colors"
                >
                  +91 9149209580, +91 7678110578
                </a>
              </li>

              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-gray-300 mt-1 shrink-0" />
                <a
                  href="mailto:contact@codeflametechnology.com"
                  className="hover:text-white transition-colors break-all"
                >
                  contact@codeflametechnology.com
                </a>
              </li>


              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-300" />
                <a
                  href="https://www.codeflametechnology.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  codeflametechnology.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/company/codeflame-technology-pvt-ltd/posts/?feedView=all"
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/codeflame_technology?igsh=amRtdXFleDY1OTFt"
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2026 CodeFlame Technology. All rights reserved.
            </p>

            <div className="flex gap-6 text-sm">
              <a href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  MoreVertical,
  GraduationCap,
  Pencil,
  Trash2,
  School,
  ArrowRight,
} from "lucide-react";
import { toast, Toaster } from "sonner";

import { Button } from "@/app/components/ui/attendanceUi/Button";
import { Input } from "@/app/components/ui/attendanceUi/Input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/attendanceUi/Card";
import { Skeleton } from "@/app/components/ui/attendanceUi/Skeleton";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/attendanceUi/Dialog";

import { Label } from "@/app/components/ui/attendanceUi/Label";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ---------------- TYPES ----------------
type ClassInfo = {
  _id: string;
  class: {
    name: string;
    batches: any[];
  };
};

// ---------------- SORT HELPER ----------------
const getClassOrder = (name: string) => {
  const n = name.toLowerCase().trim();

  if (n.includes("play")) return -1;
  if (n.includes("nursery")) return 0;
  if (n.includes("lkg")) return 1;
  if (n.includes("ukg")) return 2;

  const match = n.match(/\d+/);
  if (match) return parseInt(match[0]);

  return 999;
};

// Gradient helper
const getGradient = (str: string) => {
  const gradients = [
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-indigo-500 to-purple-500",
    "from-orange-500 to-amber-500",
    "from-rose-500 to-pink-500",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

// ---------------- DROPDOWN ----------------
function ActionDropdown({ onEdit, onDelete }: any) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const close = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <Button size="icon" variant="ghost" onClick={() => setOpen(!open)}>
        <MoreVertical className="w-4 h-4" />
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-900 border rounded-xl shadow z-50">
          <button
            onClick={onEdit}
            className="flex w-full px-3 py-2 gap-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Pencil className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={onDelete}
            className="flex w-full px-3 py-2 gap-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------- MAIN ----------------
export default function ClassBatch() {
  const router = useRouter();

  const [classList, setClassList] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("codeflam01_token");
      const res = await axios.get(
        "https://codeflame-edu-backend.xyz/api/v1/kaksha",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClassList(res.data);
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FILTER + SORT
  const filtered = classList
    .filter((c) =>
      c.class.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const orderA = getClassOrder(a.class.name);
      const orderB = getClassOrder(b.class.name);
      return orderB - orderA; // descending
    });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <Toaster />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <School className="w-6 h-6 text-indigo-600" />
          Class Management
        </h1>

        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Button className="bg-indigo-600 text-white">
            <Plus className="w-4 h-4 mr-1" /> Add Class
          </Button>
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <Skeleton className="h-40" />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const gradient = getGradient(item.class.name);

            const totalStudents = item.class.batches.reduce(
              (acc: number, b: any) => acc + b.total_students,
              0
            );

            return (
              <Card key={item._id} className="shadow hover:shadow-lg transition">
                <div className={`h-1 bg-gradient-to-r ${gradient}`} />

                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white`}
                      >
                        <GraduationCap />
                      </div>
                      <CardTitle>{item.class.name}</CardTitle>
                    </div>

                    <ActionDropdown onEdit={() => {}} onDelete={() => {}} />
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-3">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>👨‍🎓 {totalStudents} Students</span>
                    <span>📚 {item.class.batches.length} Batches</span>
                  </div>

                  <div className="flex flex-col gap-2 max-h-40 overflow-auto pr-1">
                    {item.class.batches.length === 0 && (
                      <p className="text-xs text-center text-slate-400">
                        No batches
                      </p>
                    )}

                    {item.class.batches.map((batch: any) => (
                      <div
                        key={batch._id}
                        className="flex justify-between items-center p-2 border rounded-lg bg-slate-50 dark:bg-slate-800 hover:shadow-sm"
                      >
                        <div>
                          <p className="text-sm font-semibold">
                            {batch.batch_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {batch.total_students} students
                          </p>
                        </div>

                        <Link
                          href={`/admin/class_batch/class/batch/students/${item._id}/${batch._id}`}
                          className="text-xs px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          ➕ Add
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter>
                  <Link
                    href={`/admin/class_batch/class/${item._id}`}
                    className="text-indigo-600 flex items-center justify-between w-full"
                  >
                    Manage Class
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Plus,
  Search,
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/attendanceUi/Dialog";

import Link from "next/link";
import StudentAdmission from "@/app/components/forms/StudentAdmission";

// ---------------- TYPES ----------------
type ClassInfo = {
  _id: string;
  class: {
    name: string;
    batches: any[];
  };
};

// ---------------- HELPER ----------------
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
  const [classList, setClassList] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // dialogs
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newClass, setNewClass] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const [processing, setProcessing] = useState(false);

  // student form
  const [registerForm, setRegisterForm] = useState(false);
  const [classData, setClassData] = useState<any>({});

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

  // ---------------- CREATE ----------------
  const handleCreate = async () => {
    if (!newClass.trim()) return toast.error("Enter class name");

    setProcessing(true);
    try {
      const token = localStorage.getItem("codeflam01_token");

      await axios.post(
        "https://codeflame-edu-backend.xyz/api/v1/kaksha",
        { name: newClass },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Class created");
      setIsCreateOpen(false);
      setNewClass("");
      fetchClasses();
    } catch {
      toast.error("Create failed");
    } finally {
      setProcessing(false);
    }
  };

  // ---------------- EDIT ----------------
  const handleEdit = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem("codeflam01_token");

      await axios.put(
        `https://codeflame-edu-backend.xyz/api/v1/kaksha/${editId}`,
        { class_name: editName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Updated");
      setIsEditOpen(false);
      fetchClasses();
    } catch {
      toast.error("Update failed");
    } finally {
      setProcessing(false);
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem("codeflam01_token");

      await axios.delete(
        `https://codeflame-edu-backend.xyz/api/v1/kaksha/${deleteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Deleted");
      setIsDeleteOpen(false);
      fetchClasses();
    } catch {
      toast.error("Delete failed");
    } finally {
      setProcessing(false);
    }
  };

  function handleBatchAddClick(classId: string, batchId: string, className: string, batchName: string) {
    setRegisterForm(true);
    setClassData({ classId, class_name: className, batchId, batch_name: batchName });
  }

  const filtered = classList.filter((c) =>
    c.class.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

          <Button
            className="bg-indigo-600 text-white"
            onClick={() => setIsCreateOpen(true)}
          >
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

                    <ActionDropdown onEdit={() => {
                        setEditId(item._id);
                        setEditName(item.class.name);
                        setIsEditOpen(true);
                      }}
                       onDelete={() => {
                        setDeleteId(item._id);
                        setIsDeleteOpen(true);
                       }} />
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
                         <Link
                          href={`/admin/class_batch/class/batch/students/${item._id}/${batch._id}`}
                          className="text-xs px-3 py-1 rounded  dark:text-white "
                        >
                          <p className="text-sm font-semibold">
                            {batch.batch_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {batch.total_students} students
                          </p>
                        </Link>

                        <div
                          onClick={()=>handleBatchAddClick(item._id, batch._id, item.class.name, batch.batch_name)}
                          className="text-xs px-3 cursor-pointer py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          ➕ Add
                        </div>
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

      {/* dialogs same as before */}
      {/* CREATE */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Class</DialogTitle></DialogHeader>
          <Input value={newClass} onChange={(e)=>setNewClass(e.target.value)} />
          <DialogFooter>
            <Button onClick={handleCreate}>{processing?"Creating...":"Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Class</DialogTitle></DialogHeader>
          <Input value={editName} onChange={(e)=>setEditName(e.target.value)} />
          <DialogFooter>
            <Button onClick={handleEdit}>{processing?"Updating...":"Update"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="text-red-600">Delete</DialogTitle></DialogHeader>
          <DialogFooter>
            <Button onClick={handleDelete} className="bg-red-600 text-white">
              {processing?"Deleting...":"Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* STUDENT FORM */}
      {registerForm && (
        <StudentAdmission
          class_name={classData.class_name}
          classId={classData.classId}
          batch_name={classData.batch_name}
          batchId={classData.batchId}
          setRegisterForm={setRegisterForm}
          getStudent={fetchClasses}
          admisson={false}
        />
      )}
    </div>
  );
}
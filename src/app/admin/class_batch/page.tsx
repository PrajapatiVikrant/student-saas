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

// --- Types ---
type ClassInfo = {
  _id: string;
  class: {
    thumbnail?: string;
    name: string;
    subjects: string[];
    batches: string[];
    description?: string;
  };
};

// Helper to get consistent colors based on string
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

// ---------------- CUSTOM DROPDOWN COMPONENT ----------------
function ActionDropdown({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        onClick={() => setOpen((prev) => !prev)}
      >
        <MoreVertical className="w-4 h-4" />
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl overflow-hidden z-50">
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Pencil className="w-4 h-4" /> Edit
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function ClassBatch() {
  const router = useRouter();

  const [classList, setClassList] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Create Dialog
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  // Edit Dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editClassName, setEditClassName] = useState("");
  const [editClassId, setEditClassId] = useState<string | null>(null);

  // Delete Dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteClassId, setDeleteClassId] = useState<string | null>(null);

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("codeflam01_token");
      if (!token) {
        toast.error("No token found. Please login again.");
        router.push("/login");
        return;
      }

      const response = await axios.get(
        "http://13.53.160.202/api/v1/kaksha",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setClassList(response.data);
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("codeflam01_token");
        router.push("/login");
      } else {
        toast.error("Failed to load class list ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------- CREATE CLASS ----------------
  const handleCreateClass = async () => {
    if (!newClassName.trim()) {
      toast.warning("Class name is required");
      return;
    }

    setProcessing(true);

    try {
      const token = localStorage.getItem("codeflam01_token");
      if (!token) {
        toast.error("Please log in first.");
        router.push("/login");
        return;
      }

      const response = await axios.post(
        "http://13.53.160.202/api/v1/kaksha",
        { name: newClassName.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message || "Class created successfully!");
      setNewClassName("");
      setIsCreateDialogOpen(false);
      fetchClasses();
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("codeflam01_token");
        router.push("/login");
      } else {
        toast.error("Failed to create class ❌");
      }
    } finally {
      setProcessing(false);
    }
  };

  // ---------------- OPEN EDIT ----------------
  const openEditDialog = (cls: ClassInfo) => {
    setEditClassId(cls._id);
    setEditClassName(cls.class.name);
    setIsEditDialogOpen(true);
  };

  // ---------------- UPDATE CLASS ----------------
  const handleEditClass = async () => {
    if (!editClassName.trim()) {
      toast.warning("Class name is required");
      return;
    }

    if (!editClassId) return;

    setProcessing(true);

    try {
      const token = localStorage.getItem("codeflam01_token");
      if (!token) {
        toast.error("Please log in first.");
        router.push("/login");
        return;
      }

      const response = await axios.put(
        `http://13.53.160.202/api/v1/kaksha/${editClassId}`,
        { class_name: editClassName.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message || "Class updated successfully!");
      setIsEditDialogOpen(false);
      setEditClassId(null);
      setEditClassName("");
      fetchClasses();
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("codeflam01_token");
        router.push("/login");
      } else {
        toast.error("Failed to edit class ❌");
      }
    } finally {
      setProcessing(false);
    }
  };

  // ---------------- OPEN DELETE ----------------
  const openDeleteDialog = (id: string) => {
    setDeleteClassId(id);
    setIsDeleteDialogOpen(true);
  };

  // ---------------- DELETE CLASS ----------------
  const handleDeleteClass = async () => {
    if (!deleteClassId) return;

    setProcessing(true);

    try {
      const token = localStorage.getItem("codeflam01_token");
      if (!token) {
        toast.error("Please log in first.");
        router.push("/login");
        return;
      }

      await axios.delete(
        `http://13.53.160.202/api/v1/kaksha/${deleteClassId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Class deleted successfully ✅");
      setIsDeleteDialogOpen(false);
      setDeleteClassId(null);
      fetchClasses();
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("codeflam01_token");
        router.push("/login");
      } else {
        toast.error("Failed to delete class ❌");
      }
    } finally {
      setProcessing(false);
    }
  };

  const filteredClasses = classList.filter((c) =>
    c.class.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20 font-sans">
      <Toaster richColors position="top-center" />

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <School className="w-6 h-6 text-indigo-600" />
                Class Management
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Manage your classes, subjects, and student batches efficiently.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search classes..."
                  className="pl-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-1 bg-slate-50 dark:bg-slate-800">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-slate-900 shadow-sm text-indigo-600"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "list"
                      ? "bg-white dark:bg-slate-900 shadow-sm text-indigo-600"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" /> Create Class
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-4 sm:hidden relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search classes..."
              className="pl-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton
                  className={`rounded-xl ${
                    viewMode === "grid" ? "h-32" : "h-24"
                  }`}
                />
              </div>
            ))}
          </div>
        ) : filteredClasses.length > 0 ? (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {filteredClasses.map((item) => {
              const gradient = getGradient(item.class.name);

              return viewMode === "grid" ? (
                <Card
                  key={item._id}
                  className="group flex flex-col border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 hover:border-indigo-200 dark:hover:border-indigo-600 bg-white dark:bg-slate-900 overflow-hidden"
                >
                  <div className={`h-2 w-full bg-gradient-to-r ${gradient}`} />

                  <CardHeader className="pb-2 relative">
                    <div className="flex justify-between items-start">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-sm mb-3`}
                      >
                        <GraduationCap className="w-6 h-6" />
                      </div>

                      <ActionDropdown
                        onEdit={() => openEditDialog(item)}
                        onDelete={() => openDeleteDialog(item._id)}
                      />
                    </div>

                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                      {item.class.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="py-2 flex-grow">
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold text-slate-700 dark:text-white">
                          {item.class.subjects.length}
                        </span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                          Subjects
                        </span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold text-slate-700 dark:text-white">
                          {item.class.batches.length}
                        </span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                          Batches
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2 pb-4 border-t border-slate-50 dark:border-slate-800 mt-auto">
                    <Link
                      href={`/admin/class_batch/class/${item._id}`}
                      className="w-full flex p-2 px-3 rounded-xl justify-between text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-slate-800 group/btn"
                    >
                      Manage Class
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </CardFooter>
                </Card>
              ) : (
                <Card
                  key={item._id}
                  className="group flex flex-col sm:flex-row items-center border-slate-200 dark:border-slate-800 hover:shadow-md transition-all hover:border-indigo-200 dark:hover:border-indigo-600 bg-white dark:bg-slate-900 p-1"
                >
                  <div
                    className={`w-2 self-stretch rounded-l-md bg-gradient-to-b ${gradient} hidden sm:block`}
                  />

                  <div className="flex-1 flex flex-col sm:flex-row items-center p-4 gap-4 w-full">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} shrink-0 flex items-center justify-center text-white shadow-sm`}
                    >
                      <GraduationCap className="w-5 h-5" />
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                        {item.class.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center sm:text-right">
                        <p className="text-xs text-slate-400 font-medium uppercase">
                          Subjects
                        </p>
                        <p className="font-bold text-slate-700 dark:text-white">
                          {item.class.subjects.length}
                        </p>
                      </div>

                      <div className="flex flex-col items-center sm:text-right">
                        <p className="text-xs text-slate-400 font-medium uppercase">
                          Batches
                        </p>
                        <p className="font-bold text-slate-700 dark:text-white">
                          {item.class.batches.length}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                      <Link
                        href={`/admin/class_batch/class/${item._id}`}
                        className="flex-1 sm:flex-none border px-3 py-2 rounded-lg border-indigo-200 dark:border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800"
                      >
                        View Details
                      </Link>

                      <ActionDropdown
                        onEdit={() => openEditDialog(item)}
                        onDelete={() => openDeleteDialog(item._id)}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
              <School className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No classes found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : "Get started by creating your first class to manage subjects and batches."}
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" /> Create New Class
            </Button>
          </div>
        )}
      </main>

      {/* CREATE CLASS DIALOG */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-900 border dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white">
              Create New Class
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Add a new class to your academic roster.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-slate-700 dark:text-slate-200">
                Class Name
              </Label>
              <Input
                id="name"
                placeholder="Enter new class name"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              className="dark:border-slate-700 dark:text-white"
            >
              Cancel
            </Button>

            <Button
              onClick={handleCreateClass}
              disabled={processing}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {processing ? "Creating..." : "Create Class"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT CLASS DIALOG */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-900 border dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-white">
              Edit Class
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Update your class name.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editName" className="text-slate-700 dark:text-slate-200">
                Class Name
              </Label>
              <Input
                id="editName"
                placeholder="Enter new class name"
                value={editClassName}
                onChange={(e) => setEditClassName(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="dark:border-slate-700 dark:text-white"
            >
              Cancel
            </Button>

            <Button
              onClick={handleEditClass}
              disabled={processing}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {processing ? "Updating..." : "Update Class"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-900 border dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Delete Class
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              Are you sure you want to delete this class? This action cannot be
              undone and will permanently remove all related records including
              academic, attendance, and payment data associated with this class.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="dark:border-slate-700 dark:text-white"
            >
              Cancel
            </Button>

            <Button
              onClick={handleDeleteClass}
              disabled={processing}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {processing ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

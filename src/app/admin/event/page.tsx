"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Pencil, Trash2, PlusCircle, Loader2, School } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/attendanceUi/Button";

// ================= TYPES =================
interface Batch {
  batch_id: string;
  batch_name: string;
}

interface ApiBatch {
  _id: string;
  batch_name: string;
}

interface ClassItem {
  _id: string;
  class: {
    name: string;
    batches: ApiBatch[];
  };
}

interface AddedBy {
  _id: string;
  name: string;
}

interface EventItem {
  _id: string;
  class: {
    id: string;
    class_name: string;
  };
  batch: {
    id: string;
    batch_name: string;
  };
  title: string;
  date: string;
  description: string;
  added_by: AddedBy;
}

interface EventResponse {
  userId: string;
  events: EventItem[];
}

const EventPage: React.FC = () => {
  const router = useRouter();

  const [myId, setMyId] = useState<string>("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [classList, setClassList] = useState<ClassItem[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    class_id: "",
    class_name: "",
    batch_id: "",
    batch_name: "",
    title: "",
    date: "",
    description: "",
  });

  const API_URL = "/api/v1/event";

  // ================= FETCH EVENTS =================
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("codeflam01_token");

      if (!token) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      const res = await axios.get<EventResponse>(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMyId(res.data.userId);
      setEvents(res.data.events);
    } catch (err: unknown) {
      const error = err as AxiosError;
      console.error("Fetch events error:", error);
      toast.error("Failed to load events ❌");
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH CLASSES =================
  const getAllClasses = async () => {
    try {
      setFormLoading(true);
      const token = localStorage.getItem("codeflam01_token");

      if (!token) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      const res = await axios.get<ClassItem[]>("/api/v1/kaksha", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClassList(res.data);
    } catch (err: unknown) {
      const error = err as AxiosError;
      console.error("Fetch classes error:", error);
      toast.error("Failed to load classes ❌");
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    getAllClasses();
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // CLASS CHANGE
    if (name === "class_id") {
      const selectedClass = classList.find((cls) => cls._id === value);

      const mappedBatches: Batch[] =
        selectedClass?.class?.batches?.map((b) => ({
          batch_id: b._id,
          batch_name: b.batch_name,
        })) || [];

      setBatches(mappedBatches);

      setFormData((prev) => ({
        ...prev,
        class_id: value,
        class_name: selectedClass?.class?.name || "",
        batch_id: "",
        batch_name: "",
      }));
      return;
    }

    // BATCH CHANGE
    if (name === "batch_id") {
      const selectedBatch = batches.find((b) => b.batch_id === value);

      setFormData((prev) => ({
        ...prev,
        batch_id: value,
        batch_name: selectedBatch?.batch_name || "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    const { class_id, batch_id, title, date } = formData;

    if (!class_id || !batch_id || !title || !date) {
      toast.warn("All required fields must be filled");
      return;
    }

    try {
      setProcessing(true);
      const token = localStorage.getItem("codeflam01_token");

      if (!token) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      if (editingEvent) {
        await axios.put(`${API_URL}/${editingEvent._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Event updated ✅");
      } else {
        await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Event added ✅");
      }

      resetForm();
      fetchEvents();
    } catch (err: unknown) {
      const error = err as AxiosError;
      console.error("Submit error:", error);
      toast.error("Something went wrong ❌");
    } finally {
      setProcessing(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = (event: EventItem) => {
    const selectedClass = classList.find((cls) => cls._id === event.class.id);

    const mappedBatches: Batch[] =
      selectedClass?.class?.batches?.map((b) => ({
        batch_id: b._id,
        batch_name: b.batch_name,
      })) || [];

    setBatches(mappedBatches);

    setFormData({
      class_id: event.class.id,
      class_name: event.class.class_name,
      batch_id: event.batch.id,
      batch_name: event.batch.batch_name,
      title: event.title,
      date: event.date.split("T")[0],
      description: event.description,
    });

    setEditingEvent(event);
    setShowModal(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;

    try {
      setProcessing(true);
      const token = localStorage.getItem("codeflam01_token");

      if (!token) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Event deleted ✅");
      fetchEvents();
    } catch (err: unknown) {
      const error = err as AxiosError;
      console.error("Delete error:", error);
      toast.error("Delete failed ❌");
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      class_id: "",
      class_name: "",
      batch_id: "",
      batch_name: "",
      title: "",
      date: "",
      description: "",
    });
    setBatches([]);
    setEditingEvent(null);
    setShowModal(false);
  };

  // ================= UI =================
return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">

    {/* HEADER */}
    <div className="bg-white dark:bg-slate-900 border-b mb-2.5 border-slate-200 dark:border-slate-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <School className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Event Management
            </h1>

            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Manage your classes, subjects, and student batches efficiently.
            </p>
          </div>

          <Button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
          >
            <PlusCircle size={18} className="mr-2" /> Add Event
          </Button>
        </div>
      </div>
    </div>

    <div className="max-w-5xl mx-auto px-4">

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={40} />
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow p-10 text-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          <p className="text-lg font-semibold">No events found 📌</p>
          <p className="text-sm mt-1">
            Add your first event using the button above.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h2 className="font-bold text-lg text-slate-800 dark:text-white">
                    {event.title}
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    📅 {event.date.split("T")[0]}
                  </p>
                </div>

                <div className="text-xs px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200 font-semibold">
                  Event
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <p>
                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                    Class:
                  </span>{" "}
                  {event.class.class_name}
                </p>

                <p>
                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                    Batch:
                  </span>{" "}
                  {event.batch.batch_name}
                </p>

                <p>
                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                    Added by:
                  </span>{" "}
                  {event.added_by._id === myId ? "You" : event.added_by.name}
                </p>
              </div>

              {event.description && (
                <div className="mt-4 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {event.description}
                </div>
              )}

              {event.added_by._id === myId && (
                <div className="flex gap-3 mt-5 justify-end">

                  <button
                    onClick={() => handleEdit(event)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-50 dark:bg-yellow-900 hover:bg-yellow-100 dark:hover:bg-yellow-800 text-yellow-700 dark:text-yellow-200 text-sm font-semibold transition"
                  >
                    <Pencil size={16} /> Edit
                  </button>

                  <button
                    onClick={() => handleDelete(event._id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800 text-red-600 dark:text-red-200 text-sm font-semibold transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>

                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>

    {/* MODAL */}
    {showModal && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl w-full max-w-[420px] max-h-[80vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
            {editingEvent ? "Edit Event" : "Add Event"}
          </h2>

          {/* CLASS */}
          <select
            name="class_id"
            value={formData.class_id}
            onChange={handleChange}
            className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-2 mb-3 rounded"
            disabled={formLoading}
          >
            <option value="">Select Class</option>
            {classList.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.class.name}
              </option>
            ))}
          </select>

          {/* BATCH */}
          <select
            name="batch_id"
            value={formData.batch_id}
            onChange={handleChange}
            className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-2 mb-3 rounded"
            disabled={!formData.class_id}
          >
            <option value="">Select Batch</option>
            {batches.map((b) => (
              <option key={b.batch_id} value={b.batch_id}>
                {b.batch_name}
              </option>
            ))}
          </select>

          {/* TITLE */}
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-2 mb-3 rounded"
          />

          {/* DATE */}
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-2 mb-3 rounded"
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white p-2 mb-3 rounded"
            rows={4}
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={resetForm}
              className="px-4 py-2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={processing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {processing ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    )}

    <br /><br /><br />
  </div>
);

};

export default EventPage;

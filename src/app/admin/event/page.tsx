"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, PlusCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Batch {
  batch_id: string;
  batch_name: string;
}

interface ClassItem {
  _id: string;
  class: {
    name: string;
    batches: any[];
  };
}

interface Event {
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
  added_by: string;
}

const EventPage: React.FC = () => {
  const router = useRouter();
  const [myId, setMyId] = useState<string | null>("");
  const [events, setEvents] = useState<Event[]>([]);
  const [classList, setClassList] = useState<ClassItem[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

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

  const API_URL = "http://localhost:4000/api/v1/event";

  // ================= FETCH EVENTS =================
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("codeflam01_token");

      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMyId(res.data.userId);
      setEvents(res.data.events);
    } catch (err) {
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
        toast.error("Session expired");
        router.push("/login");
        return;
      }

      const res = await axios.get("http://localhost:4000/api/v1/kaksha", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClassList(res.data);
    } catch (err: any) {
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

      const mappedBatches =
        selectedClass?.class?.batches?.map((b: any) => ({
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
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong ❌");
    } finally {
      setProcessing(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = (event: Event) => {
    const selectedClass = classList.find((cls) => cls._id === event.class.id);

    const mappedBatches =
      selectedClass?.class?.batches?.map((b: any) => ({
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

      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Event deleted ✅");
      fetchEvents();
    } catch {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Event Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Add, edit and manage school events easily.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2.5 rounded-xl shadow-md w-fit"
          >
            <PlusCircle size={18} /> Add Event
          </button>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center text-slate-500">
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
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h2 className="font-bold text-lg text-slate-800">
                      {event.title}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      📅 {event.date.split("T")[0]}
                    </p>
                  </div>

                  <div className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold">
                    Event
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <p>
                    <span className="font-semibold text-slate-600">Class:</span>{" "}
                    {event.class.class_name}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-600">Batch:</span>{" "}
                    {event.batch.batch_name}
                  </p>
                </div>

                {event.description && (
                  <div className="mt-4 bg-slate-50 p-3 rounded-xl text-sm text-slate-600 border">
                    {event.description}
                  </div>
                )}

                {event.added_by === myId && (
                  <div className="flex gap-3 mt-5 justify-end">
                    <button
                      onClick={() => handleEdit(event)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-sm font-semibold transition"
                    >
                      <Pencil size={16} /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(event._id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold transition"
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
          <div className="bg-white p-6 rounded-xl w-full max-w-[420px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              {editingEvent ? "Edit Event" : "Add Event"}
            </h2>

            {/* CLASS */}
            <select
              name="class_id"
              value={formData.class_id}
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded"
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
              className="w-full border p-2 mb-3 rounded"
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
              className="w-full border p-2 mb-3 rounded"
            />

            {/* DATE */}
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded"
            />

            {/* DESCRIPTION */}
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded"
              rows={4}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 rounded bg-slate-100 hover:bg-slate-200"
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
    </div>
  );
};

export default EventPage;

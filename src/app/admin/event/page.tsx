"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, PlusCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CircularIndeterminate from "@/app/components/ui/CircularIndeterminate";

interface Batch {
  batch_id: string;
  batch_name: string;
}

interface ClassItem {
  _id: string;
  class: {
    name: string;
    batches: Batch[];
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
  type: string;
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
    type: "",
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
      setMyId(res.data.userId)
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
    console.log("hello world")
    const { name, value } = e.target;

    // CLASS CHANGE
    if (name === "class_id") {
      const selectedClass = classList.find((cls) => cls._id === value);

      setBatches(
        selectedClass?.class?.batches?.map((b: any) => ({
          batch_id: b._id,
          batch_name: b.batch_name,
        })) || []
      );

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
      console.log('selectedBatch', selectedBatch)
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
    const { class_id, batch_id, title, date, type } = formData;

    if (!class_id || !batch_id || !title || !date || !type) {
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
      console.log(err)
      toast.error("Something went wrong ❌");
    } finally {
      setProcessing(false);
    }
  };

  // ================= EDIT =================
  const handleEdit = (event: Event) => {
    const selectedClass = classList.find((cls) => cls._id === event.class.id);

    setBatches(
      selectedClass?.class?.batches?.map((b) => ({
        batch_id: b.batch_id,
        batch_name: b.batch_name,
      })) || []
    );

    setFormData({
      class_id: event.class.id,
      class_name: event.class.class_name,
      batch_id: event.batch.id,
      batch_name: event.batch.batch_name,
      title: event.title,
      date: event.date.split("T")[0],
      type: event.type,
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
      type: "",
      description: "",
    });
    setEditingEvent(null);
    setShowModal(false);
  };

  // ================= UI =================
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */} <div className="flex flex-col gap-4 justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Event Management</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center cursor-pointer gap-2 w-fit bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg" >
          <PlusCircle size={18} /> Add Event
        </button>
      </div>

      {loading ? (
        <Loader2 className="animate-spin mx-auto" />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {events.map((event) => (
            <div key={event._id} className="border rounded-xl p-4">
              <h2 className="font-semibold">{event.title}</h2>
              <p>📅 {event.date.split("T")[0]}</p>
              <p>Class: {event.class.class_name}</p>
              <p>Batch: {event.batch.batch_name}</p>

              {event.added_by === myId && (

                <div className="flex gap-3 mt-3 justify-end">
                  <Pencil
                    onClick={() => handleEdit(event)}
                    className="cursor-pointer text-yellow-600"
                  />
                  <Trash2
                    onClick={() => handleDelete(event._id)}
                    className="cursor-pointer text-red-600"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">
            <h2 className="text-lg font-semibold mb-4">
              {editingEvent ? "Edit Event" : "Add Event"}
            </h2>

            <select
              name="class_id"
              value={formData.class_id}
              onChange={handleChange}
              className="w-full border p-2 mb-3"
            >
              <option value="">Select Class</option>
              {formLoading && <CircularIndeterminate size={20} />}
              {classList.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.class.name}
                </option>
              ))}
            </select>

            <select
              name="batch_id"
              value={formData.batch_id}
              onChange={handleChange}
              className="w-full border p-2 mb-3"
            >
              <option value="">Select Batch</option>
              {batches.map((b) => (
                <option key={b.batch_id} value={b.batch_id}>
                  {b.batch_name}
                </option>
              ))}
            </select>

            <input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border p-2 mb-3"
            />

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border p-2 mb-3"
            />

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border p-2 mb-3"
            >
              <option value="">Select Type</option>
              <option value="Test">Test</option>
              <option value="Exam">Exam</option>
              <option value="Holiday">Holiday</option>
            </select>

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-2 mb-3"
            />

            <div className="flex justify-end gap-3">
              <button onClick={resetForm}>Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={processing}
                className="bg-blue-600 text-white px-4 py-2 rounded"
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

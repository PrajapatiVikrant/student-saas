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
  admin_id: string;
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
}

const EventPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [classList, setClassList] = useState<ClassItem[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    class: "",
    class_name: "",
    batch: "",
    batch_name: "",
    title: "",
    date: "",
    type: "",
    description: "",
  });

  const API_URL = "http://localhost:4000/api/v1/event";

  // ✅ Fetch Events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("teacherToken");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data)
      setEvents(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load events ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Classes
  const getAllClasses = async () => {
    setFormLoading(true);
    try {
      const token = localStorage.getItem("teacherToken");
      if (!token) {
        toast.error("No token found. Please login again.");
        router.push("/login");
        return;
      }

      const response = await axios.get("http://localhost:4000/api/v1/kaksha", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClassList(response.data);
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("adminToken");
        router.push("/login");
      } else {
        toast.error("Failed to load class list ❌");
      }
      console.error("Error fetching classes:", error);
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    getAllClasses();
  }, []);

  // ✅ Handle Input Change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "class") {
      const selectedClass = classList.find((cls) => cls._id === value);
      const classBatches =
        selectedClass?.class?.batches?.map((batch) => ({
          batch_id: batch.batch_id ,
          batch_name: batch.batch_name,
        })) || [];
      setBatches(classBatches);

      setFormData({
        ...formData,
        class: value,
        class_name: selectedClass?.class?.name || "",
        batch: "",
        batch_name: "",
      });
      return;
    }

    if (name === "batch") {
      const selectedBatch = batches.find((b) => b.batch_id === value);
      setFormData({
        ...formData,
        batch: value,
        batch_name: selectedBatch?.batch_name || "",
      });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // ✅ Add or Edit Event
  const handleSubmit = async () => {
    if (!formData.class || !formData.title || !formData.date || !formData.type) {
      toast.warn("All fields except description are required!");
      return;
    }

    const token = localStorage.getItem("teacherToken");
    setProcessing(true);

    try {
      if (editingEvent) {
        await axios.put(`${API_URL}/${editingEvent._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Event updated successfully ✅");
      } else {
        await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Event added successfully ✅");
      }

      setFormData({
        class: "",
        class_name: "",
        batch: "",
        batch_name: "",
        title: "",
        date: "",
        type: "",
        description: "",
      });
      setShowModal(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setProcessing(false);
    }
  };

  // ✅ Edit Event
  const handleEdit = (event: Event) => {
    setEditingEvent(event);

    // Load batches for selected class
    const selectedClass = classList.find((cls) => cls._id === event.class.id);
    const classBatches =
      selectedClass?.class?.batches?.map((batch) => ({
        batch_id: batch.batch_id || batch._id,
        batch_name: batch.batch_name,
      })) || [];
    setBatches(classBatches);

    setFormData({
      class: event.class.id,
      class_name: event.class.class_name,
      batch: event.batch.id,
      batch_name: event.batch.batch_name,
      title: event.title,
      date: event.date.split("T")[0],
      type: event.type,
      description: event.description,
    });
    setShowModal(true);
  };

  // ✅ Delete Event
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    const token = localStorage.getItem("teacherToken");
    setProcessing(true);

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Event deleted successfully ✅");
      fetchEvents();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete event ❌");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Event Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center cursor-pointer gap-2 w-fit bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <PlusCircle size={18} />
          Add Event
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <p className="ml-3 text-gray-600">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No events found. Add your first event!
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white shadow-md rounded-xl p-4 flex flex-col justify-between border hover:shadow-lg transition"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {event.title}
                </h2>
                <p className="text-sm text-gray-600">
                  📅 {event.date.split("T")[0]}
                </p>
                <p className="text-sm text-blue-600 font-medium mt-1">
                  Class: {event.class.class_name}
                </p>
                <p className="text-sm text-purple-600 font-medium">
                  Batch: {event.batch.batch_name}
                </p>
                {event.description && (
                  <p className="text-sm mt-2 text-gray-700 border-t pt-2">
                    {event.description}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => handleEdit(event)}
                  className="text-yellow-600 cursor-pointer hover:text-yellow-700"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="text-red-600 cursor-pointer hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-lg w-[90%] sm:w-[400px] p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editingEvent ? "Edit Event" : "Add Event"}
            </h2>

            <div className="flex flex-col gap-3">
              <select
                name="class"
                value={formData.class}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="">Select Class</option>
                {formLoading && <CircularIndeterminate size={50} />}
                {classList.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.class.name}
                  </option>
                ))}
              </select>

              <select
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="">Select Batch</option>
                {batches.map((batch) => (
                  <option key={batch.batch_id} value={batch.batch_id}>
                    {batch.batch_name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="title"
                placeholder="Event title"
                value={formData.title}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="">Select Type</option>
                <option value="Test">Test</option>
                <option value="Exam">Exam</option>
                <option value="Holiday">Holiday</option>
                <option value="Other">Other</option>
              </select>

              <textarea
                name="description"
                placeholder="Add description (optional)"
                value={formData.description}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2 h-20 focus:ring-2 focus:ring-blue-400 outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingEvent(null);
                  setFormData({
                    class: "",
                    class_name: "",
                    batch: "",
                    batch_name: "",
                    title: "",
                    date: "",
                    type: "",
                    description: "",
                  });
                }}
                className="px-4 py-2 border cursor-pointer rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={processing}
                className={`px-4 py-2 rounded-lg text-white ${
                  processing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 cursor-pointer hover:bg-blue-700"
                }`}
              >
                {processing ? (
                  <Loader2 className="animate-spin inline-block" size={16} />
                ) : editingEvent ? (
                  "Update"
                ) : (
                  "Add"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPage;

"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Performance() {
  const currentYear = new Date().getFullYear();

  const [data, setData] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const router = useRouter();

  const getToken = () => {
    const token = localStorage.getItem("codeflam01_token");
    if (!token) {
      router.push("/login");
      throw new Error("No token");
    }
    return token;
  };

  // 🔥 SINGLE API CALL (duplicate removed)
  useEffect(() => {
    (async () => {
      try {
        const token = getToken();
        const res = await axios.get("/api/v1/test", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data.data || []);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  // 🔥 RESET batch when class changes
  useEffect(() => {
    setSelectedBatch("");
  }, [selectedClass]);

  // ================= FILTER =================
  const filteredData = useMemo(() => {
    return data.filter((item: any) => {
      if (item.year !== selectedYear) return false;
      if (selectedClass && item.class_id._id !== selectedClass) return false;
      if (selectedBatch && item.batch_id !== selectedBatch) return false;
      if (selectedExam && item.test_type.id !== selectedExam) return false;
      return true;
    });
  }, [data, selectedYear, selectedClass, selectedBatch, selectedExam]);

  // ================= STUDENT RESULT =================
  const studentResult = useMemo(() => {
    const map = new Map();

    filteredData.forEach((item: any) => {
      const id = item.student.student_id;
      const percentage =
        (Number(item.score.obt_marks) / Number(item.score.max_marks)) * 100;

      if (!map.has(id)) {
        map.set(id, {
          name: item.student.student_name,
          className: item.class_id.class.name,
          total: 0,
          max: 0,
          isFail: false,
        });
      }

      const s = map.get(id);

      s.total += Number(item.score.obt_marks);
      s.max += Number(item.score.max_marks);

      if (percentage < 33) {
        s.isFail = true;
      }
    });

    return Array.from(map.values()).map((s: any) => ({
      ...s,
      percentage: (s.total / s.max) * 100,
      status: s.isFail ? "fail" : "pass",
    }));
  }, [filteredData]);

  // ================= STATS =================
  const stats = useMemo(() => {
    const total = studentResult.length;
    const pass = studentResult.filter((s) => s.status === "pass").length;
    const fail = studentResult.filter((s) => s.status === "fail").length;

    return {
      total,
      pass,
      fail,
      passPercent: total ? ((pass / total) * 100).toFixed(1) : 0,
      failPercent: total ? ((fail / total) * 100).toFixed(1) : 0,
    };
  }, [studentResult]);

  // ================= TOPPERS =================
  const classWiseToppers = useMemo(() => {
    const map = new Map();

    studentResult.forEach((s: any) => {
      if (!map.has(s.className)) map.set(s.className, []);
      map.get(s.className).push(s);
    });

    const result: any = {};

    map.forEach((students, className) => {
      result[className] = students
        .sort((a: any, b: any) => b.percentage - a.percentage)
        .slice(0, 3);
    });

    return result;
  }, [studentResult]);

  // ================= SUBJECT =================
  const subjectPerformance = useMemo(() => {
    const map = new Map();

    filteredData.forEach((item: any) => {
      const key = item.subject.name;
      const percentage =
        (Number(item.score.obt_marks) / Number(item.score.max_marks)) * 100;

      if (!map.has(key)) {
        map.set(key, {
          subject: key,
          teacher: item.added_by.name,
          total: 0,
          max: 0,
          failCount: 0,
        });
      }

      const s = map.get(key);

      s.total += Number(item.score.obt_marks);
      s.max += Number(item.score.max_marks);

      if (percentage < 33) {
        s.failCount += 1;
      }
    });

    return Array.from(map.values()).map((s: any) => ({
      ...s,
      percentage: (s.total / s.max) * 100,
    }));
  }, [filteredData]);

  // ================= TEACHER =================
  const teacherTrend = useMemo(() => {
    const map = new Map();

    filteredData.forEach((item: any) => {
      const teacher = item.added_by.name;

      if (!map.has(teacher)) {
        map.set(teacher, { teacher, total: 0, max: 0 });
      }

      const t = map.get(teacher);
      t.total += Number(item.score.obt_marks);
      t.max += Number(item.score.max_marks);
    });

    return Array.from(map.values()).map((t: any) => ({
      ...t,
      percentage: (t.total / t.max) * 100,
    }));
  }, [filteredData]);

  // ================= OPTIONS =================
  const classOption = useMemo(() => {
    return Array.from(
      new Map(
        data.map((t: any) => [
          t.class_id._id,
          {
            id: t.class_id._id,
            name: t.class_id.class.name,
            batches: t.class_id.class.batches,
          },
        ])
      ).values()
    );
  }, [data]);

  const batchOption = useMemo(() => {
    return classOption.find((c) => c.id === selectedClass)?.batches || [];
  }, [selectedClass, classOption]);

  const examOption = useMemo(() => {
    return Array.from(
      new Map(
        data.map((t: any) => [
          t.test_type.id,
          { id: t.test_type.id, name: t.test_type.name },
        ])
      ).values()
    );
  }, [data]);

  return (
    <div className="p-6 space-y-6">

      {/* FILTERS */}
      <div className="flex gap-4">
        <select onChange={(e) => setSelectedYear(Number(e.target.value))}>
          <option value={currentYear}>{currentYear}</option>
          <option value={currentYear - 1}>{currentYear - 1}</option>
        </select>

        <select onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="">All Class</option>
          {classOption.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select onChange={(e) => setSelectedBatch(e.target.value)}>
          <option value="">Section</option>
          {batchOption.map((b: any) => (
            <option key={b._id} value={b._id}>{b.batch_name}</option>
          ))}
        </select>

        <select onChange={(e) => setSelectedExam(e.target.value)}>
          <option value="">Select Exam</option>
          {examOption.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </div>

      {!selectedExam && (
        <div className="text-center text-gray-500 mt-20">
          Select Exam to view performance
        </div>
      )}

      {selectedExam && (
        <>
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

            {/* TOTAL */}
            <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-blue-500 to-indigo-500">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-lg hover:shadow-xl transition">

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Total Students</p>
                    <h2 className="text-3xl font-bold text-gray-800 mt-1">
                      {stats.total}
                    </h2>
                  </div>

                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 text-xl">
                    👨‍🎓
                  </div>
                </div>

                {/* glow */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>
              </div>
            </div>

            {/* PASS */}
            <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-green-500 to-emerald-500">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-lg hover:shadow-xl transition">

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Pass Students</p>
                    <h2 className="text-3xl font-bold text-green-600 mt-1">
                      {stats.pass}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      {stats.passPercent}% Success Rate
                    </p>
                  </div>

                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 text-green-600 text-xl">
                    ✅
                  </div>
                </div>

                <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-400 opacity-20 rounded-full blur-2xl"></div>
              </div>
            </div>

            {/* FAIL */}
            <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-red-500 to-pink-500">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-lg hover:shadow-xl transition">

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Fail Students</p>
                    <h2 className="text-3xl font-bold text-red-600 mt-1">
                      {stats.fail}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      {stats.failPercent}% Need Improvement
                    </p>
                  </div>

                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-100 text-red-600 text-xl">
                    ⚠️
                  </div>
                </div>

                <div className="absolute -top-6 -right-6 w-24 h-24 bg-red-400 opacity-20 rounded-full blur-2xl"></div>
              </div>
            </div>

          </div>

          {/* TOPPERS */}
          {Object.entries(classWiseToppers).map(([cls, toppers]: any) => (
            <div key={cls}>
              <h2 className="font-bold">{cls}</h2>
              <div className="flex gap-4">
                {toppers.map((t: any, i: number) => (
                  <div key={i} className="p-3 border rounded">
                    {i + 1} - {t.name} ({t.percentage.toFixed(1)}%)
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* CHARTS */}
          {selectedClass && (
            <>
              {/* SUBJECT */}
              <div className="bg-white p-5 rounded-2xl shadow-md">
                <h2 className="mb-4">Subject Performance</h2>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={subjectPerformance}>
                    <CartesianGrid stroke="#e5e7eb" />
                    {/* X AXIS */} <XAxis dataKey="subject" tick={{ fill: "#6b7280", fontSize: 12 }} />
                    {/* Y AXIS */} <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload?.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="bg-white border rounded-lg shadow p-3 text-sm">
                              <p className="font-semibold text-gray-800">{d.subject}</p>
                              <p className="text-gray-600"> Teacher: <span className="font-medium">{d.teacher}</span> </p>
                              <p className="text-red-500">
                                Fail: {d.failCount}
                              </p>
                              <p className="text-gray-800">{d.percentage.toFixed(1)}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                    {/* BAR */} <Bar dataKey="percentage" radius={[10, 10, 0, 0]} fill="url(#colorGradient)" />
                    {/* GRADIENT */} <defs> <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1"> <stop offset="0%" stopColor="#6366f1" /> {/* indigo */} <stop offset="100%" stopColor="#22c55e" /> {/* green */} </linearGradient> </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* TEACHER */}
              <div className="bg-white p-5 rounded-2xl shadow-md">
                <h2 className="text-lg font-semibold mb-4 text-gray-700"> Teacher Trend </h2>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={teacherTrend} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="teacher"
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      padding={{ left: 20, right: 20 }}

                    />
                    {/* Y AXIS */}
                    <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                    {/* TOOLTIP (FIXED + CUSTOM) */} <Tooltip cursor={{ stroke: "#6366f1", strokeWidth: 1 }} content={({ active, payload }) => { if (active && payload && payload.length) { const data = payload[0].payload; return (<div className="bg-white border rounded-lg shadow p-3 text-sm"> <p className="font-semibold text-gray-800"> {data.teacher} </p> <p className="text-indigo-600 font-bold"> {data.percentage.toFixed(1)}% </p> </div>); } return null; }} />
                    {/* LINE */}
                    <Line
                      type="monotone" dataKey="percentage" stroke="url(#lineGradient)"
                      strokeWidth={3} dot={{ r: 5, fill: "#6366f1", strokeWidth: 2, stroke: "#fff", }}
                      activeDot={{ r: 7, fill: "#22c55e", stroke: "#fff", strokeWidth: 2, }} />
                    {/* GRADIENT */}
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6366f1" /> {/* indigo */}
                        <stop offset="100%" stopColor="#22c55e" /> {/* green */}
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
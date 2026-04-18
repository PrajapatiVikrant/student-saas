"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";

type Test = {
  test_name: string;
  createdAt: string;
  class_id: { class: { name: string } };
  student: { student_name: string };
  subject: { name: string };
  score: { max_marks: string; obt_marks: string };
  added_by: { name: string };
};

export default function PerformancePage() {

  const [data, setData] = useState<Test[]>([]);
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedTest, setSelectedTest] = useState("All");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("codeflam01_token")
      : null;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get("/api/v1/test", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setData(res.data.data);
  };

  const toNum = (v: string) => Number(v);

  // ================= FILTER VALID TEST =================
  const validTests = useMemo(() => {
    return data.filter((d) => {
      const name = d.test_name.toLowerCase();
      return !(
        name.includes("unit") ||
        name.includes("chapter") ||
        name.includes("concept")
      );
    });
  }, [data]);

  const normalize = (str: string) => str.trim().toLowerCase();

  // ================= FILTER DATA =================
  const filtered = useMemo(() => {
    return validTests.filter((d) => {
      const classMatch =
        selectedClass === "All" ||
        d.class_id.class.name === selectedClass;

      const testMatch =
        selectedTest === "All" ||
        normalize(d.test_name) === normalize(selectedTest);

      return classMatch && testMatch;
    });
  }, [validTests, selectedClass, selectedTest]);

  // ================= STATS =================
  const stats = useMemo(() => {
    let total = 0, pass = 0, fail = 0;

    filtered.forEach((d) => {
      const percent =
        (toNum(d.score.obt_marks) / toNum(d.score.max_marks)) * 100;

      total += percent;
      percent >= 33 ? pass++ : fail++;
    });

    return {
      avg: filtered.length ? (total / filtered.length).toFixed(2) : "0",
      pass: filtered.length ? ((pass / filtered.length) * 100).toFixed(1) : "0",
      fail: filtered.length ? ((fail / filtered.length) * 100).toFixed(1) : "0",
    };
  }, [filtered]);

  // ================= SUBJECT =================
  const subjectData = useMemo(() => {
    const map: any = {};

    filtered.forEach((d) => {
      const subject = d.subject.name;
      const teacher = d.added_by.name;

      const percent =
        (toNum(d.score.obt_marks) / toNum(d.score.max_marks)) * 100;

      if (!map[subject]) {
        map[subject] = {
          subject,
          total: 0,
          count: 0,
          teachers: new Set(),
        };
      }

      map[subject].total += percent;
      map[subject].count++;
      map[subject].teachers.add(teacher);
    });

    return Object.values(map).map((item: any) => ({
      subject: item.subject,
      avg: (item.total / item.count).toFixed(2),
      teachers: Array.from(item.teachers),
    }));
  }, [filtered]);

  // ================= TEACHER =================
  const teacherData = useMemo(() => {
    const map: any = {};

    filtered.forEach((d) => {
      const teacher = d.added_by.name;

      const percent =
        (toNum(d.score.obt_marks) / toNum(d.score.max_marks)) * 100;

      if (!map[teacher]) {
        map[teacher] = { total: 0, count: 0 };
      }

      map[teacher].total += percent;
      map[teacher].count++;
    });

    return Object.keys(map).map((k) => ({
      teacher: k,
      avg: (map[k].total / map[k].count).toFixed(2),
    }));
  }, [filtered]);

  // ================= TOP TEACHER =================
  const topTeacher = useMemo(() => {
    if (!teacherData.length) return null;

    return teacherData.reduce((a, b) =>
      Number(a.avg) > Number(b.avg) ? a : b
    );
  }, [teacherData]);

  // ================= CLASS TOPPERS (🔥 ADDED) =================
  const classToppers = useMemo(() => {
    const map: any = {};

    filtered.forEach((d) => {
      const cls = d.class_id.class.name;
      const student = d.student.student_name;

      const percent =
        (toNum(d.score.obt_marks) / toNum(d.score.max_marks)) * 100;

      if (!map[cls]) map[cls] = {};
      if (!map[cls][student]) {
        map[cls][student] = { total: 0, count: 0 };
      }

      map[cls][student].total += percent;
      map[cls][student].count++;
    });

    const result: any = {};

    Object.keys(map).forEach((cls) => {
      const arr = Object.keys(map[cls]).map((name) => ({
        name,
        avg: (map[cls][name].total / map[cls][name].count).toFixed(2),
      }));

      result[cls] = arr
        .sort((a, b) => Number(b.avg) - Number(a.avg))
        .slice(0, 3);
    });

    return result;
  }, [filtered]);

  // ================= TOOLTIP =================
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const d = payload[0].payload;

      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded shadow text-sm">
          <p className="font-semibold">{d.subject}</p>
          <p>Avg: {d.avg}%</p>
          <p>👨‍🏫 {d.teachers.join(", ")}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">

      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        📊 Performance Dashboard
      </h1>

      {/* FILTER */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <select value={selectedClass} onChange={(e)=>setSelectedClass(e.target.value)}>
          <option>All</option>
          {Array.from(new Set(validTests.map(d=>d.class_id.class.name))).map(c=>(
            <option key={c}>{c}</option>
          ))}
        </select>

        <select value={selectedTest} onChange={(e)=>setSelectedTest(e.target.value)}>
          <option>All</option>
          {Array.from(new Set(validTests.map(d=>d.test_name))).map(t=>(
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Avg %" value={`${stats.avg}%`} />
        <Card title="Pass %" value={`${stats.pass}%`} />
        <Card title="Fail %" value={`${stats.fail}%`} />
      </div>

      {/* TOP TEACHER */}
      {topTeacher && (
        <div className="mt-4 p-4 bg-green-200 dark:bg-green-800 rounded">
          🏆 <b>Top Teacher:</b> {topTeacher.teacher} ({topTeacher.avg}%)
        </div>
      )}

      {/* TOPPERS */}
      <div className="mt-6">
        <h2 className="font-bold text-lg">🏆 Class Toppers</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {Object.keys(classToppers).map((cls) => (
            <div key={cls} className="p-3 bg-white dark:bg-gray-800 rounded shadow">
              <h3 className="font-semibold">{cls}</h3>

              {classToppers[cls].map((s:any,i:number)=>(
                <p key={s.name}>
                  {i+1}. 🧑‍🎓 {s.name} ({s.avg}%)
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* SUBJECT + TREND */}
      {selectedClass !== "All" && (
        <div className="mt-6 grid gap-6">

          <ChartCard title="Subject Performance">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectData}>
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avg" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Teacher Trend">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={teacherData}>
                <XAxis dataKey="teacher" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avg" stroke="#22C55E" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>
      )}

    </div>
  );
}

// ================= COMPONENTS =================
function Card({ title, value }: any) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <p>{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}

function ChartCard({ title, children }: any) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h3 className="mb-2 font-semibold">{title}</h3>
      {children}
    </div>
  );
}
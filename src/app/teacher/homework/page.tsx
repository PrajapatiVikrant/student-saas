"use client"
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, BookOpen, Send, Filter, User, Loader2 } from 'lucide-react';
import { StatCard } from '../components/homework/StatCard';
import { Select } from '../components/homework/Select';
import { HomeworkCard } from '../components/homework/HomeworkCard';
import axios from 'axios';
import CircularIndeterminate from "@/app/components/ui/CircularIndeterminate";
import { toast } from 'react-toastify';




interface Homework {
    id: number;
    class_id: string;
    batch_id: string;
    subject: string;
    work: string;
    status: 'assigned' | 'pending';
}



const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'pending', label: 'Pending' },
];

export default function App() {

    const [teacherProfile, setTeacherProfile] = useState<any>(null);
    // Form state
    const [classOptions, setClassOptions] = useState<{ value: string; label: string }[]>([]);
    const [batchOptions, setBatchOptions] = useState<{ value: string; label: string }[]>([]);
    const [subjectOptions, setSubjectOptions] = useState<{ value: string; label: string }[]>([]);
    const [filterClassOptions, setFilterClassOptions] = useState<{ value: string; label: string }[]>([]);
    const [filterBatchOptions, setFilterBatchOptions] = useState<{ value: string; label: string }[]>([]);
    const [filterSubjectOptions, setFilterSubjectOptions] = useState<{ value: string; label: string }[]>([]);
    const [formClass, setFormClass] = useState('');
    const [formBatch, setFormBatch] = useState('');
    const [formSubject, setFormSubject] = useState('');
    const [formHomework, setFormHomework] = useState('');

    // Filter state
    const [filterClass, setFilterClass] = useState('all');
    const [filterBatch, setFilterBatch] = useState('all');
    const [filterSubject, setFilterSubject] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    
    // Homework list
    const [homeworkList, setHomeworkList] = useState<Homework[]>([]);
    
    //loading
    const [loading, setLoading] = useState(false)
    const [processing, setProcessing] = useState(false)

    const token = localStorage.getItem("codeflam01_token");

    useEffect(() => {
        fetchTeacherProfile();
    }, [])





    useEffect(() => {
        fetchSubjectsForClass('form');
        fetchBatchesForClass('form');
    }, [formClass])

    useEffect(() => {
        fetchSubjectsForClass('filter');
        fetchBatchesForClass('filter');
    }, [filterClass])






    const fetchSubjectsForClass = (type: string) => {
        const selectedClass = type === 'form' ? formClass : filterClass;

        const subjectsList = teacherProfile?.classes?.filter((c: any) => {
            return c.class_id._id === selectedClass;
        });

        if (type === 'form') {
            setSubjectOptions(subjectsList?.map((c: any) => ({
                value: c._id,
                label: c.subject,
            })) || []);
        } else {
            setFilterSubjectOptions(subjectsList?.map((c: any) => ({
                value: c._id,
                label: c.subject,
            })) || []);
        }
    };



    const fetchBatchesForClass = async (type: string) => {

        try {
            const selectedClass = type === 'form' ? formClass : filterClass;

            const res = await axios.get(
                `https://codeflame-edu-backend.xyz/api/v1/teacher/classes/${selectedClass}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const batches = res.data.class.batches.map((batch: any) => ({
                value: batch._id,
                label: batch.batch_name,
            }));

            if (type === 'form') {
                setBatchOptions(batches);
            } else {
                setFilterBatchOptions(batches);
            }

        } catch (error) {
            console.error("Error fetching batches for class:", error);
        }
    };


    const fetchTeacherProfile = async () => {
        setLoading(true)
        try {
            // 1) Fetch Profile
            const res = await axios.get(
                "https://codeflame-edu-backend.xyz/api/v1/homework/profile",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            // 🔥 Unique class_id + only required fields
            const uniqueClasses: { value: string; label: string }[] = [
                ...new Map(
                    res.data.classes.map((c) => [
                        c.class_id._id,
                        {
                            value: c.class_id._id,
                            label: c.class_name,
                        },
                    ])
                ).values(),
            ];

            const teacherClassesData: any[] = [];


            res.data.classes.map((elem: any) => {
                elem.class_id.class.batches.map((batch: any) => {
                    const data = {
                        id: teacherClassesData.length + 1,
                        class_id: elem.class_id._id,
                        class: elem.class_name,
                        batch_id: batch._id,
                        batch: batch.batch_name,
                        subject_id: elem._id,
                        subject: elem.subject,
                        homework: 'Pending',
                        status: 'pending',
                    }
                    teacherClassesData.push(data);
                })
            })

            // 1) Fetch Profile
            const reshomwork = await axios.get(
                "https://codeflame-edu-backend.xyz/api/v1/homework",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );


            console.log(reshomwork)
            const homeworkData = teacherClassesData.map((homework: any) => {
                const matchedClass = reshomwork.data.homework.find((h: any) => h.class._id === homework.class_id && h.batch === homework.batch_id && h.subject === homework.subject_id);
                console.log("matchedClass", matchedClass);
                if (matchedClass) {
                    return {
                        id: homework.id,
                        class_id: homework.class_id,
                        class: homework.class,
                        batch_id: homework.batch_id,
                        batch: homework.batch,
                        subject_id: homework.subject_id,
                        subject: homework.subject,
                        homework: matchedClass ? matchedClass.work : 'No Homework Assigned',
                        status: 'assigned',
                    }
                }
                return homework;

            })
            console.log("homework data", homeworkData)
            setHomeworkList(homeworkData)
            setTeacherProfile(res.data);
            setClassOptions(uniqueClasses);
            setFilterClassOptions(uniqueClasses);

        } catch (error) {
            console.error("Error fetching teacher profile:", error);
        } finally {
            setLoading(false)
        }
    }








    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formClass || !formBatch || !formSubject || !formHomework) {
            return;
        }
        setProcessing(true);
        try {
            const newHomework: Homework = {
                class_id: classOptions.find((c) => c.value === formClass)?.value || '',
                batch_id: batchOptions.find((b) => b.value === formBatch)?.value || '',
                subject: subjectOptions.find((s) => s.value === formSubject)?.value || '',
                work: formHomework,
                status: 'assigned',
            };

            // 1) Fetch Profile
            const reshomwork = await axios.post(
                "https://codeflame-edu-backend.xyz/api/v1/homework",
                newHomework,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success("Homework assigned successfully")

            fetchTeacherProfile();
            setFormClass('');
            setFormBatch('');
            setFormSubject('');
            setFormHomework('');
        } catch (error) {
            console.log("Assigning homework error", error)
        } finally {
            setProcessing(false);
        }

    };

    // Calculate stats
    const assignedCount = homeworkList.filter((h) => h.status === 'assigned').length;
    const pendingCount = homeworkList.filter((h) => h.status === 'pending').length;
    const totalCount = homeworkList.length;

    const filteredHomework = homeworkList.filter((homework: any) => {
        const matchClass =
            filterClass === 'all' || homework.class_id === filterClass;

        const matchBatch =
            filterBatch === 'all' || homework.batch_id === filterBatch;

        const matchSubject =
            filterSubject === 'all' || homework.subject_id === filterSubject;

        const matchStatus =
            filterStatus === 'all' || homework.status === filterStatus;

        return matchClass && matchBatch && matchSubject && matchStatus;
    });

    if (loading) {
        return (
            <div className="h-screen flex dark:bg-slate-900 dark:text-white flex-col items-center justify-center">
                <CircularIndeterminate size={60} />
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Homework Dashboard</h1>
                        <p className="text-gray-600 mt-2">Manage and track student assignments</p>
                    </div>

                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                    <StatCard
                        icon={CheckCircle2}
                        count={assignedCount}
                        label="Assigned Homework"
                        theme="green"
                    />
                    <StatCard icon={Clock} count={pendingCount} label="Pending Homework" theme="red" />
                    <StatCard icon={BookOpen} count={totalCount} label="Total Homework" theme="blue" />
                </div>

                {/* Assignment Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-6"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Assign New Homework</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                            <Select
                                label="Class"
                                value={formClass}
                                onChange={setFormClass}
                                options={classOptions}
                                placeholder="Select Class"
                            />
                            <Select
                                label="Batch"
                                value={formBatch}
                                onChange={setFormBatch}
                                options={batchOptions}
                                placeholder="Select Batch"
                            />
                            <Select
                                label="Subject"
                                value={formSubject}
                                onChange={setFormSubject}
                                options={subjectOptions}
                                placeholder="Select Subject"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-700">Homework Description</label>
                            <textarea
                                value={formHomework}
                                onChange={(e) => setFormHomework(e.target.value)}
                                placeholder="Enter homework details..."
                                rows={3}
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!formClass || !formBatch || !formSubject || !formHomework || processing}
                        >
                            {processing ? (
                                <div className="flex items-center gap-2.5">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Assigning...</span>
                                </div>
                            ) : (
                                <div className='flex items-center gap-2.5'>
                                    <Send className="w-5 h-5" />
                                    Assign Homework
                                </div>
                            )}
                        </button>
                    </form>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-6"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Filter className="w-5 h-5 text-gray-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Select
                            label="Class"
                            value={filterClass}
                            onChange={setFilterClass}
                            options={[{ value: 'all', label: 'All Classes' }, ...filterClassOptions]}
                        />
                        <Select
                            label="Batch"
                            value={filterBatch}
                            onChange={setFilterBatch}
                            options={[{ value: 'all', label: 'All Batches' }, ...filterBatchOptions]}
                        />
                        <Select
                            label="Subject"
                            value={filterSubject}
                            onChange={setFilterSubject}
                            options={[{ value: 'all', label: 'All Subjects' }, ...filterSubjectOptions]}
                        />
                        <Select
                            label="Status"
                            value={filterStatus}
                            onChange={setFilterStatus}
                            options={statusOptions}
                        />
                    </div>
                </motion.div>

                {/* Homework List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-5">Today's Homework</h2>
                    {filteredHomework.length > 0 ? (
                        <div className="space-y-4">
                            {filteredHomework.map((homework, index) => (
                                <HomeworkCard
                                    key={homework.id}
                                    className={homework.class}
                                    batch={homework.batch}
                                    subject={homework.subject}
                                    homework={homework.homework}
                                    status={homework.status}
                                    delay={index * 0.05}
                                />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100"
                        >
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No homework found</h3>
                            <p className="text-gray-500">
                                Try adjusting your filters or assign new homework to get started.
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

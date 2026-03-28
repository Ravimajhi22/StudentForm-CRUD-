import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Clock, MapPin, Award, BookOpen, ChevronRight, AlertCircle, Edit, FileText, X } from 'lucide-react';
import type { Exam, Course } from '../types';

const Exams: React.FC = () => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingExam, setEditingExam] = useState<Exam | null>(null);
    const [formData, setFormData] = useState({
        exam_name: '',
        course_id: '',
        exam_date: '',
        start_time: '',
        end_time: '',
        room_number: '',
        total_marks: '100',
        description: ''
    });

    useEffect(() => {
        fetchExams();
        fetchCourses();
    }, []);

    const fetchExams = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/exams');
            const data = await res.json();
            setExams(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/academic/all');
            const data = await res.json();
            setCourses(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenModal = (exam: Exam | null = null) => {
        if (exam) {
            setEditingExam(exam);
            setFormData({
                exam_name: exam.exam_name,
                course_id: String(exam.course_id),
                exam_date: exam.exam_date.split('T')[0],
                start_time: exam.start_time,
                end_time: exam.end_time,
                room_number: exam.room_number || '',
                total_marks: String(exam.total_marks),
                description: exam.description || ''
            });
        } else {
            setEditingExam(null);
            setFormData({
                exam_name: '',
                course_id: '',
                exam_date: '',
                start_time: '',
                end_time: '',
                room_number: '',
                total_marks: '100',
                description: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingExam 
            ? `http://localhost:5000/api/exams/${editingExam.id}` 
            : 'http://localhost:5000/api/exams';
        const method = editingExam ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    course_id: parseInt(formData.course_id),
                    total_marks: parseInt(formData.total_marks)
                })
            });
            if (res.ok) {
                fetchExams();
                setShowModal(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this exam schedule?')) return;
        try {
            await fetch(`http://localhost:5000/api/exams/${id}`, { method: 'DELETE' });
            fetchExams();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Institutional Header */}
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-navy-50 dark:bg-navy-900/30 rounded-xl text-navy-600 dark:text-navy-400">
                        <Award size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Academic Assessment</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Examination Schedules & Evaluation Protocols</p>
                    </div>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-navy-950 text-white rounded-lg font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-navy-950/20 active:scale-95 transition-all outline-none border border-navy-800"
                >
                    <Plus size={16} />
                    Schedule Examination
                </button>
            </div>

            {/* Exam Registry Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {exams.map(exam => (
                    <div key={exam.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row group transition-all hover:shadow-md">
                        {/* Event Date Sidebar */}
                        <div className="md:w-32 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
                            <span className="text-3xl font-black text-navy-950 dark:text-white">{new Date(exam.exam_date).getDate()}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{new Date(exam.exam_date).toLocaleString('default', { month: 'short' })}</span>
                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 w-full flex flex-col items-center gap-1">
                                <Clock size={12} className="text-slate-400" />
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{exam.start_time.slice(0, 5)}</span>
                            </div>
                        </div>

                        {/* Exam Content Primary */}
                        <div className="flex-1 p-6 relative">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenModal(exam)} className="p-2 text-navy-600 hover:bg-navy-50 rounded-lg transition-colors border border-navy-100">
                                    <Edit size={14} />
                                </button>
                                <button onClick={() => handleDelete(exam.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100">
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-navy-50 text-navy-600 rounded-md mb-3 border border-navy-100">
                                    <Award size={10} />
                                    <span className="text-[9px] font-black uppercase tracking-[0.1em]">{exam.total_marks} Marks Assess</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">{exam.exam_name}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <BookOpen size={12} className="text-slate-300" /> {exam.course_name}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-slate-50 dark:border-slate-800 pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-slate-400">
                                        <MapPin size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Assigned Venue</p>
                                        <p className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase">{exam.room_number || 'TBD'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-slate-400">
                                        <Clock size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Session Window</p>
                                        <p className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase">{exam.start_time.slice(0, 5)} - {exam.end_time.slice(0, 5)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {exams.length === 0 && (
                    <div className="col-span-full py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                        <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-300 mb-6">
                            <FileText size={64} />
                        </div>
                        <div className="max-w-xs space-y-2">
                            <h3 className="font-black text-slate-900 dark:text-white tracking-[0.2em] uppercase text-sm">Registry Empty</h3>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-tighter">No examination schedules have been established for the current academic session.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Assessment Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-xl p-10 shadow-2xl border border-slate-200 dark:border-slate-800 transform animate-in zoom-in-95 duration-300">
                         <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-navy-50 rounded-lg text-navy-600">
                                    <Calendar size={24} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                                    {editingExam ? 'Modify Assessment' : 'New Examination'}
                                </h2>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Assessment Nomenclature</label>
                                    <input 
                                        required
                                        type="text"
                                        className="input-formal w-full px-5 py-4 rounded-lg font-bold text-slate-800 dark:text-white text-[13px]"
                                        placeholder="e.g., Mathematics II End-Semester"
                                        value={formData.exam_name}
                                        onChange={(e) => setFormData({...formData, exam_name: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Academic Department</label>
                                    <select 
                                        required
                                        className="input-formal w-full px-5 py-4 rounded-lg font-bold text-slate-800 dark:text-white text-[13px] appearance-none"
                                        value={formData.course_id}
                                        onChange={(e) => setFormData({...formData, course_id: e.target.value})}
                                    >
                                        <option value="">Select Department...</option>
                                        {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Scheduled Date</label>
                                    <input 
                                        required
                                        type="date"
                                        className="input-formal w-full px-5 py-4 rounded-lg font-bold text-slate-800 dark:text-white text-[13px]"
                                        value={formData.exam_date}
                                        onChange={(e) => setFormData({...formData, exam_date: e.target.value})}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Commencement</label>
                                        <input 
                                            required
                                            type="time"
                                            className="input-formal w-full px-5 py-4 rounded-lg font-bold text-slate-800 dark:text-white text-[13px]"
                                            value={formData.start_time}
                                            onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Conclusion</label>
                                        <input 
                                            required
                                            type="time"
                                            className="input-formal w-full px-5 py-4 rounded-lg font-bold text-slate-800 dark:text-white text-[13px]"
                                            value={formData.end_time}
                                            onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Assigned Venue</label>
                                    <input 
                                        type="text"
                                        className="input-formal w-full px-5 py-4 rounded-lg font-bold text-slate-800 dark:text-white text-[13px]"
                                        placeholder="Room 102 / Hall B"
                                        value={formData.room_number}
                                        onChange={(e) => setFormData({...formData, room_number: e.target.value})}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Assessment Value</label>
                                    <input 
                                        type="number"
                                        className="input-formal w-full px-5 py-4 rounded-lg font-bold text-slate-800 dark:text-white text-[13px]"
                                        value={formData.total_marks}
                                        onChange={(e) => setFormData({...formData, total_marks: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)} 
                                    className="flex-1 py-4 font-black text-[11px] uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-100 transition-colors"
                                >
                                    Abort
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-[2] py-4 bg-navy-950 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-lg shadow-lg shadow-navy-950/25 transition-all active:scale-[0.98] border border-navy-800"
                                >
                                    {editingExam ? 'Confirm Updates' : 'Establish Schedule'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Exams;

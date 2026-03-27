import React, { useState, useEffect } from 'react';
import { Plus, Trash2, BookOpen, Upload, FileText, ChevronRight, GraduationCap, Building2, CheckCircle, AlertCircle } from 'lucide-react';

interface Branch {
    id: number;
    name: string;
}

interface Course {
    id: number;
    branch_id: number;
    name: string;
    syllabus_pdf: string | null;
    branch_name?: string;
}

const AcademicManagement: React.FC = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
    const [showBranchModal, setShowBranchModal] = useState(false);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [newBranchName, setNewBranchName] = useState('');
    const [newCourse, setNewCourse] = useState({
        name: '',
        branch_id: 0,
        syllabus: null as File | null
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const bRes = await fetch('http://localhost:5000/api/academic/branches');
            const bData = await bRes.json();
            setBranches(bData);

            const cRes = await fetch('http://localhost:5000/api/academic/all');
            const cData = await cRes.json();
            setCourses(cData);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddBranch = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/academic/branches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newBranchName })
            });
            if (res.ok) {
                fetchData();
                setShowBranchModal(false);
                setNewBranchName('');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newCourse.name);
        formData.append('branch_id', String(newCourse.branch_id));
        if (newCourse.syllabus) {
            formData.append('syllabus', newCourse.syllabus);
        }

        try {
            const res = await fetch('http://localhost:5000/api/academic', {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                fetchData();
                setShowCourseModal(false);
                setNewCourse({ name: '', branch_id: 0, syllabus: null });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteBranch = async (id: number) => {
        if (!confirm('Deleting a branch will delete all its courses. Continue?')) return;
        try {
            await fetch(`http://localhost:5000/api/academic/branches/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteCourse = async (id: number) => {
        if (!confirm('Are you sure you want to delete this course?')) return;
        try {
            await fetch(`http://localhost:5000/api/academic/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredCourses = selectedBranch 
        ? courses.filter(c => c.branch_id === selectedBranch)
        : courses;

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Academic Hierarchy</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Manage College Branches, Courses & Syllabuses</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowBranchModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <Building2 size={18} />
                        New Branch
                    </button>
                    <button 
                        onClick={() => {
                            setNewCourse({...newCourse, branch_id: selectedBranch || 0});
                            setShowCourseModal(true);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all"
                    >
                        <Plus size={20} />
                        Add Course
                    </button>
                </div>
            </div>

            <div className="flex gap-8">
                {/* Branches Sidebar */}
                <div className="w-64 flex-shrink-0 space-y-2">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-4">Branches</h3>
                    <button 
                        onClick={() => setSelectedBranch(null)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all font-bold text-sm ${!selectedBranch ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        All Branches
                    </button>
                    {branches.map(branch => (
                        <div key={branch.id} className="group relative">
                            <button 
                                onClick={() => setSelectedBranch(branch.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all font-bold text-sm ${selectedBranch === branch.id ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            >
                                <span className="truncate pr-4">{branch.name}</span>
                                <ChevronRight size={14} className={selectedBranch === branch.id ? 'opacity-100' : 'opacity-0'} />
                            </button>
                            <button 
                                onClick={() => handleDeleteBranch(branch.id)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-rose-500 opacity-0 group-hover:opacity-100 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Courses Grid */}
                <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map(course => (
                            <div key={course.id} className="glass-panel p-6 rounded-3xl border border-white/40 dark:border-slate-800 hover:shadow-xl transition-all group relative overflow-hidden flex flex-col justify-between">
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleDeleteCourse(course.id)} className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-2 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div>
                                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400 w-fit mb-4">
                                        <BookOpen size={24} />
                                    </div>
                                    <h3 className="font-black text-lg text-slate-900 dark:text-white leading-tight mb-1">{course.name}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{course.branch_name || branches.find(b => b.id === course.branch_id)?.name}</p>
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    {course.syllabus_pdf ? (
                                        <a 
                                            href={`http://localhost:5000/uploads/syllabuses/${course.syllabus_pdf}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2 text-[11px] font-black uppercase text-emerald-600 dark:text-emerald-400 hover:underline"
                                        >
                                            <FileText size={16} />
                                            View Syllabus
                                        </a>
                                    ) : (
                                        <span className="flex items-center gap-2 text-[11px] font-black uppercase text-amber-500">
                                            <AlertCircle size={16} />
                                            No Syllabus
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {filteredCourses.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-full text-slate-300">
                                <GraduationCap size={48} />
                            </div>
                            <p className="text-slate-400 font-bold">No courses found in this branch.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showBranchModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] p-8 shadow-2xl border border-white dark:border-slate-800">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Create New Department</h2>
                        <form onSubmit={handleAddBranch} className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Branch Name</label>
                                <input 
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none transition-all font-semibold"
                                    placeholder="e.g., School of Engineering"
                                    value={newBranchName}
                                    onChange={(e) => setNewBranchName(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowBranchModal(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors">Establish Branch</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCourseModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] p-8 shadow-2xl border border-white dark:border-slate-800">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Introduce New Course</h2>
                        <form onSubmit={handleAddCourse} className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Parent Branch</label>
                                <select 
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none transition-all font-semibold"
                                    value={newCourse.branch_id}
                                    onChange={(e) => setNewCourse({...newCourse, branch_id: parseInt(e.target.value)})}
                                >
                                    <option value="">Select Branch...</option>
                                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Course Name</label>
                                <input 
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none transition-all font-semibold"
                                    placeholder="e.g., Computer Science & Engineering"
                                    value={newCourse.name}
                                    onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Curriculum Syllabus (PDF)</label>
                                <div className="relative group/upload">
                                    <input 
                                        type="file"
                                        accept=".pdf"
                                        className="hidden"
                                        id="syllabus-upload"
                                        onChange={(e) => setNewCourse({...newCourse, syllabus: e.target.files?.[0] || null})}
                                    />
                                    <label 
                                        htmlFor="syllabus-upload"
                                        className="flex flex-col items-center justify-center w-full py-6 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all cursor-pointer"
                                    >
                                        <Upload className="text-slate-400 mb-2" size={20} />
                                        <span className="text-[11px] font-bold text-slate-500">{newCourse.syllabus ? newCourse.syllabus.name : 'Click to upload PDF syllabus'}</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowCourseModal(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors">Create Course</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AcademicManagement;

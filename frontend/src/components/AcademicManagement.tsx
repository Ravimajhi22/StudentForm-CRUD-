import React, { useState, useEffect, useRef } from 'react';
import { 
    Plus, 
    Trash2, 
    BookOpen, 
    Upload, 
    FileText, 
    ChevronRight, 
    GraduationCap, 
    Building2, 
    CheckCircle, 
    AlertCircle,
    Search,
    X,
    FolderKanban,
    Settings
} from 'lucide-react';
import { API_URL } from '../apiConfig';

import { standardBranches } from '../data/standardBranches';

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
    const [branchSearch, setBranchSearch] = useState('');
    const [newBranchName, setNewBranchName] = useState('');
    
    // Searchable Dropdown States
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [dropdownSearch, setDropdownSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [newCourse, setNewCourse] = useState({
        name: '',
        branch_id: 0,
        branch_name: '',
        syllabus: null as File | null
    });

    useEffect(() => {
        fetchData();
        
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchData = async () => {
        try {
            const bRes = await fetch(`${API_URL}/api/academic/branches`);

            const bData = await bRes.json();
            setBranches(bData);

            const cRes = await fetch(`${API_URL}/api/academic/all`);
            const cData = await cRes.json();
            setCourses(cData);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddBranch = async (name: string) => {
        try {
            const res = await fetch(`${API_URL}/api/academic/branches`, {

                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
            if (res.ok) {
                const addedBranch = await res.json();
                await fetchData();
                return addedBranch;
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let branchId = newCourse.branch_id;

        if (branchId === 0 && newCourse.branch_name) {
            const existing = branches.find(b => b.name === newCourse.branch_name);
            if (existing) {
                branchId = existing.id;
            } else {
                const newB = await handleAddBranch(newCourse.branch_name);
                if (newB) branchId = newB.id;
            }
        }

        if (!branchId) {
            alert("Please select or add a valid branch.");
            return;
        }

        const formData = new FormData();
        formData.append('name', newCourse.name);
        formData.append('branch_id', String(branchId));
        if (newCourse.syllabus) {
            formData.append('syllabus', newCourse.syllabus);
        }

        try {
            const res = await fetch(`${API_URL}/api/academic`, {

                method: 'POST',
                body: formData
            });
            if (res.ok) {
                fetchData();
                setShowCourseModal(false);
                setNewCourse({ name: '', branch_id: 0, branch_name: '', syllabus: null });
                setDropdownSearch('');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteBranch = async (id: number) => {
        if (!confirm('Deleting a branch will delete all its courses. Continue?')) return;
        try {
            await fetch(`${API_URL}/api/academic/branches/${id}`, { method: 'DELETE' });

            if (selectedBranch === id) setSelectedBranch(null);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteCourse = async (id: number) => {
        if (!confirm('Are you sure you want to delete this course?')) return;
        try {
            await fetch(`${API_URL}/api/academic/${id}`, { method: 'DELETE' });

            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredBranches = branches.filter(b => 
        b.name.toLowerCase().includes(branchSearch.toLowerCase())
    );

    const filteredCourses = selectedBranch 
        ? courses.filter(c => c.branch_id === selectedBranch)
        : courses;

    const dropdownOptions = [
        ...branches.map(b => ({ id: b.id, name: b.name, source: 'existing' })),
        ...standardBranches.filter(sb => !branches.find(b => b.name === sb.name))
            .map(sb => ({ id: 0, name: sb.name, source: 'standard' }))
    ].filter(opt => opt.name.toLowerCase().includes(dropdownSearch.toLowerCase()));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-navy-50 dark:bg-navy-900/30 rounded-xl text-navy-600 dark:text-navy-400">
                        <FolderKanban size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Program Governance</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Official Academic Infrastructure Management</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowBranchModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <Building2 size={16} />
                        Establish Branch
                    </button>
                    <button 
                        onClick={() => {
                            const currentBranch = branches.find(b => b.id === selectedBranch);
                            setNewCourse({
                                ...newCourse, 
                                branch_id: selectedBranch || 0,
                                branch_name: currentBranch ? currentBranch.name : ''
                            });
                            setDropdownSearch(currentBranch ? currentBranch.name : '');
                            setShowCourseModal(true);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-navy-950 text-white rounded-lg font-black text-[10px] uppercase tracking-widest shadow-lg shadow-navy-950/20 active:scale-95 transition-all outline-none border border-navy-800"
                    >
                        <Plus size={16} />
                        Define Course
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Branches Sidebar */}
                <div className="lg:w-80 flex-shrink-0 space-y-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text"
                            placeholder="Find Department..."
                            className="input-formal w-full pl-11 pr-4 py-3 rounded-lg text-[13px] font-bold"
                            value={branchSearch}
                            onChange={(e) => setBranchSearch(e.target.value)}
                        />
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Official Departments</h3>
                        </div>
                        <div className="p-2 space-y-1 max-h-[600px] overflow-y-auto custom-scrollbar">
                            <button 
                                onClick={() => setSelectedBranch(null)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all font-black text-[11px] uppercase tracking-wider ${!selectedBranch ? 'bg-navy-950 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                <span>Master Register</span>
                                {!selectedBranch && <CheckCircle size={14} />}
                            </button>
                            {filteredBranches.map(branch => (
                                <div key={branch.id} className="group relative">
                                    <button 
                                        onClick={() => setSelectedBranch(branch.id)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all font-black text-[11px] uppercase tracking-wider ${selectedBranch === branch.id ? 'bg-navy-950 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                    >
                                        <span className="truncate pr-8">{branch.name}</span>
                                        <ChevronRight size={14} className={selectedBranch === branch.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-all'} />
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
                        {filteredBranches.length === 0 && (
                            <div className="p-8 text-center text-[10px] font-bold text-slate-400 border-t border-slate-100 dark:border-slate-800">
                                No Department Records
                            </div>
                        )}
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredCourses.map(course => (
                            <div key={course.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => handleDeleteCourse(course.id)} className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors border border-rose-100">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-navy-600 dark:text-navy-400 border border-slate-100 dark:border-slate-700">
                                            <BookOpen size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">{course.name}</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{course.branch_name || branches.find(b => b.id === course.branch_id)?.name}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                         <div className="h-1 w-12 bg-navy-600 rounded-full"></div>
                                         <p className="text-[11px] font-bold text-slate-500 line-clamp-2 leading-relaxed">Official curriculum and academic syllabus for the {course.name} program.</p>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    {course.syllabus_pdf ? (
                                        <a 
                                            href={`${API_URL}/uploads/syllabuses/${course.syllabus_pdf}`}

                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-navy-50 hover:bg-navy-950 text-navy-700 hover:text-white border border-navy-100 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                                        >
                                            <FileText size={14} />
                                            Curriculum PDF
                                        </a>
                                    ) : (
                                        <span className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                            <AlertCircle size={14} />
                                            Syllabus Pending
                                        </span>
                                    )}
                                    <button className="p-2 text-slate-300 hover:text-navy-600 transition-colors">
                                        <Settings size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {filteredCourses.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-20 text-center space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                            <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-300">
                                <GraduationCap size={64} />
                            </div>
                            <div className="max-w-xs">
                                <h3 className="font-black text-slate-900 dark:text-white tracking-widest uppercase text-sm mb-2">No Program Records</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Initiate academic infrastructure by establishing departments and mapping courses.</p>
                            </div>
                            <button 
                                onClick={() => setShowCourseModal(true)}
                                className="px-8 py-3 bg-navy-950 text-white rounded-lg font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-navy-950/20 active:scale-95 transition-all outline-none border border-navy-800"
                            >
                                Begin Infrastructure Setup
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showBranchModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl p-10 shadow-2xl border border-slate-200 dark:border-slate-800 transform animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-navy-50 rounded-lg text-navy-600">
                                    <Building2 size={24} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Establish Branch</h2>
                            </div>
                            <button onClick={() => setShowBranchModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddBranch(newBranchName); setShowBranchModal(false); setNewBranchName(''); }} className="space-y-6">
                            <div>
                                <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Department Name</label>
                                <input 
                                    required
                                    type="text"
                                    autoFocus
                                    className="input-formal w-full px-5 py-4 rounded-lg font-bold text-slate-900 dark:text-white"
                                    placeholder="Enter formal department title..."
                                    value={newBranchName}
                                    onChange={(e) => setNewBranchName(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowBranchModal(false)} className="flex-1 py-4 font-black text-[11px] uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-100 transition-colors">Dismiss</button>
                                <button type="submit" className="flex-[1.5] py-4 bg-navy-950 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-lg shadow-lg shadow-navy-950/25 transition-all">Establish Branch</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCourseModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl p-10 shadow-2xl border border-slate-200 dark:border-slate-800 transform animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-navy-50 rounded-lg text-navy-600">
                                    <BookOpen size={24} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Define Program</h2>
                            </div>
                            <button onClick={() => setShowCourseModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAddCourse} className="space-y-6">
                            <div className="relative" ref={dropdownRef}>
                                <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Parent Department</label>
                                <div 
                                    className={`relative flex items-center justify-between px-5 py-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border transition-all cursor-text overflow-hidden ${isDropdownOpen ? 'border-navy-600 ring-4 ring-navy-600/10' : 'border-slate-200 dark:border-slate-700'}`}
                                    onClick={() => setIsDropdownOpen(true)}
                                >
                                    <div className="flex-1 text-[13px]">
                                        {isDropdownOpen ? (
                                            <input 
                                                autoFocus
                                                type="text"
                                                className="w-full bg-transparent outline-none font-bold text-slate-900 dark:text-white placeholder-slate-400"
                                                placeholder="Search departments..."
                                                value={dropdownSearch}
                                                onChange={(e) => setDropdownSearch(e.target.value)}
                                            />
                                        ) : (
                                            <span className={`font-bold ${newCourse.branch_name ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                                                {newCourse.branch_name || "Select Department..."}
                                            </span>
                                        )}
                                    </div>
                                    <ChevronRight size={18} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-90' : ''}`} />
                                </div>

                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xl z-[110] max-h-60 overflow-y-auto custom-scrollbar animate-in slide-in-from-top-2 duration-200">
                                        <div className="p-2 space-y-1">
                                            {dropdownOptions.map((opt, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                                                    onClick={() => {
                                                        setNewCourse({
                                                            ...newCourse, 
                                                            branch_id: opt.id,
                                                            branch_name: opt.name
                                                        });
                                                        setDropdownSearch(opt.name);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                >
                                                    <div className="text-left">
                                                        <p className="font-bold text-[13px] text-slate-900 dark:text-white leading-tight">{opt.name}</p>
                                                        {opt.source === 'standard' && <p className="text-[9px] font-black text-navy-600 uppercase tracking-tighter mt-0.5">Quick Add / Registrar Standard</p>}
                                                    </div>
                                                    {newCourse.branch_name === opt.name && <CheckCircle size={14} className="text-navy-600" />}
                                                </button>
                                            ))}
                                            {dropdownOptions.length === 0 && dropdownSearch && (
                                                <button
                                                    type="button"
                                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-navy-50/50 transition-colors group"
                                                    onClick={() => {
                                                        setNewCourse({
                                                            ...newCourse, 
                                                            branch_id: 0,
                                                            branch_name: dropdownSearch
                                                        });
                                                        setIsDropdownOpen(false);
                                                    }}
                                                >
                                                    <p className="text-[9px] font-black text-navy-600 uppercase tracking-widest mb-0.5">Define New Branch</p>
                                                    <p className="font-bold text-[13px] text-slate-900">"{dropdownSearch}"</p>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Formal Program Title</label>
                                <input 
                                    required
                                    type="text"
                                    className="input-formal w-full px-5 py-4 rounded-lg font-bold text-slate-900 dark:text-white text-[13px]"
                                    placeholder="e.g., Computer Science & Engineering"
                                    value={newCourse.name}
                                    onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Digital Syllabus Record (PDF)</label>
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
                                        className="flex flex-col items-center justify-center w-full py-8 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-navy-600 hover:bg-navy-50/20 transition-all cursor-pointer"
                                    >
                                        <div className="p-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm mb-3 text-slate-300">
                                            <Upload size={24} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{newCourse.syllabus ? newCourse.syllabus.name : 'Select Official PDF Document'}</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowCourseModal(false)} className="flex-1 py-4 font-black text-[11px] uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-100 transition-colors">Abort</button>
                                <button type="submit" className="flex-[1.5] py-4 bg-navy-950 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-lg shadow-lg shadow-navy-950/25 transition-all">Launch Program</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AcademicManagement;

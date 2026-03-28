import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, User, CheckCircle, ChevronDown, CreditCard, X, Receipt, Search } from 'lucide-react';

interface FeeStructure {
    id: number;
    title: string;
    amount: number;
    category: string;
    academic_year: string;
}

interface Student {
    id: number;
    name: string;
    branch_name: string;
    fee_status?: string;
    fee_balance?: number;
    email?: string;
}

interface FeeManagementProps {
    onUpdate?: () => void;
}

const FeeManagement: React.FC<FeeManagementProps> = ({ onUpdate }) => {
    const [fees, setFees] = useState<FeeStructure[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    
    // Assign Modal States
    const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
    const [studentSearch, setStudentSearch] = useState('');
    const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
    const studentDropdownRef = useRef<HTMLDivElement>(null);

    const [newFee, setNewFee] = useState({
        title: '',
        amount: '',
        category: 'Tuition',
        academic_year: '2023-24'
    });

    const [assignment, setAssignment] = useState({
        student_id: 0,
        fee_id: 0,
        custom_amount: ''
    });

    useEffect(() => {
        fetchFees();
        fetchStudents();
        
        const handleClickOutside = (event: MouseEvent) => {
            if (studentDropdownRef.current && !studentDropdownRef.current.contains(event.target as Node)) {
                setIsStudentDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchFees = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/fees/structure');
            const data = await res.json();
            setFees(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStudents = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/students');
            const data = await res.json();
            setStudents(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddFee = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/fees/structure', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFee)
            });
            if (res.ok) {
                fetchFees();
                setShowAddModal(false);
                setNewFee({ title: '', amount: '', category: 'Tuition', academic_year: '2023-24' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAssignFee = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudent || !assignment.custom_amount) return;

        try {
            const res = await fetch(`http://localhost:5000/api/fees/assign/${selectedStudent}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: assignment.custom_amount })
            });
            if (res.ok) {
                setShowAssignModal(false);
                setAssignment({ student_id: 0, fee_id: 0, custom_amount: '' });
                setSelectedStudent(null);
                setStudentSearch('');
                if (onUpdate) onUpdate();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteFee = async (id: number) => {
        if (!confirm('Are you sure you want to delete this fee structure?')) return;
        try {
            await fetch(`http://localhost:5000/api/fees/structure/${id}`, { method: 'DELETE' });
            fetchFees();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(studentSearch.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-navy-50 dark:bg-navy-900/30 rounded-xl text-navy-600 dark:text-navy-400">
                        <CreditCard size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Financial Oversight</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Official Fee Collection & Accounting Governance</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowAssignModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <User size={16} />
                        Manual Assignment
                    </button>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-navy-950 text-white rounded-lg font-black text-[10px] uppercase tracking-widest shadow-lg shadow-navy-950/20 active:scale-95 transition-all outline-none border border-navy-800"
                    >
                        <Plus size={16} />
                        Define Structure
                    </button>
                </div>
            </div>

            {/* Fee Ledger Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {fees.map((fee) => (
                    <div key={fee.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-md">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-navy-50 dark:bg-navy-900/40 rounded-lg text-navy-600 dark:text-navy-400">
                                        <Receipt size={18} />
                                    </div>
                                    <h3 className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1">{fee.title}</h3>
                                </div>
                                <button onClick={() => handleDeleteFee(fee.id)} className="p-1.5 text-rose-500 opacity-0 group-hover:opacity-100 hover:bg-rose-50 rounded-lg transition-all">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-black text-navy-950 dark:text-white">₹{parseFloat(fee.amount as any).toLocaleString()}</p>
                                <div className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>{fee.category}</span>
                                    <span>AY {fee.academic_year}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-end">
                            <button 
                                onClick={() => {
                                    setAssignment({ ...assignment, custom_amount: fee.amount.toString() });
                                    setShowAssignModal(true);
                                }}
                                className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-navy-950 text-navy-700 hover:text-white border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={14} />
                                Execute Assignment
                            </button>
                        </div>
                    </div>
                ))}
                
                {fees.length === 0 && (
                    <div className="col-span-full py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                        <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-300 mb-6">
                            <CreditCard size={64} />
                        </div>
                        <div className="max-w-xs space-y-2">
                            <h3 className="font-black text-slate-900 dark:text-white tracking-[0.2em] uppercase text-sm">Financial Void</h3>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-tighter">Official fee schedules must be defined before mapping students to collection cycles.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal: Define Structure */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl p-10 shadow-2xl border border-slate-200 dark:border-slate-800 transform animate-in zoom-in-95 duration-300">
                         <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-navy-50 rounded-lg text-navy-600">
                                    <Receipt size={24} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Fee Architecture</h2>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAddFee} className="space-y-6">
                            <div>
                                <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Formal Descriptor</label>
                                <input 
                                    required
                                    type="text"
                                    className="input-formal w-full px-5 py-4 rounded-lg font-bold text-slate-900 dark:text-white text-[13px]"
                                    placeholder="e.g., Annual Tuition Fee"
                                    value={newFee.title}
                                    onChange={(e) => setNewFee({...newFee, title: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Assessment (₹)</label>
                                    <input 
                                        required
                                        type="number"
                                        className="input-formal w-full px-5 py-4 rounded-lg font-bold text-slate-900 dark:text-white text-[13px]"
                                        placeholder="0.00"
                                        value={newFee.amount}
                                        onChange={(e) => setNewFee({...newFee, amount: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Academic Year</label>
                                    <input 
                                        required
                                        type="text"
                                        className="input-formal w-full px-5 py-4 rounded-lg font-bold text-slate-900 dark:text-white text-[13px]"
                                        value={newFee.academic_year}
                                        onChange={(e) => setNewFee({...newFee, academic_year: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Accounting Category</label>
                                <select 
                                    className="input-formal w-full px-5 py-4 rounded-lg font-bold text-slate-900 dark:text-white text-[13px] appearance-none"
                                    value={newFee.category}
                                    onChange={(e) => setNewFee({...newFee, category: e.target.value})}
                                >
                                    <option>Tuition</option>
                                    <option>Development</option>
                                    <option>Hostel</option>
                                    <option>Exam</option>
                                    <option>Library</option>
                                </select>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 font-black text-[11px] uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-100 transition-colors">Abort</button>
                                <button type="submit" className="flex-[1.5] py-4 bg-navy-950 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-lg shadow-lg shadow-navy-950/25 transition-all">Establish Structure</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Assign to Student */}
            {showAssignModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl p-10 shadow-2xl border border-slate-200 dark:border-slate-800 transform animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-navy-50 rounded-lg text-navy-600">
                                    <User size={24} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Inscribe Student</h2>
                            </div>
                            <button onClick={() => setShowAssignModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAssignFee} className="space-y-6">
                            <div className="relative" ref={studentDropdownRef}>
                                <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Find Individual Record</label>
                                <div 
                                    className={`relative flex items-center justify-between px-5 py-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border transition-all cursor-text overflow-hidden ${isStudentDropdownOpen ? 'border-navy-600 ring-4 ring-navy-600/10' : 'border-slate-200 dark:border-slate-700'}`}
                                    onClick={() => setIsStudentDropdownOpen(true)}
                                >
                                    <div className="flex-1">
                                        {isStudentDropdownOpen ? (
                                            <input 
                                                autoFocus
                                                type="text"
                                                className="w-full bg-transparent outline-none font-bold text-slate-900 dark:text-white placeholder-slate-400 text-[13px]"
                                                placeholder="Search student register..."
                                                value={studentSearch}
                                                onChange={(e) => setStudentSearch(e.target.value)}
                                            />
                                        ) : (
                                            <span className={`font-bold text-[13px] ${selectedStudent ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                                                {students.find(s => s.id === selectedStudent)?.name || "Name or ID Search..."}
                                            </span>
                                        )}
                                    </div>
                                    <Search size={16} className="text-slate-400" />
                                </div>

                                {isStudentDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xl z-[110] max-h-60 overflow-y-auto custom-scrollbar animate-in slide-in-from-top-2 duration-200">
                                        <div className="p-2 space-y-1">
                                            {filteredStudents.map(student => (
                                                <button
                                                    key={student.id}
                                                    type="button"
                                                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                                                    onClick={() => {
                                                        setSelectedStudent(student.id);
                                                        setStudentSearch(student.name);
                                                        setIsStudentDropdownOpen(false);
                                                    }}
                                                >
                                                    <div className="text-left">
                                                        <p className="font-bold text-[13px] text-slate-900 dark:text-white leading-tight uppercase tracking-tight">{student.name}</p>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">{student.branch_name || 'Department Unassigned'}</p>
                                                    </div>
                                                    {selectedStudent === student.id && <CheckCircle size={14} className="text-navy-600" />}
                                                </button>
                                            ))}
                                            {filteredStudents.length === 0 && (
                                                <div className="py-8 text-center px-4">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase">Record Not Identified</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Institutional Ledger Mapping</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {fees.map(f => (
                                        <button 
                                            key={f.id}
                                            type="button"
                                            onClick={() => setAssignment({...assignment, fee_id: f.id, custom_amount: f.amount.toString()})}
                                            className={`p-4 rounded-lg border transition-all text-left ${assignment.fee_id === f.id ? 'bg-navy-950 border-navy-950 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}
                                        >
                                            <p className={`text-[8px] font-black uppercase tracking-widest mb-1 ${assignment.fee_id === f.id ? 'text-navy-300' : 'text-slate-400'}`}>{f.category}</p>
                                            <p className="text-[11px] font-black uppercase truncate leading-tight mb-2">{f.title}</p>
                                            <p className={`font-black text-xs ${assignment.fee_id === f.id ? 'text-white' : 'text-navy-600'}`}>₹{parseFloat(f.amount as any).toLocaleString()}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Adjusted Assessment (INR)</label>
                                <input 
                                    required
                                    type="number"
                                    className="input-formal w-full px-5 py-4 rounded-lg font-black text-xl text-navy-950 dark:text-white"
                                    placeholder="0.00"
                                    value={assignment.custom_amount}
                                    onChange={(e) => setAssignment({...assignment, custom_amount: e.target.value})}
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowAssignModal(false)} className="flex-1 py-4 font-black text-[11px] uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-100 transition-colors">Abort</button>
                                <button type="submit" className="flex-[1.5] py-4 bg-navy-950 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-lg shadow-lg shadow-navy-950/25 transition-all">Confirm Inscription</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeeManagement;

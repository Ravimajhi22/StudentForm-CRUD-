import React, { useState, useEffect } from 'react';
import { 
    Calendar, CheckCircle2, XCircle, 
    Search, Save, UserCheck, UserX, Clock
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface AttendanceRecord {
    id: number;
    student_id: number;
    name: string;
    branch_name: string;
    course_name: string;
    status: 'Present' | 'Absent';
    marked_at: string;
}

interface Student {
    id: number;
    name: string;
    branch_name?: string;
    course_name?: string;
}

const AttendanceManagement: React.FC = () => {
    const [viewMode, setViewMode] = useState<'manual' | 'scan'>('manual');
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Filtered Students for Manual Marking
    const [markingList, setMarkingList] = useState<Record<number, 'Present' | 'Absent'>>({});

    useEffect(() => {
        fetchStudents();
        fetchAttendance();
    }, [selectedDate]);

    useEffect(() => {
        let scanner: Html5QrcodeScanner | null = null;
        if (viewMode === 'scan') {
            scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
            scanner.render(onScanSuccess, onScanFailure);
        }
        return () => {
            if (scanner) {
                scanner.clear().catch(error => console.error("Failed to clear scanner", error));
            }
        };
    }, [viewMode]);

    const onScanSuccess = async (decodedText: string) => {
        try {
            const data = JSON.parse(decodedText);
            if (data.id) {
                await markAttendance(data.id, 'Present');
                alert(`Attendance marked for ${data.name}`);
            }
        } catch (err) {
            console.error("Invalid QR Code", err);
        }
    };

    const onScanFailure = (error: any) => {
        // console.warn(`Code scan error = ${error}`);
    };

    const markAttendance = async (studentId: number, status: 'Present' | 'Absent') => {
        try {
            await fetch('http://localhost:5000/api/attendance/mark', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ student_id: studentId, status, date: selectedDate })
            });
            fetchAttendance();
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStudents = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/students');
            const data = await res.json();
            setStudents(data);
            
            // Initialize marking list based on attendance
            const initialMarking: Record<number, 'Present' | 'Absent'> = {};
            data.forEach((s: any) => {
                initialMarking[s.id] = 'Present'; // Default
            });
            setMarkingList(initialMarking);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAttendance = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/attendance/list?date=${selectedDate}`);
            const data = await res.json();
            
            // If attendance exists for the date, update marking list
            if (data.length > 0) {
                const updatedMarking: Record<number, 'Present' | 'Absent'> = { ...markingList };
                data.forEach((record: any) => {
                    updatedMarking[record.student_id] = record.status;
                });
                setMarkingList(updatedMarking);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkStatus = (studentId: number, status: 'Present' | 'Absent') => {
        setMarkingList(prev => ({ ...prev, [studentId]: status }));
    };

    const handleBulkSave = async () => {
        setIsSaving(true);
        const attendanceData = Object.entries(markingList).map(([studentId, status]) => ({
            student_id: parseInt(studentId),
            status,
            date: selectedDate
        }));

        try {
            const res = await fetch('http://localhost:5000/api/attendance/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attendanceData })
            });
            if (res.ok) {
                fetchAttendance();
                alert('Attendance saved successfully');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.course_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        total: students.length,
        present: Object.values(markingList).filter(v => v === 'Present').length,
        absent: Object.values(markingList).filter(v => v === 'Absent').length,
    };

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            {/* Header section with Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <div className="p-3 bg-blue-500 rounded-2xl text-white shadow-lg shadow-blue-500/30">
                            <UserCheck size={28} />
                        </div>
                        Attendance Control
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold mt-2 ml-1 flex items-center gap-2">
                        <Clock size={16} /> Mark daily registry · {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="text-center px-6 py-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                        <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Present</p>
                        <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{stats.present}</p>
                    </div>
                    <div className="text-center px-6 py-3 bg-rose-50 dark:bg-rose-500/10 rounded-2xl border border-rose-100 dark:border-rose-500/20">
                        <p className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-1">Absent</p>
                        <p className="text-2xl font-black text-rose-700 dark:text-rose-300">{stats.absent}</p>
                    </div>
                    <div className="text-center px-6 py-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                        <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Efficiency</p>
                        <p className="text-2xl font-black text-blue-700 dark:text-blue-300">{Math.round((stats.present / stats.total) * 100 || 0)}%</p>
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-900 px-6 py-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative">
                        <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-4 ring-blue-500/10 transition-all cursor-pointer"
                        />
                    </div>
                    <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                        <button 
                            onClick={() => setViewMode('manual')}
                            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${viewMode === 'manual' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}
                        >
                            Manual List
                        </button>
                        <button 
                            onClick={() => setViewMode('scan')}
                            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${viewMode === 'scan' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}
                        >
                            QR Scan Mode
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Student search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold w-full md:w-64 focus:ring-4 ring-blue-500/10"
                        />
                    </div>
                    <button 
                        onClick={handleBulkSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {isSaving ? 'Saving...' : 'Finalize Registry'}
                    </button>
                </div>
            </div>

            {viewMode === 'manual' ? (
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Student Information</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Academic Department</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Current Status</th>
                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {filteredStudents.map(student => (
                                <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                                                {student.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white leading-tight">{student.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">UID: #{student.id.toString().padStart(5, '0')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{student.course_name || 'General'}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter opacity-70">{student.branch_name || 'College Main'}</p>
                                    </td>
                                    <td className="px-8 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                            markingList[student.id] === 'Present' 
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                                            : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                                        }`}>
                                            {markingList[student.id] === 'Present' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                            {markingList[student.id]}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex justify-end p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit ml-auto">
                                            <button 
                                                onClick={() => handleMarkStatus(student.id, 'Present')}
                                                className={`p-2 rounded-lg transition-all ${markingList[student.id] === 'Present' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-emerald-600'}`}
                                            >
                                                <UserCheck size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleMarkStatus(student.id, 'Absent')}
                                                className={`p-2 rounded-lg transition-all ${markingList[student.id] === 'Absent' ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-sm' : 'text-slate-400 hover:text-rose-600'}`}
                                            >
                                                <UserX size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-12 text-center">
                    <div className="max-w-md mx-auto space-y-8">
                        <div id="reader" className="w-full rounded-3xl overflow-hidden border-4 border-dashed border-blue-500/30 bg-slate-50 dark:bg-slate-800/40"></div>
                        
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Institutional QR Scanner</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                Enable high-speed attendance by scanning student ID secondary QR codes. The system will automatically mark presence for the current institutional session.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceManagement;

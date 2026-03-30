import React, { useState, useEffect } from 'react';
import { 
    Calendar, CheckCircle2, XCircle, 
    Search, Save, UserCheck, UserX, Clock, QrCode, X,
    ShieldCheck,
    FileText
} from 'lucide-react';
import { API_URL } from '../apiConfig';

import { Html5QrcodeScanner } from 'html5-qrcode';
import { QRCodeSVG } from 'qrcode.react';

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
    const [selectedAttendee, setSelectedAttendee] = useState<Student | null>(null);

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
            await fetch(`${API_URL}/api/attendance/mark`, {

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
            const res = await fetch(`${API_URL}/api/students`);

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
            const res = await fetch(`${API_URL}/api/attendance/list?date=${selectedDate}`);

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
            const res = await fetch(`${API_URL}/api/attendance/bulk`, {

                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attendanceData })
            });
            if (res.ok) {
                fetchAttendance();
                alert('Attendance record committed successfully');
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
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Professional Stats Overview */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white dark:bg-slate-900 p-10 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-navy-50 dark:bg-navy-900/30 rounded-xl text-navy-600 dark:text-navy-400">
                        <ShieldCheck size={36} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Presence Control</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                           <Clock size={12} /> Official Daily Register · {new Date(selectedDate).toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="flex gap-6">
                    <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Authenticated</p>
                        <div className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-lg font-black text-xl border border-emerald-100">{stats.present}</div>
                    </div>
                    <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Defaulters</p>
                        <div className="px-5 py-2.5 bg-rose-50 text-rose-600 rounded-lg font-black text-xl border border-rose-100">{stats.absent}</div>
                    </div>
                    <div className="text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Yield %</p>
                        <div className="px-5 py-2.5 bg-navy-950 text-white rounded-lg font-black text-xl border border-navy-800">{Math.round((stats.present / stats.total) * 100 || 0)}%</div>
                    </div>
                </div>
            </div>

            {/* Sub-Header Operations */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1.5 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                    <button 
                        onClick={() => setViewMode('manual')}
                        className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'manual' ? 'bg-navy-950 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Register Ledger
                    </button>
                    <button 
                        onClick={() => setViewMode('scan')}
                        className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'scan' ? 'bg-navy-950 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        QR Gateway
                    </button>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="relative">
                        <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="pl-11 pr-5 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[12px] font-black uppercase tracking-widest focus:ring-4 ring-navy-600/10 transition-all cursor-pointer"
                        />
                    </div>
                    <div className="relative flex-1 lg:w-64">
                         <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                         <input 
                            type="text"
                            placeholder="NAME / ID SEARCH..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-formal w-full pl-11 pr-4 py-3.5 rounded-xl text-[12px] font-black"
                         />
                    </div>
                    <button 
                        onClick={handleBulkSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-8 py-3.5 bg-navy-950 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-navy-950/20 active:scale-95 disabled:opacity-50 transition-all border border-navy-800"
                    >
                        <Save size={16} />
                        {isSaving ? 'Processing...' : 'Commit Registry'}
                    </button>
                </div>
            </div>

            {viewMode === 'manual' ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Inscribed Individual</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Departmental Mapping</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status Index</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredStudents.map(student => (
                                <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded bg-navy-950 text-white flex items-center justify-center font-black text-xs">
                                                {student.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-black text-[13px] text-slate-900 dark:text-white uppercase tracking-tight">{student.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">UID: STU-{student.id.toString().padStart(4, '0')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-[12px] font-black text-slate-700 dark:text-slate-300 uppercase">{student.course_name || 'UNDEFINED'}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{student.branch_name || 'FACULTY GENERAL'}</p>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                                            {markingList[student.id] === 'Present' ? (
                                                <><CheckCircle2 size={12} className="text-emerald-500" /><span className="text-emerald-600">Authenticated</span></>
                                            ) : (
                                                <><XCircle size={12} className="text-rose-500" /><span className="text-rose-600">Absentia</span></>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end items-center gap-3">
                                            {markingList[student.id] === 'Present' && (
                                                <button 
                                                    onClick={() => setSelectedAttendee(student)}
                                                    className="p-2.5 bg-white dark:bg-slate-800 text-slate-500 hover:text-navy-600 border border-slate-200 dark:border-slate-700 rounded-lg transition-all shadow-sm"
                                                    title="Generate Receipt"
                                                >
                                                    <FileText size={18} />
                                                </button>
                                            )}
                                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                                <button 
                                                    onClick={() => handleMarkStatus(student.id, 'Present')}
                                                    className={`p-2 rounded-md transition-all ${markingList[student.id] === 'Present' ? 'bg-navy-950 text-white shadow-md' : 'text-slate-400 hover:text-emerald-600'}`}
                                                >
                                                    <UserCheck size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleMarkStatus(student.id, 'Absent')}
                                                    className={`p-2 rounded-md transition-all ${markingList[student.id] === 'Absent' ? 'bg-navy-950 text-white shadow-md' : 'text-slate-400 hover:text-rose-600'}`}
                                                >
                                                    <UserX size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-16 text-center">
                    <div className="max-w-md mx-auto space-y-10">
                        <div id="reader" className="w-full rounded-2xl overflow-hidden border-2 border-navy-950/20 bg-slate-50 dark:bg-slate-800/40"></div>
                        
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy-50 text-navy-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                <QrCode size={14} /> Official Scrutiny Active
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Institutional QR Gateway</h2>
                            <p className="text-slate-400 text-[11px] font-black uppercase leading-relaxed tracking-tighter">
                                DEPLOY HIGH-SPEED SCANNERS TO AUTHENTICATE INSCRIBED INDIVIDUALS VIA THE SECONDARY SECURITY PROTOCOL.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Attendance Receipt Modal */}
            {selectedAttendee && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-xl p-10 shadow-2xl border border-slate-200 dark:border-slate-800 text-center relative transform animate-in zoom-in-95 duration-300">
                        <button 
                            onClick={() => setSelectedAttendee(null)}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-8">
                            <div className="w-16 h-16 bg-navy-950 rounded text-white flex items-center justify-center mx-auto mb-5 shadow-xl shadow-navy-950/20">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedAttendee.name}</h3>
                            <p className="text-[10px] font-black text-navy-600 dark:text-navy-400 uppercase tracking-[0.2em] mt-2">Presence Documented</p>
                        </div>

                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 mb-8 inline-block">
                            <QRCodeSVG 
                                value={`Attendance Auth: ${selectedAttendee.name}\nTimestamp: ${selectedDate} ${new Date().toLocaleTimeString()}\nStatus: AUTHENTICATED`} 
                                size={180}
                                level="H"
                            />
                        </div>

                        <div className="space-y-3 mb-8">
                            <div className="flex justify-between items-center px-4 py-3 bg-white border border-slate-100 rounded-lg">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Marked On</span>
                                <span className="text-xs font-black text-slate-900">{selectedDate}</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-3 bg-white border border-slate-100 rounded-lg">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Auth Code</span>
                                <span className="text-xs font-black text-slate-900">#PRES-{Math.floor(1000 + Math.random() * 9000)}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => window.print()}
                            className="w-full py-4 bg-navy-950 text-white rounded-lg font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-navy-950/25 active:scale-95 transition-all"
                        >
                            Generate Hardcopy
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceManagement;

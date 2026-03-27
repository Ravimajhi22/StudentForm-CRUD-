import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Phone, Mail, GraduationCap } from 'lucide-react';
import type { Student } from '../types';

interface StudentQRCardProps {
    student: Student;
    onClose: () => void;
}

const StudentQRCard: React.FC<StudentQRCardProps> = ({ student, onClose }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl flex items-center justify-center z-[200] p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 dark:border-slate-800 relative group animate-in zoom-in-95 duration-500">
                {/* ID Card Background Design */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-indigo-700"></div>
                
                <div className="relative pt-12 px-8 pb-10 text-center">
                    {/* Header */}
                    <div className="mb-6 flex flex-col items-center">
                        <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-2xl relative mb-4">
                            {student.image ? (
                                <img src={student.image} className="w-full h-full object-cover rounded-2xl" alt={student.name} />
                            ) : (
                                <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-2xl uppercase">
                                    {student.name.charAt(0)}
                                </div>
                            )}
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl shadow-lg border-4 border-white">
                                <GraduationCap size={16} />
                            </div>
                        </div>
                        <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{student.name}</h2>
                        <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mt-1">{student.course_name || 'Enrolled Student'}</p>
                    </div>

                    {/* QR Code Section */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 mb-8 inline-block shadow-inner hover:scale-105 transition-transform duration-500">
                        <QRCodeSVG 
                            value={JSON.stringify({ id: student.id, name: student.name })} 
                            size={140}
                            level="H"
                            includeMargin={false}
                            className="rounded-lg"
                        />
                    </div>

                    {/* Details */}
                    <div className="space-y-3 text-left mb-8">
                        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                            <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg"><Mail size={14} /></div>
                            <span className="text-xs font-bold truncate">{student.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                            <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg"><Phone size={14} /></div>
                            <span className="text-xs font-bold">{student.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                            <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg"><GraduationCap size={14} /></div>
                            <span className="text-xs font-bold">{student.branch_name || 'Main Branch'}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={() => window.print()}
                            className="flex-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
                        >
                            Print Card
                        </button>
                        <button 
                            onClick={onClose}
                            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 hover:text-rose-500 transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>

                <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400"></div>
            </div>
        </div>
    );
};

export default StudentQRCard;

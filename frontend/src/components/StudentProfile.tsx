import React from 'react';
import { ArrowLeft, FileText, User, Calendar, Users, Globe, QrCode, ShieldCheck, CheckCircle, Clock } from 'lucide-react';
import type { Student } from '../types';

interface StudentProfileProps {
  student: Student;
  onClose: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student, onClose }) => {
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Institutional Top Bar */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-navy-950 transition-all border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Exit Record
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[9px] font-black uppercase tracking-[0.2em]">
           <CheckCircle size={12} /> Registry Active
        </div>
      </div>

      <div className="p-10 space-y-12">
        {/* Identity Section */}
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="relative">
            <div className="w-48 h-48 bg-slate-50 dark:bg-slate-800 border-4 border-white dark:border-slate-700 rounded-lg shadow-md overflow-hidden flex items-center justify-center">
              {student.image ? (
                <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-slate-200" />
              )}
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-navy-950 text-white rounded font-black text-[10px] uppercase tracking-widest shadow-lg border border-navy-800">
              ID STU-{1000 + student.id}
            </div>
          </div>

          <div className="flex-1 space-y-4">
             <div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-2">{student.name}</h1>
                <p className="text-[12px] font-black text-navy-600 dark:text-navy-400 uppercase tracking-[0.3em]">Institutional Personnel File</p>
             </div>
             
             <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  className="flex items-center gap-2 px-6 py-3 bg-navy-950 text-white rounded-lg font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-navy-950/20 active:scale-95 transition-all border border-navy-800"
                >
                  <QrCode size={16} />
                  Official ID Protocol
                </button>
                <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg">
                   <Clock size={16} className="text-slate-400" />
                   <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Enrolled since 2024</span>
                </div>
             </div>
          </div>
        </div>

        {/* Informational Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Column 1: Communications */}
           <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                 <ShieldCheck size={18} className="text-navy-600" />
                 <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Validated Contact</h3>
              </div>
              <div className="space-y-6 px-2">
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Official Email</p>
                    <p className="text-[13px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight underline decoration-navy-100">{student.email || 'PROTOCOL_MISSING'}</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Primary Contact</p>
                    <p className="text-[13px] font-black text-slate-700 dark:text-slate-300 tracking-widest">{student.country_code || '+91'} {student.phone || '00000 00000'}</p>
                 </div>
              </div>
           </div>

           {/* Column 2: Personal Registry */}
           <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                 <Calendar size={18} className="text-navy-600" />
                 <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Personnel Registry</h3>
              </div>
              <div className="grid grid-cols-2 gap-6 px-2">
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Gender</p>
                    <p className="text-[13px] font-black text-slate-700 dark:text-slate-300 uppercase">{student.gender || 'ND'}</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Registry Age</p>
                    <p className="text-[13px] font-black text-slate-700 dark:text-slate-300 uppercase">{student.age || '0'} YRS</p>
                 </div>
                 <div className="col-span-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Commencement Date</p>
                    <p className="text-[13px] font-black text-slate-700 dark:text-slate-300 uppercase">
                      {student.dob ? new Date(student.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'PROTOCOL_MISSING'}
                    </p>
                 </div>
              </div>
           </div>

           {/* Column 3: Corporate/Parental */}
           <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                 <Users size={18} className="text-navy-600" />
                 <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Guardian Mapping</h3>
              </div>
              <div className="space-y-6 px-2">
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Inscribed Father</p>
                    <p className="text-[13px] font-black text-slate-700 dark:text-slate-300 uppercase">{student.father_name || 'NOT_INSCRIBED'}</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Inscribed Mother</p>
                    <p className="text-[13px] font-black text-slate-700 dark:text-slate-300 uppercase">{student.mother_name || 'NOT_INSCRIBED'}</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Section: Secondary Identity */}
           <div className="p-8 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800">
               <div className="flex items-center gap-3 mb-8 border-b border-slate-200 dark:border-slate-700 pb-4">
                  <ShieldCheck size={18} className="text-navy-600" />
                  <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Institutional Credentials</h3>
               </div>
               <div className="grid grid-cols-1 gap-8">
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Blood Analysis</p>
                     <span className="px-3 py-1 bg-white border border-rose-100 text-rose-600 rounded text-[11px] font-black uppercase shadow-sm">
                        {student.blood_group || 'UNKNOWN'}
                     </span>
                  </div>
               </div>
           </div>

           {/* Section: Geolocation */}
           <div className="p-8 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-200 dark:border-slate-700 pb-4">
                 <Globe size={18} className="text-navy-600" />
                 <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Geographic Domicile</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="md:col-span-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Verified Address</p>
                    <p className="text-[13px] font-black text-slate-700 dark:text-slate-300 uppercase leading-relaxed">{student.address}</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Region/Jurisdiction</p>
                    <p className="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase">{student.district}, {student.state}</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Postal Auth</p>
                    <p className="text-[11px] font-black text-navy-600 border-b border-navy-100 pb-1 inline-block">{student.pincode}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Supporting Documents Section */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-6">
             <FileText size={18} className="text-navy-600" />
             <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Institutional Documentation</h3>
          </div>
          
          {student.certificate ? (
             <div className="p-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center">
                <div 
                  className="relative group cursor-pointer max-w-md w-full"
                  onClick={() => window.open(student.certificate, '_blank')}
                >
                   {!student.certificate.toLowerCase().endsWith('.pdf') ? (
                     <>
                        <img src={student.certificate} alt="Certificate Path" className="w-full h-auto rounded-lg border-8 border-white dark:border-slate-800 shadow-xl" />
                        <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm rounded-lg">
                           <span className="px-6 py-3 bg-white text-navy-950 font-black text-[10px] uppercase tracking-widest rounded shadow-2xl">Examine Full Document</span>
                        </div>
                     </>
                   ) : (
                     <div className="w-full py-20 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center gap-6">
                        <FileText size={64} className="text-slate-300" />
                        <span className="px-8 py-4 bg-navy-950 text-white font-black text-[11px] uppercase tracking-widest rounded shadow-xl">Open Secured PDF Repository</span>
                     </div>
                   )}
                </div>
             </div>
          ) : (
             <div className="p-16 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl text-center space-y-4">
                <FileText size={48} className="mx-auto text-slate-200" />
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">No additional bureaucratic documentation has been appended to this record.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;

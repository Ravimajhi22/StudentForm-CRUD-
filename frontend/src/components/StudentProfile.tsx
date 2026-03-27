import React from 'react';
import { ArrowLeft, FileText, User, Mail, Calendar, Users, Globe } from 'lucide-react';
import type { Student } from '../types';

interface StudentProfileProps {
  student: Student;
  onClose: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student, onClose }) => {
  return (
    <div className="glass-panel p-6 sm:p-10 rounded-3xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 shadow-[0_12px_40px_rgba(31,38,135,0.08)]">
      {/* Header bar */}
      <button 
        onClick={onClose}
        className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all group font-bold font-mono tracking-tight"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Photo Section */}
        <div className="flex-shrink-0 flex flex-col items-center gap-5">
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-[2rem] overflow-hidden shadow-2xl ring-4 ring-white/50 dark:ring-slate-700/50 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center transform hover:rotate-1 hover:scale-105 transition-all duration-500">
            {student.image ? (
              <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
            ) : (
              <User size={80} className="text-indigo-300 dark:text-slate-500" strokeWidth={1.5} />
            )}
          </div>
          <div className="px-5 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-bold tracking-[0.2em] shadow-sm border border-white/50 dark:border-slate-700/50">
            STU-{1000 + student.id}
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-grow space-y-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-3">
              {student.name}
            </h2>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-extrabold tracking-wide border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ACTIVE STUDENT
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Contact Information Card */}
            <div className="bg-white/40 dark:bg-[#1e293b]/40 rounded-[2rem] p-8 border border-white/60 dark:border-slate-700/50 hover:shadow-[0_20px_40px_rgba(99,102,241,0.1)] transition-all duration-500 hover:-translate-y-1.5 backdrop-blur-md group">
              <div className="flex items-center gap-3 text-indigo-900/40 dark:text-indigo-300/40 mb-6 border-b border-indigo-100/50 dark:border-slate-700/50 pb-4">
                <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                  <Mail size={20} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-900/60 dark:text-indigo-300/60">Contact Hub</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-indigo-900/40 dark:text-indigo-300/40 uppercase tracking-[0.2em] mb-1.5">Primary Email</p>
                  <p className="text-slate-900 dark:text-slate-100 font-extrabold text-[16px] tracking-tight">{student.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-indigo-900/40 dark:text-indigo-300/40 uppercase tracking-[0.2em] mb-1.5">Secure Phone</p>
                  <p className="text-slate-900 dark:text-slate-100 font-extrabold text-[16px] tracking-tight">{student.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Personal Profile Card */}
            <div className="bg-white/40 dark:bg-[#1e293b]/40 rounded-[2rem] p-8 border border-white/60 dark:border-slate-700/50 hover:shadow-[0_20px_40px_rgba(16,185,129,0.1)] transition-all duration-500 hover:-translate-y-1.5 backdrop-blur-md group">
              <div className="flex items-center gap-3 text-emerald-900/40 dark:text-emerald-300/40 mb-6 border-b border-emerald-100/50 dark:border-slate-700/50 pb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                  <Calendar size={20} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-900/60 dark:text-emerald-300/60">Profile Matrix</h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-black text-emerald-900/40 dark:text-emerald-300/40 uppercase tracking-[0.2em] mb-1.5">Gender</p>
                  <p className="text-slate-900 dark:text-slate-100 font-extrabold text-[16px]">{student.gender || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-900/40 dark:text-emerald-300/40 uppercase tracking-[0.2em] mb-1.5">Current Age</p>
                  <p className="text-slate-900 dark:text-slate-100 font-extrabold text-[16px]">{student.age ? `${student.age} YRS` : 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-black text-emerald-900/40 dark:text-emerald-300/40 uppercase tracking-[0.2em] mb-1.5">Origin Date</p>
                  <p className="text-slate-900 dark:text-slate-100 font-extrabold text-[16px]">
                    {student.dob ? new Date(student.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Family Details Card */}
            <div className="bg-white/40 dark:bg-slate-900/40 rounded-3xl p-6 border border-white/60 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 text-indigo-900/40 dark:text-indigo-300/40 mb-4 border-b border-indigo-100/50 dark:border-slate-700/50 pb-3">
                <Users size={20} className="text-amber-500 dark:text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-900/60 dark:text-indigo-300/60">Family Background</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-extrabold text-indigo-900/50 dark:text-indigo-300/50 uppercase tracking-[0.2em] mb-1">Father's Name</p>
                  <p className="text-slate-800 dark:text-slate-200 font-bold text-[15px]">{student.father_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-indigo-900/50 dark:text-indigo-300/50 uppercase tracking-[0.2em] mb-1">Mother's Name</p>
                  <p className="text-slate-800 dark:text-slate-200 font-bold text-[15px]">{student.mother_name || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Medical & Emergency Card */}
            <div className="bg-white/40 dark:bg-slate-900/40 rounded-3xl p-6 border border-white/60 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 text-indigo-900/40 dark:text-indigo-300/40 mb-4 border-b border-indigo-100/50 dark:border-slate-700/50 pb-3">
                <FileText size={20} className="text-rose-500 dark:text-rose-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-900/60 dark:text-indigo-300/60">Medical & Emergency</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-extrabold text-indigo-900/50 dark:text-indigo-300/50 uppercase tracking-[0.2em] mb-1">Blood Group</p>
                  <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-100 dark:border-rose-500/20">
                    {student.blood_group || 'Unknown'}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-indigo-900/50 dark:text-indigo-300/50 uppercase tracking-[0.2em] mb-1">Emergency Contact</p>
                  <p className="text-slate-800 dark:text-slate-200 font-bold text-[15px]">{student.emergency_contact || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-extrabold text-indigo-900/50 dark:text-indigo-300/50 uppercase tracking-[0.2em] mb-1">Medical Status</p>
                  <p className="text-slate-800 dark:text-slate-200 font-bold text-[15px] leading-snug">{student.medical_status || 'No specific health conditions reported.'}</p>
                </div>
              </div>
            </div>

            {/* Location & Address Card */}
            <div className="bg-white/40 dark:bg-[#1e293b]/40 rounded-[2rem] p-8 border border-white/60 dark:border-slate-700/50 hover:shadow-[0_20px_40px_rgba(139,92,246,0.1)] transition-all duration-500 hover:-translate-y-1.5 backdrop-blur-md group col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 text-violet-900/40 dark:text-violet-300/40 mb-6 border-b border-violet-100/50 dark:border-slate-700/50 pb-4">
                <div className="p-2 bg-violet-500/10 rounded-lg group-hover:bg-violet-500/20 transition-colors">
                  <Globe size={20} className="text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-violet-900/60 dark:text-violet-300/60">Global Residency</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <p className="text-[10px] font-black text-violet-900/40 dark:text-violet-300/40 uppercase tracking-[0.2em] mb-1.5">Living Space</p>
                  <p className="text-slate-900 dark:text-slate-100 font-extrabold leading-relaxed text-[16px] tracking-tight">{student.address}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-violet-900/40 dark:text-violet-300/40 uppercase tracking-[0.2em] mb-1.5">Jurisdiction</p>
                  <p className="text-slate-900 dark:text-slate-100 font-extrabold text-[16px]">{student.district}, {student.state}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-violet-900/40 dark:text-violet-300/40 uppercase tracking-[0.2em] mb-1.5">Country Code</p>
                  <p className="text-slate-900 dark:text-slate-100 font-extrabold text-[16px] flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs border border-indigo-500/20">{student.country || 'India'}</span>
                    <span className="font-mono text-slate-400">{student.pincode}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Section */}
          {student.certificate ? (
             <div className="bg-gradient-to-r from-indigo-50/60 to-violet-50/60 dark:from-indigo-900/10 dark:to-violet-900/10 rounded-3xl p-6 border border-indigo-100/60 dark:border-indigo-500/20 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-indigo-700 dark:text-indigo-400">
                  <FileText size={20} />
                  <h3 className="text-xs font-bold uppercase tracking-widest">Official Certificate</h3>
                </div>
              </div>
              {!student.certificate.toLowerCase().endsWith('.pdf') ? (
                <div 
                  className="rounded-2xl overflow-hidden border-[3px] border-white/80 dark:border-indigo-500/30 max-w-sm cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 group relative transform hover:-translate-y-1" 
                  onClick={() => window.open(student.certificate, '_blank')}
                  title="Click to view full size"
                >
                  <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/20 transition-colors z-10 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100">
                    <span className="bg-white/95 text-indigo-700 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all transform translate-y-2 group-hover:translate-y-0">
                      View Full Document
                    </span>
                  </div>
                  <img src={student.certificate} alt="Certificate Thumbnail" className="w-full h-auto object-cover" />
                </div>
              ) : (
                <a 
                  href={student.certificate} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-white/80 dark:bg-slate-800 border-2 border-indigo-100 dark:border-indigo-500/30 rounded-xl text-indigo-700 dark:text-indigo-300 font-bold hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm hover:shadow-md gap-2"
                >
                  <FileText size={18} />
                  View Uploaded Document
                </a>
              )}
            </div>
          ) : (
            <div className="bg-white/30 dark:bg-slate-900/30 rounded-3xl p-8 border-2 border-slate-200/50 border-dashed dark:border-slate-700/50 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-slate-50/60 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400/80 shadow-sm border border-white/60 dark:border-slate-700">
                <FileText size={26} strokeWidth={1.5} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm max-w-xs leading-relaxed">No documentation has been attached to this record.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;

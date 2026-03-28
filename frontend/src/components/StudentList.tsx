import React from 'react';
import { Edit2, Trash2, Users, Printer, FileText, Eye, DollarSign } from 'lucide-react';
import type { Student } from '../types';

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
  onView: (student: Student) => void;
  onManageFees: (student: Student) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onEdit, onDelete, onView, onManageFees }) => {
  if (students.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-16 text-center shadow-sm">
        <div className="flex justify-center mb-6">
          <div className="p-5 bg-navy-50 dark:bg-navy-900/20 rounded-full border border-navy-100 dark:border-navy-800 text-navy-400">
            <Users size={36} strokeWidth={1.5} />
          </div>
        </div>
        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2 tracking-tight">No Official Records Found</h3>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">The institutional database is currently empty. Please use the enrollment portal to onboard new students.</p>
      </div>
    );
  }

  const handlePrint = (student: Student) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Institutional Record - ${student.name}</title>
          <style>
            body { font-family: 'Inter', system-ui, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; background: #fff; margin: 0; }
            .print-container { max-width: 800px; margin: 0 auto; border: 2px solid #1e3a8a; padding: 40px; }
            .header { display: flex; align-items: center; gap: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 30px; margin-bottom: 30px; }
            .pic { width: 120px; height: 120px; border: 1px solid #1e3a8a; object-fit: cover; }
            .name-box h1 { margin: 0; color: #1e3a8a; font-size: 28px; text-transform: uppercase; }
            .uid { font-weight: 800; color: #64748b; font-family: monospace; border: 1px solid #cbd5e1; padding: 4px 8px; display: inline-block; margin-top: 10px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
            .label { font-size: 11px; font-weight: 900; color: #1e3a8a; text-transform: uppercase; margin-bottom: 5px; border-bottom: 1px solid #e2e8f0; }
            .value { font-size: 14px; font-weight: 600; margin-bottom: 20px; }
            .footer { margin-top: 60px; border-top: 2px solid #e2e8f0; padding-top: 10px; font-size: 10px; text-align: center; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="header">
              ${student.image ? `<img src="${student.image}" class="pic" />` : `<div style="width:120px;height:120px;border:1px solid #1e3a8a;display:flex;align-items:center;justify-content:center;font-size:48px;font-weight:900;color:#1e3a8a;">${student.name.charAt(0)}</div>`}
              <div class="name-box">
                <h1>${student.name}</h1>
                <div class="uid">RECORD ID: STU-100${student.id}</div>
              </div>
            </div>
            <div class="grid">
              <div>
                <div class="label">Personal Identification</div>
                <div class="value">${student.email}</div>
                <div class="value">${student.country_code || '+91'} ${student.phone}</div>
                <div class="label">Permanent Mailing Address</div>
                <div class="value">${student.address}</div>
              </div>
              <div>
                <div class="label">Academic Location</div>
                <div class="value">${student.district}, ${student.state}</div>
                <div class="label">Official Identity (Aadhaar)</div>
                <div class="value">${student.adhar_number || 'NOT PROVIDED'}</div>
              </div>
            </div>
            <div class="footer">INSTITUTIONAL ERP • OFFICIAL STUDENT TRANSCRIPT • GENERATED ON ${new Date().toLocaleDateString()}</div>
          </div>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <th className="py-4 px-6 text-[10px] font-black text-navy-950 dark:text-navy-400 border-r border-slate-100 dark:border-slate-800/40 uppercase tracking-[0.2em] w-16">Profile</th>
              <th className="py-4 px-6 text-[10px] font-black text-navy-950 dark:text-navy-400 border-r border-slate-100 dark:border-slate-800/40 uppercase tracking-[0.2em]">Full Identification</th>
              <th className="py-4 px-6 text-[10px] font-black text-navy-950 dark:text-navy-400 border-r border-slate-100 dark:border-slate-800/40 uppercase tracking-[0.2em]">Contact & Mailing</th>
              <th className="py-4 px-6 text-[10px] font-black text-navy-950 dark:text-navy-400 border-r border-slate-100 dark:border-slate-800/40 uppercase tracking-[0.2em] text-center">Residency</th>
              <th className="py-4 px-6 text-[10px] font-black text-navy-950 dark:text-navy-400 border-r border-slate-100 dark:border-slate-800/40 uppercase tracking-[0.2em] text-center">Govt. ID</th>
              <th className="py-4 px-6 text-[10px] font-black text-navy-950 dark:text-navy-400 border-r border-slate-100 dark:border-slate-800/40 uppercase tracking-[0.2em] text-center">Financial Status</th>
              <th className="py-4 px-6 text-[10px] font-black text-navy-950 dark:text-navy-400 uppercase tracking-[0.2em] text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-4 px-6 border-r border-slate-100 dark:border-slate-800/40">
                  {student.image ? (
                    <img src={student.image} alt={student.name} className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-navy-50 dark:bg-navy-900/30 flex items-center justify-center text-navy-700 dark:text-navy-400 font-black border border-navy-100 dark:border-navy-800">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </td>
                <td className="py-4 px-6 border-r border-slate-100 dark:border-slate-800/40">
                  <div className="flex flex-col">
                    <button onClick={() => onView(student)} className="text-sm font-black text-slate-900 dark:text-white hover:text-navy-600 transition-colors text-left uppercase tracking-tight">
                      {student.name}
                    </button>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 font-mono tracking-tighter">REF# STU-{1000 + student.id}</span>
                  </div>
                </td>
                <td className="py-4 px-6 border-r border-slate-100 dark:border-slate-800/40">
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 space-y-0.5">
                    <p className="flex items-center gap-1.5"><FileText size={10} className="text-slate-400" /> {student.email}</p>
                    <p className="max-w-[180px] truncate">{student.address}</p>
                  </div>
                </td>
                <td className="py-4 px-6 text-center border-r border-slate-100 dark:border-slate-800/40">
                  <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase">
                    {student.state}
                  </span>
                </td>
                <td className="py-4 px-6 text-center border-r border-slate-100 dark:border-slate-800/40">
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                    {student.adhar_number || '–––– –––– ––––'}
                  </span>
                </td>
                <td className="py-4 px-6 text-center border-r border-slate-100 dark:border-slate-800/40">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${(student as any).fee_status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'}`}>
                      {(student as any).fee_status || 'Pending'}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400">Balance: ₹{(student as any).fee_balance || 0}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-1">
                    <button title="Financial Ledger" onClick={() => onManageFees(student)} className="p-2 text-slate-400 hover:text-navy-600 hover:bg-navy-50 rounded-lg transition-all"><DollarSign size={14} strokeWidth={2.5} /></button>
                    <button title="Official Profile" onClick={() => onView(student)} className="p-2 text-slate-400 hover:text-navy-600 hover:bg-navy-50 rounded-lg transition-all"><Eye size={14} strokeWidth={2.5} /></button>
                    <button title="Print Voucher" onClick={() => handlePrint(student)} className="p-2 text-slate-400 hover:text-navy-600 hover:bg-navy-50 rounded-lg transition-all"><Printer size={14} strokeWidth={2.5} /></button>
                    <button title="Edit Record" onClick={() => onEdit(student)} className="p-2 text-slate-400 hover:text-navy-600 hover:bg-navy-50 rounded-lg transition-all"><Edit2 size={14} strokeWidth={2.5} /></button>
                    <button title="Delete Entry" onClick={() => onDelete(student.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={14} strokeWidth={2.5} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;

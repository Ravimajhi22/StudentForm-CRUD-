import React from 'react';
import { Edit2, Trash2, Users, Printer, FileText } from 'lucide-react';
import type { Student } from '../types';

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onEdit, onDelete }) => {
  if (students.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-2xl p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-colors duration-500">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-slate-50 rounded-full border border-slate-100 text-slate-400">
            <Users size={32} strokeWidth={1.5} />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No students found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">There are no student records right now. Click the "Register New Student" button to create an entry.</p>
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
          <title>Student Details - ${student.name}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; background: white; margin: 0; }
            .print-container { max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 16px; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }
            @media print {
              body { padding: 0; background: white; }
              .print-container { border: none; box-shadow: none; padding: 0; max-width: 100%; }
            }
            .header { display: flex; align-items: center; gap: 30px; border-bottom: 2px solid #f1f5f9; padding-bottom: 30px; margin-bottom: 30px; }
            .pic { width: 140px; height: 140px; border-radius: 70px; object-fit: cover; background: #f8fafc; border: 4px solid #fff; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); flex-shrink: 0; }
            .pic-fallback { width: 140px; height: 140px; border-radius: 70px; display:flex; align-items:center; justify-content:center; font-size:48px; font-weight:bold; color:#4f46e5; background: #e0e7ff; border: 4px solid #fff; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); flex-shrink: 0; }
            .name-box h1 { margin: 0 0 8px 0; color: #0f172a; font-size: 32px; letter-spacing: -0.5px; }
            .uid { display: inline-block; background: #f1f5f9; color: #475569; padding: 6px 12px; border-radius: 8px; font-size: 14px; font-weight: 600; font-family: monospace; letter-spacing: 1px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px; }
            .box { background: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; }
            .label { font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
            .value { font-size: 16px; font-weight: 500; color: #334155; margin: 0; }
            .cert-box { margin-top: 40px; }
            .cert-header { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 20px; color: #0f172a; font-size: 18px; font-weight: 700; }
            .cert-img { max-width: 100%; max-height: 800px; object-fit: contain; border: 2px solid #e2e8f0; border-radius: 12px; }
            .doc-notice { text-align: center; padding: 20px; background: #ecfdf5; border: 1px solid #a7f3d0; color: #059669; border-radius: 12px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="header">
              ${student.image ? `<img src="${student.image}" class="pic" />` : `<div class="pic-fallback">${student.name.charAt(0)}</div>`}
              <div class="name-box">
                <h1>${student.name}</h1>
                <div class="uid">UID: STU-100${student.id}</div>
              </div>
            </div>
            
            <div class="grid">
              <div class="box">
                <div class="label">Permanent Address</div>
                <p class="value">${student.address}</p>
              </div>
              <div class="box">
                <div class="label">Location Details</div>
                <p class="value">${student.district}, ${student.state}</p>
                <div class="label" style="margin-top: 20px;">PIN Code</div>
                <p class="value">${student.pincode}</p>
              </div>
            </div>

            ${student.certificate ? `
              <div class="cert-box">
                <div class="cert-header">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #4f46e5;"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                  <span>Official Certificate Included</span>
                </div>
                ${student.certificate.startsWith('data:image') 
                  ? `<div style="text-align:center;"><img src="${student.certificate}" class="cert-img" /></div>` 
                  : `<div class="doc-notice">✅ PDF Document Attached (Viewable digitally)</div>`
                }
              </div>
            ` : ''}
          </div>
          <script>
            setTimeout(() => {
              window.print();
            }, 800);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-colors duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50/50 dark:from-slate-800/80 to-transparent border-b border-blue-100/50 dark:border-slate-700/50">
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-16">Profile</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student Info</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Address Details</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Location</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Pincode</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/60 dark:divide-slate-700/50">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-700/40 hover:scale-[1.002] transition-all duration-300 ease-out group">
                <td className="py-4 px-6">
                  {student.image ? (
                    <img src={student.image} alt={student.name} className="w-11 h-11 rounded-full object-cover border-2 border-slate-200 shadow-sm" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-200 shadow-sm text-lg">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-blue-700 dark:text-slate-200 dark:group-hover:text-indigo-400 transition-colors">{student.name}</span>
                      {student.certificate && (
                        <span title="Certificate Uploaded"><FileText size={14} className="text-emerald-500 dark:text-emerald-400" /></span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold tracking-wider">UID: STU-100{student.id}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-slate-600 dark:text-slate-400 block max-w-[200px] truncate" title={student.address}>
                    {student.address}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide bg-gradient-to-b from-blue-50 to-blue-100/50 dark:from-slate-700 dark:to-slate-700/50 text-blue-700 dark:text-indigo-300 border border-blue-200/60 dark:border-slate-600/50 shadow-sm">
                      {student.state}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{student.district}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="inline-block text-sm font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-none px-2.5 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/50">
                    {student.pincode}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button
                      title="Print Details"
                      onClick={() => handlePrint(student)}
                      className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 hover:shadow-sm rounded-xl transition-all"
                    >
                      <Printer size={16} strokeWidth={2.5} />
                    </button>
                    <button
                      title="Edit Student"
                      onClick={() => onEdit(student)}
                      className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/20 hover:shadow-sm rounded-xl transition-all"
                    >
                      <Edit2 size={16} strokeWidth={2.5} />
                    </button>
                    <button
                      title="Delete Student"
                      onClick={() => onDelete(student.id)}
                      className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/20 hover:shadow-sm rounded-xl transition-all"
                    >
                      <Trash2 size={16} strokeWidth={2.5} />
                    </button>
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

import React, { useState } from 'react';
import { Edit2, Trash2, Users, Printer, FileText, Eye, DollarSign, Download, FileJson as FileExcel, FileText as FilePdf, ChevronDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useTranslation } from 'react-i18next';
import type { Student } from '../types';

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
  onView: (student: Student) => void;
  onManageFees: (student: Student) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onEdit, onDelete, onView, onManageFees }) => {
  const { t } = useTranslation();
  const [isExportOpen, setIsExportOpen] = useState(false);

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add Academic Institution Header
    doc.setFontSize(22);
    doc.setTextColor(49, 46, 129); // navy-900 (Indigo)
    doc.text('INSTITUTIONAL PERSONNEL REGISTRY', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 28, { align: 'center' });
    doc.text('OFFICIAL RECORD - CONFIDENTIAL', 105, 34, { align: 'center' });

    const tableData = students.map(s => [
      `STU-100${s.id}`,
      s.name.toUpperCase(),
      s.email || 'N/A',
      s.phone || 'N/A',
      `${s.district}, ${s.state}`,
      (s as any).fee_status || 'Pending',
      `INR ${(s as any).fee_balance || 0}`
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['REF ID', 'FULL NAME', 'EMAIL', 'CONTACT', 'LOCATION', 'FISCAL STATUS', 'BALANCE']],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [30, 27, 75], // navy-950 (Indigo)
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: { 
        fontSize: 7,
        textColor: [51, 65, 85], // slate-700
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252] // slate-50
      },
      margin: { top: 45 },
      styles: { overflow: 'linebreak', cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
        5: { halign: 'center' },
        6: { halign: 'right' }
      }
    });

    doc.save(`student_registry_${new Date().getTime()}.pdf`);
    setIsExportOpen(false);
  };

  const exportToExcel = () => {
    const worksheetData = students.map(s => ({
      'Record ID': `STU-100${s.id}`,
      'Full Name': s.name,
      'Email Address': s.email || 'N/A',
      'Phone Number': s.phone || 'N/A',
      'Mailing Address': s.address || 'N/A',
      'District': s.district || 'N/A',
      'State': s.state || 'N/A',
      'Pincode': s.pincode || 'N/A',
      'Fee Status': (s as any).fee_status || 'Pending',
      'Outstanding Balance': (s as any).fee_balance || 0
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    
    // Auto-size columns
    worksheet['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 40 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 20 }];

    XLSX.writeFile(workbook, `student_registry_${new Date().getTime()}.xlsx`);
    setIsExportOpen(false);
  };

  if (students.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-16 text-center shadow-sm">
        <div className="flex justify-center mb-6">
          <div className="p-5 bg-navy-50 dark:bg-navy-900/20 rounded-full border border-navy-100 dark:border-navy-800 text-navy-400">
            <Users size={36} strokeWidth={1.5} />
          </div>
        </div>
        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2 tracking-tight">{t('student_list.no_records')}</h3>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">{t('student_list.no_records_msg')}</p>
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
            .print-container { max-width: 800px; margin: 0 auto; border: 2px solid #4f46e5; padding: 40px; }
            .header { display: flex; align-items: center; gap: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 30px; margin-bottom: 30px; }
            .pic { width: 120px; height: 120px; border: 1px solid #4f46e5; object-fit: cover; }
            .name-box h1 { margin: 0; color: #4f46e5; font-size: 28px; text-transform: uppercase; }
            .uid { font-weight: 800; color: #64748b; font-family: monospace; border: 1px solid #cbd5e1; padding: 4px 8px; display: inline-block; margin-top: 10px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
            .label { font-size: 11px; font-weight: 900; color: #4f46e5; text-transform: uppercase; margin-bottom: 5px; border-bottom: 1px solid #e2e8f0; }
            .value { font-size: 14px; font-weight: 600; margin-bottom: 20px; }
            .footer { margin-top: 60px; border-top: 2px solid #e2e8f0; padding-top: 10px; font-size: 10px; text-align: center; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="header">
              ${student.image ? `<img src="${student.image}" class="pic" />` : `<div style="width:120px;height:120px;border:1px solid #4f46e5;display:flex;align-items:center;justify-content:center;font-size:48px;font-weight:900;color:#4f46e5;">${student.name.charAt(0)}</div>`}
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
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Table Actions / Export Header */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
            <Users size={16} className="text-navy-600" />
            {t('sidebar.students_registry')}
          </h3>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{t('sidebar.total_entries')}: {students.length}</p>
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsExportOpen(!isExportOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest hover:border-navy-500 transition-all shadow-sm group"
          >
            <Download size={12} className="group-hover:translate-y-0.5 transition-transform" />
            <span>{t('sidebar.export_registry')}</span>
            <ChevronDown size={10} className={`transition-transform duration-300 ${isExportOpen ? 'rotate-180' : ''}`} />
          </button>

          {isExportOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsExportOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-20 py-2 animate-in fade-in zoom-in-95 duration-200">
                <button 
                  onClick={exportToPDF}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-black text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-navy-600 uppercase tracking-widest transition-colors"
                >
                  <FilePdf size={14} className="text-rose-500" />
                  {t('sidebar.download_pdf')}
                </button>
                <button 
                  onClick={exportToExcel}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-black text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-600 uppercase tracking-widest transition-colors"
                >
                  <FileExcel size={14} className="text-emerald-500" />
                  {t('sidebar.download_excel')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <th className="py-4 px-6 text-[10px] font-black text-navy-950 dark:text-navy-400 border-r border-slate-100 dark:border-slate-800/40 uppercase tracking-[0.2em] w-16">{t('student_list.profile')}</th>
              <th className="py-4 px-6 text-[10px] font-black text-navy-950 dark:text-navy-400 border-r border-slate-100 dark:border-slate-800/40 uppercase tracking-[0.2em]">{t('student_list.full_identification')}</th>
              <th className="py-4 px-6 text-[10px] font-black text-navy-950 dark:text-navy-400 border-r border-slate-100 dark:border-slate-800/40 uppercase tracking-[0.2em]">{t('student_list.contact_mailing')}</th>
              <th className="py-4 px-6 text-[10px] font-black text-navy-950 dark:text-navy-400 border-r border-slate-100 dark:border-slate-800/40 uppercase tracking-[0.2em] text-center">{t('student_list.residency')}</th>
              <th className="py-4 px-6 text-[10px] font-black text-navy-950 dark:text-navy-400 border-r border-slate-100 dark:border-slate-800/40 uppercase tracking-[0.2em] text-center">{t('student_list.financial_status')}</th>
              <th className="py-4 px-6 text-[10px] font-black text-navy-950 dark:text-navy-400 uppercase tracking-[0.2em] text-right">{t('student_list.operations')}</th>
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
                  <div className="flex flex-col items-center gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${(student as any).fee_status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'}`}>
                      {(student as any).fee_status || 'Pending'}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400">{t('student_list.balance')}: ₹{(student as any).fee_balance || 0}</span>
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
    </div>
  );
};

export default StudentList;

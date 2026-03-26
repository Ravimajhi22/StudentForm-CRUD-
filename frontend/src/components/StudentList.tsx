import React from 'react';
import { Edit2, Trash2, Users } from 'lucide-react';
import type { Student } from '../types';

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onEdit, onDelete }) => {
  if (students.length === 0) {
    return (
      <div className="bg-white border border-slate-200/60 rounded-2xl p-16 text-center shadow-sm">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-slate-50 rounded-full border border-slate-100 text-slate-400">
            <Users size={32} strokeWidth={1.5} />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No students found</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">There are no student records right now. Click the "Register New Student" button to create an entry.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80">
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Info</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Address Details</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Location</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Pincode</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/60 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{student.name}</span>
                    <span className="text-xs text-slate-400 font-medium tracking-wider">UID: STU-100{student.id}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-slate-600 block max-w-[200px] truncate" title={student.address}>
                    {student.address}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide bg-blue-50 text-blue-700 border border-blue-200/50">
                      {student.state}
                    </span>
                    <span className="text-xs font-medium text-slate-500">{student.district}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="inline-block text-sm font-mono text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                    {student.pincode}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      title="Edit Student"
                      onClick={() => onEdit(student)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Edit2 size={16} strokeWidth={2} />
                    </button>
                    <button
                      title="Delete Student"
                      onClick={() => onDelete(student.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 size={16} strokeWidth={2} />
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

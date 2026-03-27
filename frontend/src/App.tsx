import { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, Users, GraduationCap, Search, PieChart, 
  UserPlus, Database, FileText, UserCheck 
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import StudentList from './components/StudentList';
import StudentModal from './components/StudentModal';
import StudentProfile from './components/StudentProfile';
import FeeManagement from './components/FeeManagement';
import StudentFeeModal from './components/StudentFeeModal';
import Sidebar from './components/Sidebar';
import AcademicManagement from './components/AcademicManagement';
import AttendanceManagement from './components/AttendanceManagement';
import type { Student } from './types';

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [isDark]);

  const [activeView, setActiveView] = useState<'dashboard' | 'students' | 'fees' | 'academic' | 'attendance'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [selectedStudentForFees, setSelectedStudentForFees] = useState<Student | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [attendanceSummary, setAttendanceSummary] = useState({ total: 0, present: 0 });

  useEffect(() => {
    fetchStudents();
    fetchAttendanceSummary();
  }, []);

  const fetchAttendanceSummary = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/attendance/summary");
      const data = await res.json();
      setAttendanceSummary(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/students");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Stats Calculation
  const stats = {
    total: students.length,
    male: students.filter(s => s.gender === 'Male').length,
    female: students.filter(s => s.gender === 'Female').length,
    other: students.filter(s => s.gender === 'Other').length,
  };

  // EXPORT EXCEL
  const exportToExcel = () => {
    const worksheetData = students.map((s) => ({
      ID: s.id,
      Name: s.name,
      Email: s.email || '-',
      'Country Code': s.country_code || '+91',
      Phone: s.phone || '-',
      Age: s.age || '-',
      DOB: s.dob ? new Date(s.dob).toLocaleDateString() : '-',
      Gender: s.gender || '-',
      "Father's Name": s.father_name || '-',
      "Mother's Name": s.mother_name || '-',
      "Blood Group": s.blood_group || '-',
      "Aadhaar Number": s.adhar_number || '-',
      Address: s.address,
      State: s.state,
      District: s.district,
      Country: s.country || 'India',
      Pincode: s.pincode,
      'Fee Balance': (s as any).fee_balance || 0,
      'Fee Status': (s as any).fee_status || 'Pending',
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "students_data.xlsx");
  };

  // EXPORT PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Student Registration Data", 14, 15);
    
    const tableColumn = ["ID", "Name", "Email", "Phone", "Age", "Gender", "Blood Group", "Aadhaar", "Location", "Fee Balance", "Status"];
    const tableRows = students.map(s => [
      s.id,
      s.name,
      s.email || '-',
      `${s.country_code || '+91'} ${s.phone || '-'}`,
      s.age || '-',
      s.gender || '-',
      s.blood_group || '-',
      s.adhar_number || '-',
      `${s.district}, ${s.state}`,
      `₹${(s as any).fee_balance || 0}`,
      (s as any).fee_status || 'Pending'
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("students_data.pdf");
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Permanently delete this student record?')) {
      try {
        await fetch(`http://localhost:5000/api/students/${id}`, {
          method: "DELETE",
        });
        setStudents(prev => prev.filter(s => s.id !== id));
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleSave = async (savedData: any) => {
    try {
      const formData = new FormData();
      Object.entries(savedData).forEach(([key, value]) => {
        if (key === 'id') return;
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== null && value !== '') {
          formData.append(key, String(value));
        }
      });

      if (savedData.id) {
        const res = await fetch(`http://localhost:5000/api/students/${savedData.id}`, {
          method: "PUT",
          body: formData,
        });
        const updatedStudent = await res.json();
        setStudents(prev => prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s)));
      } else {
        const res = await fetch("http://localhost:5000/api/students", {
          method: "POST",
          body: formData,
        });
        const newStudent = await res.json();
        setStudents(prev => [newStudent, ...prev]);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.district?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 selection:bg-blue-500/20 dark:selection:bg-blue-500/30 transition-colors duration-500">
      
      {/* Sidebar - Dashboard Navigation */}
      <Sidebar 
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        activeView={activeView}
        onViewChange={setActiveView}
        stats={stats}
      />

      {/* Main Content Area */}
      <div className="flex-1 ml-72 p-8 relative overflow-y-auto h-screen">
        
        <div className="max-w-6xl mx-auto space-y-8 relative z-10">
          
          {/* Dashboard Header - Pill Shaped Compact Design */}
          <header className={`flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 px-6 py-2.5 rounded-full border border-[#e7f5ff] dark:border-slate-800 shadow-[0_4px_20px_rgba(203,213,225,0.15)] dark:shadow-none relative z-[40] transition-all duration-300`}>
            
            {/* Logo Section */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveView('dashboard')}>
              <div className="relative w-9 h-9 flex-shrink-0">
                <div className="absolute bottom-1 left-0 w-4.5 h-4.5 bg-slate-500 rounded-[2px] shadow-sm transform group-hover:-translate-y-0.5 transition-transform duration-300"></div>
                <div className="absolute top-1 right-0 w-4.5 h-4.5 bg-[#fbbf24] rounded-[2px] shadow-sm transform group-hover:translate-x-0.5 transition-transform duration-300"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-black tracking-tight leading-none">
                  <span className="text-slate-800 dark:text-white uppercase">Maipro</span>
                  <span className="text-sky-500 uppercase">soft</span>
                </h1>
                <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1.5 ml-0.5">
                  EXPERTISE YOU CAN TRUST
                </p>
              </div>
            </div>

            {/* Middle Section: Search & Actions */}
            <div className="flex flex-1 items-center justify-end gap-3 w-full md:w-auto">
              {/* Compact Search Bar */}
              <div className="relative w-full max-w-[280px]">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Fast search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-[#e0f2fe] dark:border-slate-700 bg-white dark:bg-slate-800 text-[13px] font-medium focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all outline-none"
                />
              </div>

              {/* Export Dropdown */}
              <div className="relative" ref={exportRef}>
                <button
                  onClick={() => setIsExportOpen(!isExportOpen)}
                  className={`flex items-center justify-between gap-2 px-5 py-2 rounded-2xl border font-bold text-[13px] transition-all duration-300 shadow-sm min-w-[120px] ${
                    isExportOpen 
                      ? 'bg-[#fffbeb] border-sky-400 text-sky-600 dark:bg-sky-500/10 dark:border-sky-400 dark:text-sky-400' 
                      : 'bg-white border-slate-200 text-slate-500 hover:border-sky-300 dark:bg-slate-800/40 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span>Export</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isExportOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`absolute top-full right-0 mt-3 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden z-[100] shadow-xl transition-all duration-300 origin-top-right ${isExportOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 invisible'}`}>
                  <button onClick={() => { exportToExcel(); setIsExportOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800">
                    <div className="p-1.5 bg-green-500/10 text-green-600 rounded-lg"><Database size={16} /></div>
                    Excel Report
                  </button>
                  <button onClick={() => { exportToPDF(); setIsExportOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="p-1.5 bg-rose-500/10 text-rose-600 rounded-lg"><FileText size={16} /></div>
                    PDF Catalog
                  </button>
                </div>
              </div>

              {/* Add Student Button */}
              <button
                onClick={() => { setEditingStudent(null); setIsModalOpen(true); }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-[13px] font-black shadow-lg shadow-sky-500/25 active:scale-[0.98] transition-all group"
              >
                <div className="p-1 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                  <UserPlus size={16} strokeWidth={2.5} />
                </div>
                <span>ADD STUDENT</span>
              </button>
            </div>
          </header>

          <main>
            {activeView === 'dashboard' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Dashboard Widgets */}
                <div className="col-span-1 lg:col-span-2 glass-panel p-8 rounded-[2.5rem] flex flex-col min-h-[400px]">
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                    <GraduationCap className="text-blue-500" /> Recent Activity
                  </h3>
                  <div className="flex-1 space-y-4">
                    {students.slice(0, 5).map(s => (
                      <div key={s.id} className="flex items-center justify-between p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 transition-all hover:scale-[1.01]">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1">
                            {s.image ? <img src={s.image} className="w-full h-full object-cover rounded-xl" /> : <div className="w-full h-full bg-blue-500/10 flex items-center justify-center text-blue-500"><Users size={20} /></div>}
                          </div>
                          <div>
                            <p className="font-black text-slate-800 dark:text-white">{s.name}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase">{s.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-blue-500 uppercase tracking-wider">{s.gender}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{s.course_name || s.district}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="glass-panel p-6 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-xl shadow-indigo-500/20">
                     <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">Live Presence Today</p>
                     <div className="flex justify-between items-end">
                        <h4 className="text-4xl font-black">
                          {Math.round((attendanceSummary.present / attendanceSummary.total) * 100 || 0)}%
                        </h4>
                        <UserCheck size={28} className="mb-1" />
                     </div>
                     <div className="mt-4 h-2 w-full bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full" style={{ width: `${(attendanceSummary.present / attendanceSummary.total) * 100 || 0}%` }}></div>
                     </div>
                     <button onClick={() => setActiveView('attendance')} className="mt-6 w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all font-bold text-xs uppercase tracking-widest">
                        Open Attendance
                     </button>
                  </div>

                  <div className="glass-panel p-6 rounded-[2.5rem]">
                    <h4 className="text-lg font-black mb-4 flex items-center gap-2">
                       <PieChart size={20} className="text-cyan-500" /> Academic Metrics
                    </h4>
                    <div className="space-y-3">
                       {Array.from(new Set(students.map(s => s.course_name).filter(Boolean))).slice(0, 4).map(course => {
                          const count = students.filter(s => s.course_name === course).length;
                          const percent = (count / students.length) * 100;
                          return (
                             <div key={course as string} className="space-y-1">
                                <div className="flex justify-between text-[11px] font-black uppercase">
                                   <span className="text-slate-500">{course}</span>
                                   <span className="text-blue-500">{count} Std.</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                   <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percent}%` }}></div>
                                </div>
                             </div>
                          );
                       })}
                    </div>
                  </div>
                </div>
              </div>
            ) : viewingStudent ? (
              <StudentProfile student={viewingStudent} onClose={() => setViewingStudent(null)} />
            ) : activeView === 'fees' ? (
              <FeeManagement />
            ) : activeView === 'academic' ? (
              <AcademicManagement />
            ) : activeView === 'attendance' ? (
              <AttendanceManagement />
            ) : (
              <StudentList
                students={filteredStudents}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={setViewingStudent as any}
                onManageFees={setSelectedStudentForFees}
              />
            )}
          </main>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <StudentModal
          student={editingStudent}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
      {selectedStudentForFees && (
        <StudentFeeModal 
          student={selectedStudentForFees} 
          onClose={() => setSelectedStudentForFees(null)}
          onUpdate={fetchStudents}
        />
      )}
    </div>
  );
}

export default App;
import { useState, useEffect, useRef } from 'react';
import { PlusCircle, Moon, Sun, ChevronDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import StudentList from './components/StudentList';
import StudentModal from './components/StudentModal';
import StudentProfile from './components/StudentProfile';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
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

  useEffect(() => {
    fetch("http://localhost:5000/api/students")
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  // EXPORT EXCEL
  const exportToExcel = () => {
    const worksheetData = students.map((s) => ({
      ID: s.id,
      Name: s.name,
      Email: s.email || '-',
      Phone: s.phone || '-',
      Age: s.age || '-',
      DOB: s.dob ? new Date(s.dob).toLocaleDateString() : '-',
      Gender: s.gender || '-',
      "Father's Name": s.father_name || '-',
      "Mother's Name": s.mother_name || '-',
      "Blood Group": s.blood_group || '-',
      "Medical Status": s.medical_status || '-',
      "Emergency Contact": s.emergency_contact || '-',
      Address: s.address,
      State: s.state,
      District: s.district,
      Country: s.country || 'India',
      Pincode: s.pincode,
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
    
    const tableColumn = ["ID", "Name", "Email", "Phone", "Age", "Gender", "Blood Group", "Emergency", "Location"];
    const tableRows = students.map(s => [
      s.id,
      s.name,
      s.email || '-',
      s.phone || '-',
      s.age || '-',
      s.gender || '-',
      s.blood_group || '-',
      s.emergency_contact || '-',
      `${s.district}, ${s.state}`
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("students_data.pdf");
  };

  // EDIT
  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  // DELETE 
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

  //  CLOSE MODAL
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  //  SAVE 
  const handleSave = async (savedData: any) => {
    try {
      const formData = new FormData();
      Object.entries(savedData).forEach(([key, value]) => {
        if (key === 'id') return; // ID is handled mostly via URL
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== null && value !== '') {
          formData.append(key, String(value));
        }
      });

      // UPDATE
      if (savedData.id) {
        const res = await fetch(
          `http://localhost:5000/api/students/${savedData.id}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        const updatedStudent = await res.json();

        setStudents(prev =>
          prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s))
        );
      } 
      //  CREATE
      else {
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

  return (
    <div className="min-h-screen bg-[#fdfdff] dark:bg-[#0a0c10] text-slate-800 dark:text-slate-200 p-4 sm:p-8 selection:bg-indigo-500/20 dark:selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:text-indigo-200 relative transition-colors duration-500 overflow-hidden">
      {/* Ambient Background Glows - Advanced Premium Aesthetic */}
      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-400/20 dark:from-indigo-600/20 dark:to-cyan-500/20 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen animate-pulse duration-[8s]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-violet-500/20 to-fuchsia-400/20 dark:from-violet-600/20 dark:to-fuchsia-500/20 blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-screen animate-pulse duration-[10s]" />
      <div className="absolute top-[30%] left-[15%] w-[40%] h-[40%] rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-6 relative z-10">

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center glass-panel p-6 rounded-[2rem] relative z-50 transition-all duration-500 hover:shadow-[0_12px_40px_rgba(31,38,135,0.1)]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-[0_4px_16px_rgba(99,102,241,0.3)] text-white">
              <PlusCircle size={28} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-300">
                Student Portal
              </h1>
              <p className="text-sm font-medium text-slate-400 dark:text-slate-400 mt-0.5 tracking-wide uppercase">
                Premium College Admission
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-3 rounded-2xl glass-button text-slate-500 dark:text-slate-300 group"
              title="Toggle Dark Mode"
            >
              {isDark ? <Sun size={20} className="group-hover:text-amber-400 transition-colors" /> : <Moon size={20} className="group-hover:text-indigo-500 transition-colors" />}
            </button>

            {/* Dropdown Container */}
            <div className="relative" ref={exportRef}>
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className={`flex items-center justify-between w-[150px] px-5 py-3 rounded-2xl text-sm font-bold glass-button ${isExportOpen ? 'border-indigo-400 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'text-slate-600 dark:text-slate-300'}`}
              >
                <span>Export Data</span>
                <ChevronDown size={18} className={`transition-transform duration-300 ${isExportOpen ? 'rotate-180 text-indigo-500' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              <div 
                className={`absolute top-full left-0 mt-3 w-[150px] glass-panel rounded-2xl overflow-hidden z-50 transition-all duration-300 origin-top ${isExportOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'}`}
              >
                <div className="p-1.5 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      exportToPDF();
                      setIsExportOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-500 hover:text-white transition-all duration-200"
                  >
                    PDF Document
                  </button>
                  <button
                    onClick={() => {
                      exportToExcel();
                      setIsExportOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-500 hover:text-white transition-all duration-200"
                  >
                    Excel Sheet
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingStudent(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 btn-premium rounded-2xl px-8 py-3.5 text-[15px] group"
            >
              <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-500" />
              <span className="hidden sm:inline tracking-tight font-black">REGISTER STUDENT</span>
              <span className="sm:hidden tracking-tight font-black">NEW</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {viewingStudent ? (
            <StudentProfile student={viewingStudent} onClose={() => {
              setViewingStudent(null);
              window.location.reload();
            }} />
          ) : (
            <StudentList
              students={students}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={setViewingStudent}
            />
          )}
        </main>

        {/* Modal */}
        {isModalOpen && (
          <StudentModal
            student={editingStudent}
            onClose={handleCloseModal}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}

export default App;
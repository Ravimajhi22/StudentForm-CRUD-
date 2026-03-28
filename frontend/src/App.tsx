import { useState, useEffect } from 'react';
import { 
  Search, UserPlus, UserCheck, ShieldCheck, TrendingUp, 
  Bell, Settings, User, PieChart, Sun, Moon, LogOut
} from 'lucide-react';
import StudentList from './components/StudentList';
import StudentModal from './components/StudentModal';
import StudentProfile from './components/StudentProfile';
import FeeManagement from './components/FeeManagement';
import StudentFeeModal from './components/StudentFeeModal';
import Sidebar from './components/Sidebar';
import AcademicManagement from './components/AcademicManagement';
import AttendanceManagement from './components/AttendanceManagement';
import Exams from './components/Exams';
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

  const [activeView, setActiveView] = useState<'dashboard' | 'students' | 'fees' | 'academic' | 'attendance' | 'exams'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [selectedStudentForFees, setSelectedStudentForFees] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceSummary, setAttendanceSummary] = useState({ total: 0, present: 0 });

  useEffect(() => {
    fetchStudents();
    fetchAttendanceSummary();

    // Dynamically inject Google Translate script to ensure DOM is ready
    if (!(window as any).googleTranslateElementInit) {
      (window as any).googleTranslateElementInit = () => {
        if ((window as any).google && (window as any).google.translate) {
          new (window as any).google.translate.TranslateElement(
            { pageLanguage: 'en', layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE },
            'google_translate_element'
          );
        }
      };
      const addScript = document.createElement('script');
      addScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      addScript.async = true;
      document.body.appendChild(addScript);
    }
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
    <div className="flex min-h-screen bg-white dark:bg-[#0c111d] text-slate-800 dark:text-slate-200 transition-colors duration-500 overflow-hidden font-sans">
      
      {/* Sidebar - Governance Navigation */}
      <Sidebar 
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-h-screen relative flex flex-col overflow-y-auto h-screen">
        
        {/* Institutional Banner / Header - Compacted */}
        <header className="institution-banner flex items-center justify-between sticky top-0 z-[50] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 py-2.5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
             <div className="w-9 h-9 bg-navy-500 rounded flex items-center justify-center text-white shadow-lg">
                <ShieldCheck size={20} />
             </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">
                {activeView === 'dashboard' ? 'Governance Dashboard' : 
                 activeView === 'students' ? 'Personnel Registry' :
                 activeView === 'fees' ? 'Fiscal Oversight' :
                 activeView === 'academic' ? 'Faculty Structure' :
                 activeView === 'attendance' ? 'Presence Registry' : 'Assessment Board'}
              </h2>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1.5 opacity-70">Authenticated Session: Admin_V4</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* 1. Search Bar - Compacted */}
            <div className="relative group w-64">
              <Search size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="SEARCH..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-formal w-full pl-9 pr-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 border-none outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-3 pr-6 border-r border-slate-200 dark:border-slate-800">
               {/* 2. Notifications */}
               <div className="relative group/notif">
                  <button className="p-2.5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:text-navy-950 dark:hover:text-white transition-all relative">
                     <Bell size={16} />
                     <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm animate-pulse"></span>
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden z-[100] shadow-2xl opacity-0 invisible group-hover/notif:opacity-100 group-hover/notif:visible transition-all duration-300 origin-top-right">
                     <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Live Alerts</span>
                        <span className="text-[9px] font-black text-navy-600 uppercase tracking-widest cursor-pointer hover:underline">Mark Read</span>
                     </div>
                     <div className="max-h-64 overflow-y-auto">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800/50 flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                           <div className="w-8 h-8 rounded bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0">
                              <UserCheck size={14} />
                           </div>
                           <div>
                              <p className="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase leading-none mb-1">Authenticated Entry</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">New student inscription recorded.</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* 3. Settings & Language Dropdown */}
               <div className="relative group/settings">
                  <button className="p-2.5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:text-navy-950 dark:hover:text-white transition-all" title="System Configuration">
                     <Settings size={16} />
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden z-[100] shadow-2xl opacity-0 pointer-events-none group-hover/settings:opacity-100 group-hover/settings:pointer-events-auto transition-all duration-300 origin-top-right">
                     <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-3 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Application Settings</span>
                     </div>
                     <div className="p-4 flex flex-col gap-4">
                        <div>
                           <p className="text-[10px] font-black text-navy-600 uppercase tracking-widest mb-2">Global Language</p>
                           <div className="h-9 flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 gt-custom-wrapper">
                              <div id="google_translate_element"></div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* 4. Dark Mode Toggle */}
               <button 
                  onClick={() => setIsDark(!isDark)}
                  className="p-2.5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:text-navy-950 dark:hover:text-white transition-all"
                  title={isDark ? "Enable Light Mode" : "Enable Dark Mode"}
               >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
               </button>

               {/* 5. Logout */}
               <button 
                  className="p-2.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-lg text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                  title="Terminate Session"
               >
                  <LogOut size={16} />
               </button>
            </div>

            <div className="flex items-center gap-4 group cursor-pointer">
               <div className="w-11 h-11 rounded-full border-2 border-navy-500 p-0.5 bg-white dark:bg-slate-800 relative group-hover:scale-105 transition-all">
                  <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center text-slate-400">
                     <User size={20} />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm" />
               </div>
            </div>

            <button
              onClick={() => { setEditingStudent(null); setIsModalOpen(true); }}
              className="ml-2 flex items-center gap-2 px-6 py-2.5 rounded-lg bg-navy-950 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-navy-950/20 active:scale-95 transition-all outline-none border border-navy-800 hover:bg-navy-900"
            >
              <UserPlus size={14} />
              <span>Enroll</span>
            </button>
          </div>
        </header>

        <div className="p-10 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">

          <main>
            {activeView === 'dashboard' ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in duration-700">
                 <div className="w-24 h-24 bg-navy-50 dark:bg-navy-500/10 rounded-3xl flex items-center justify-center text-navy-600 mb-8 border border-navy-100 dark:border-navy-500/20 shadow-xl shadow-navy-500/5">
                    <ShieldCheck size={48} />
                 </div>
                 <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">
                    Welcome, Administrator
                 </h3>
                 <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md font-medium leading-relaxed">
                    Institutional governance is currently at optimal levels. Select a module from the navigation to begin oversight operations.
                 </p>
                 <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
                    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-navy-500 transition-colors cursor-pointer group" onClick={() => setActiveView('students')}>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-navy-600">Personnel</p>
                       <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{students.length}</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-navy-500 transition-colors cursor-pointer group" onClick={() => setActiveView('attendance')}>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-navy-600">Attendance</p>
                       <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{Math.round((attendanceSummary.present / attendanceSummary.total) * 100 || 0)}%</p>
                    </div>
                 </div>
              </div>
            ) : viewingStudent ? (
              <StudentProfile student={viewingStudent} onClose={() => setViewingStudent(null)} />
            ) : activeView === 'fees' ? (
              <FeeManagement onUpdate={fetchStudents} />
            ) : activeView === 'academic' ? (
              <AcademicManagement />
            ) : activeView === 'attendance' ? (
              <AttendanceManagement />
            ) : activeView === 'exams' ? (
              <Exams />
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
    </div>

    {/* Official Modals */}
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
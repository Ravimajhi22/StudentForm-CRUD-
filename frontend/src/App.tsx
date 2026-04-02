import { useState, useEffect } from 'react';
import { 
  Search, UserPlus, UserCheck, 
  Bell, Settings, User, Sun, Moon, LogOut, BookOpen
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StudentList from './components/StudentList';
import StudentModal from './components/StudentModal';
import StudentProfile from './components/StudentProfile';
import FeeManagement from './components/FeeManagement';
import StudentFeeModal from './components/StudentFeeModal';
import Sidebar from './components/Sidebar';
import AcademicManagement from './components/AcademicManagement';
import AttendanceManagement from './components/AttendanceManagement';
import Exams from './components/Exams';
import ChatBot from './components/ChatBot';
import Login from './components/Login';
import type { Student } from './types';
import { API_URL } from './apiConfig';

function App() {
  const { t } = useTranslation();
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (newToken: string, newAdmin: any) => {
    setToken(newToken);
    setUser(newAdmin);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newAdmin));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

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
    if (user) {
      fetchStudents();
      fetchAttendanceSummary();
    }
  }, [user]);

  const fetchAttendanceSummary = async () => {
    try {
      const res = await fetch(`${API_URL}/api/attendance/summary`);
      const data = await res.json();
      setAttendanceSummary(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/students`);
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
        await fetch(`${API_URL}/api/students/${id}`, {
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
        const res = await fetch(`${API_URL}/api/students/${savedData.id}`, {
          method: "PUT",
          body: formData,
        });
        const updatedStudent = await res.json();
        setStudents(prev => prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s)));
      } else {
        const res = await fetch(`${API_URL}/api/students`, {
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

  if (!user) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-slate-200 transition-colors duration-500 overflow-hidden font-sans relative">
      {/* Animated Background Mesh & Floating Objects */}
      <div className="fixed inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-mesh scale-150" />
        <div className="absolute top-[10%] left-[15%] w-64 h-64 glass-blob animate-float" />
        <div className="absolute top-[60%] left-[70%] w-96 h-96 glass-blob animate-float-reverse shadow-indigo-500/10" />
        <div className="absolute top-[40%] left-[40%] w-48 h-48 glass-blob animate-float opacity-50" />
      </div>
      
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="flex-1 ml-64 min-h-screen relative flex flex-col overflow-y-auto h-screen">
        <header className="institution-banner flex items-center justify-between sticky top-0 z-[50] bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl px-8 py-2.5 border-b border-slate-200 dark:border-indigo-500/20">
          <div className="flex items-center gap-4">
             <div className="w-9 h-9 bg-navy-500 rounded flex items-center justify-center text-white shadow-lg">
                <BookOpen size={20} />
             </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">
                {activeView === 'dashboard' ? 'JANAGAMANA' : 
                 activeView === 'students' ? t('sidebar.personnel') :
                 activeView === 'fees' ? t('sidebar.fiscal') :
                 activeView === 'academic' ? t('sidebar.faculty') :
                 activeView === 'attendance' ? t('sidebar.presence') : 
                 activeView === 'exams' ? t('sidebar.assessment') : t('sidebar.feedback')}
              </h2>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1.5 opacity-70">college admission open now</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
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
               <div className="relative group/notif">
                  <button className="p-2.5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:text-navy-950 dark:hover:text-white transition-all relative">
                     <Bell size={16} />
                     <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm animate-pulse"></span>
                  </button>
               </div>
               <button onClick={() => setIsDark(!isDark)} className="p-2.5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:text-navy-950 dark:hover:text-white transition-all">
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
               </button>
               <button onClick={handleLogout} className="p-2.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-lg text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                  <LogOut size={16} />
               </button>
            </div>

            <button onClick={() => { setEditingStudent(null); setIsModalOpen(true); }} className="ml-2 flex items-center gap-2 px-6 py-2.5 rounded-lg bg-navy-950 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-navy-950/20 active:scale-95 transition-all outline-none border border-navy-800 hover:bg-navy-900">
              <UserPlus size={14} />
              <span>{t('sidebar.enroll')}</span>
            </button>
          </div>
        </header>

        <div className="p-10 flex-1 overflow-y-auto animate-fade-in-up">
          <div className="max-w-7xl mx-auto space-y-8">
            <main>
              {activeView === 'dashboard' ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in duration-700">
                   <div className="w-24 h-24 bg-navy-50 dark:bg-navy-500/10 rounded-3xl flex items-center justify-center text-navy-600 mb-8 border border-navy-100 dark:border-navy-500/20 shadow-xl shadow-navy-500/5">
                      <BookOpen size={48} />
                   </div>
                   <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">{t('dashboard.welcome_admin')}</h3>
                   <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md font-medium leading-relaxed">{t('dashboard.governance_msg')}</p>
                   <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
                      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-navy-500 transition-colors cursor-pointer group" onClick={() => setActiveView('students')}>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-navy-600">{t('dashboard.personnel_label')}</p>
                         <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{students.length}</p>
                      </div>
                      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-navy-500 transition-colors cursor-pointer group" onClick={() => setActiveView('attendance')}>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-navy-600">{t('dashboard.attendance_label')}</p>
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
                <StudentList students={filteredStudents} onEdit={handleEdit} onDelete={handleDelete} onView={setViewingStudent as any} onManageFees={setSelectedStudentForFees} />
              )}
            </main>
          </div>
        </div>
      </div>

      {isModalOpen && <StudentModal student={editingStudent} onClose={handleCloseModal} onSave={handleSave} />}
      {selectedStudentForFees && <StudentFeeModal student={selectedStudentForFees} onClose={() => setSelectedStudentForFees(null)} onUpdate={fetchStudents} />}
      <ChatBot />
    </div>
  );
}

export default App;
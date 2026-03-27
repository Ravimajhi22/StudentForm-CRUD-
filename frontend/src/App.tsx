import { useState, useEffect } from 'react';
import { PlusCircle, Moon, Sun } from 'lucide-react';
import StudentList from './components/StudentList';
import StudentModal from './components/StudentModal';
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

  useEffect(() => {
    fetch("http://localhost:5000/api/students")
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => console.error("Fetch error:", err));
  }, []);

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
  const handleSave = async (savedData: Omit<Student, 'id'> | Student) => {
    try {
      // UPDATE
      if ('id' in savedData) {
        const res = await fetch(
          `http://localhost:5000/api/students/${savedData.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(savedData),
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(savedData),
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
    <div className="min-h-screen bg-gradient-to-br from-[#eff6ff] via-[#ffffff] to-[#e0f2fe] dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-200 p-8 font-sans selection:bg-blue-200 dark:selection:bg-indigo-500/30 selection:text-blue-900 dark:selection:text-indigo-200 relative transition-colors duration-500">
      <div className="max-w-5xl mx-auto space-y-6 relative z-10">

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] relative transition-colors duration-500">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Student Registration
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              College Admission
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 shadow-sm transition-all active:scale-95"
              title="Toggle Dark Mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => {
                setEditingStudent(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_4px_14px_0_rgb(59,130,246,0.39)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)] border border-blue-400/50 active:scale-95"
            >
              <PlusCircle size={18} />
              Register New Student
            </button>
          </div>
        </header>

        {/* Table */}
        <main>
          <StudentList
            students={students}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
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
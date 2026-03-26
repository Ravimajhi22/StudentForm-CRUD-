import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import StudentList from './components/StudentList';
import StudentModal from './components/StudentModal';
import type { Student } from './types';

function App() {
  const [students, setStudents] = useState<Student[]>([]);
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-8 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Student Directory
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your official student records and demographics.
            </p>
          </div>

          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => {
                setEditingStudent(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm active:scale-95"
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
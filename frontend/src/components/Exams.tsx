import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Calendar, Clock, MapPin, Award, BookOpen, 
  ChevronRight, AlertCircle, Edit, FileText, X, Zap, 
  CheckCircle2, Trophy, ArrowRight, RefreshCw, Sparkles
} from 'lucide-react';
import type { Exam, Course } from '../types';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

const MOCK_QUESTIONS: Record<string, Question[]> = {
  "General": [
    { id: 1, text: "What is the primary purpose of an institutional management system?", options: ["Data Storage", "Process Automation", "Personnel Tracking", "All of the above"], correctAnswer: "All of the above" },
    { id: 2, text: "Which protocol is most commonly used for secure web communication?", options: ["HTTP", "FTP", "HTTPS", "SSH"], correctAnswer: "HTTPS" },
    { id: 3, text: "In database management, what does CRUD stand for?", options: ["Create, Read, Update, Delete", "Copy, Run, Under, Done", "Create, Remove, Use, Data", "None of these"], correctAnswer: "Create, Read, Update, Delete" },
  ],
  "Computer Science": [
    { id: 1, text: "Which programming language is known as the 'language of the web'?", options: ["Python", "C++", "JavaScript", "Java"], correctAnswer: "JavaScript" },
    { id: 2, text: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Main line", "None"], correctAnswer: "Hyper Text Markup Language" },
    { id: 3, text: "Which of these is a NoSQL database?", options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"], correctAnswer: "MongoDB" },
  ],
  "Mathematics": [
    { id: 1, text: "What is the value of Pi (to two decimal places)?", options: ["3.12", "3.14", "3.16", "3.18"], correctAnswer: "3.14" },
    { id: 2, text: "Solve: 2x + 5 = 15. What is x?", options: ["5", "10", "7.5", "20"], correctAnswer: "5" },
    { id: 3, text: "A triangle with all sides equal is called?", options: ["Isosceles", "Equilateral", "Scalene", "Right-angled"], correctAnswer: "Equilateral" },
  ]
};

const Exams: React.FC = () => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingExam, setEditingExam] = useState<Exam | null>(null);
    
    // Exam Portal States
    const [activeExam, setActiveExam] = useState<Exam | null>(null);
    const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const [formData, setFormData] = useState({
        exam_name: '',
        course_id: '',
        exam_date: '',
        start_time: '',
        end_time: '',
        room_number: '',
        total_marks: '100',
        description: ''
    });

    useEffect(() => {
        fetchExams();
        fetchCourses();
    }, []);

    const fetchExams = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/exams');
            const data = await res.json();
            setExams(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/academic/all');
            const data = await res.json();
            setCourses(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStartExam = (exam: Exam) => {
      setActiveExam(exam);
      // Simulate AI selecting questions based on department or general
      const dept = exam.course_name?.includes('Computer') ? "Computer Science" : 
                   exam.course_name?.includes('Math') ? "Mathematics" : "General";
      
      const qBank = MOCK_QUESTIONS[dept] || MOCK_QUESTIONS["General"];
      setCurrentQuestions([...qBank].sort(() => Math.random() - 0.5));
      setCurrentIndex(0);
      setScore(0);
      setIsFinished(false);
      setSelectedOption(null);
    };

    const handleNextQuestion = () => {
      if (selectedOption === currentQuestions[currentIndex].correctAnswer) {
        setScore(prev => prev + 1);
      }

      if (currentIndex + 1 < currentQuestions.length) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setIsFinished(true);
      }
    };

    const handleOpenModal = (exam: Exam | null = null) => {
        if (exam) {
            setEditingExam(exam);
            setFormData({
                exam_name: exam.exam_name,
                course_id: String(exam.course_id),
                exam_date: exam.exam_date.split('T')[0],
                start_time: exam.start_time,
                end_time: exam.end_time,
                room_number: exam.room_number || '',
                total_marks: String(exam.total_marks),
                description: exam.description || ''
            });
        } else {
            setEditingExam(null);
            setFormData({
                exam_name: '',
                course_id: '',
                exam_date: '',
                start_time: '',
                end_time: '',
                room_number: '',
                total_marks: '100',
                description: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingExam 
            ? `http://localhost:5000/api/exams/${editingExam.id}` 
            : 'http://localhost:5000/api/exams';
        const method = editingExam ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    course_id: parseInt(formData.course_id),
                    total_marks: parseInt(formData.total_marks)
                })
            });
            if (res.ok) {
                fetchExams();
                setShowModal(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this exam schedule?')) return;
        try {
            await fetch(`http://localhost:5000/api/exams/${id}`, { method: 'DELETE' });
            fetchExams();
        } catch (err) {
            console.error(err);
        }
    };

    if (activeExam) {
      return (
        <div className="fixed inset-0 z-[200] bg-slate-50 dark:bg-slate-950 flex flex-col animate-in fade-in duration-500">
          {/* Exam Portal Header */}
          <header className="bg-navy-950 px-8 py-5 border-b border-navy-800 flex justify-between items-center text-white">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <Zap size={20} className="animate-pulse" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest">{activeExam.exam_name}</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">AI-Generated Assessment Portal</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveExam(null)}
              className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>
          </header>

          <main className="flex-1 overflow-y-auto p-10 flex flex-col items-center">
            <div className="w-full max-w-3xl">
              {!isFinished ? (
                <div className="space-y-8">
                  {/* Progress Tracker */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question {currentIndex + 1} of {currentQuestions.length}</span>
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{Math.round(((currentIndex + 1) / currentQuestions.length) * 100)}% Complete</span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-700" 
                      style={{ width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }}
                    />
                  </div>

                  {/* Question Card */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-500">
                    <div className="flex items-start gap-4 mb-8">
                      <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 flex-shrink-0 font-black">
                        Q{currentIndex + 1}
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1 leading-tight tracking-tight">
                        {currentQuestions[currentIndex]?.text}
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {currentQuestions[currentIndex]?.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedOption(opt)}
                          className={`w-full p-5 rounded-xl border-2 text-left transition-all flex items-center justify-between group ${
                            selectedOption === opt
                              ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-500/10'
                              : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
                          }`}
                        >
                          <span className={`text-sm font-bold ${selectedOption === opt ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}>
                            {opt}
                          </span>
                          <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                            selectedOption === opt ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {selectedOption === opt && <CheckCircle2 size={12} />}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="mt-10 flex justify-end">
                      <button
                        disabled={!selectedOption}
                        onClick={handleNextQuestion}
                        className="flex items-center gap-3 px-8 py-4 bg-navy-950 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-navy-900 hover:translate-x-1 transition-all active:scale-95"
                      >
                        {currentIndex + 1 === currentQuestions.length ? 'Finalize Assessment' : 'Proceed Forward'}
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 rounded-xl text-amber-700 dark:text-amber-400">
                    <AlertCircle size={14} />
                    <p className="text-[10px] font-bold uppercase tracking-tight">Warning: Do not exit full-screen. Evaluation protocol is active.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-2xl animate-in zoom-in-95 duration-700">
                  <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-8 relative">
                    <Trophy size={48} />
                    <Sparkles size={24} className="absolute -top-2 -right-2 text-amber-500 animate-bounce" />
                  </div>
                  
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Assessment Concluded</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mb-12">Your academic performance has been verified and recorded.</p>
                  
                  <div className="grid grid-cols-2 gap-6 mb-12">
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Score Accuracy</p>
                      <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{score} / {currentQuestions.length}</p>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Percentile</p>
                      <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{Math.round((score/currentQuestions.length) * 100)}%</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setActiveExam(null)}
                      className="flex-1 py-4 bg-navy-950 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg hover:bg-navy-900 transition-all active:scale-95"
                    >
                      Return to Dashboard
                    </button>
                    <button 
                      onClick={() => handleStartExam(activeExam)}
                      className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all text-slate-600 dark:text-slate-300"
                    >
                      <RefreshCw size={14} />
                      Re-take
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Institutional Header */}
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-navy-50 dark:bg-navy-900/30 rounded-xl text-navy-600 dark:text-navy-400">
                        <Award size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Academic Assessment</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Examination Schedules & Evaluation Protocols</p>
                    </div>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-navy-950 text-white rounded-lg font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-navy-950/20 active:scale-95 transition-all outline-none border border-navy-800"
                >
                    <Plus size={16} />
                    Schedule Examination
                </button>
            </div>

            {/* Exam Registry Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {exams.map(exam => (
                    <div key={exam.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row group transition-all hover:shadow-md">
                        {/* Event Date Sidebar */}
                        <div className="md:w-32 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
                            <span className="text-3xl font-black text-navy-950 dark:text-white">{new Date(exam.exam_date).getDate()}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{new Date(exam.exam_date).toLocaleString('default', { month: 'short' })}</span>
                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 w-full flex flex-col items-center gap-1">
                                <Clock size={12} className="text-slate-400" />
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{exam.start_time.slice(0, 5)}</span>
                            </div>
                        </div>

                        {/* Exam Content Primary */}
                        <div className="flex-1 p-6 relative">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenModal(exam)} className="p-2 text-navy-600 hover:bg-navy-50 rounded-lg transition-colors border border-navy-100">
                                    <Edit size={14} />
                                </button>
                                <button onClick={() => handleDelete(exam.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100">
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <div className="mb-4">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-navy-50 text-navy-600 rounded-md mb-3 border border-navy-100">
                                    <Award size={10} />
                                    <span className="text-[9px] font-black uppercase tracking-[0.1em]">{exam.total_marks} Marks Assess</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">{exam.exam_name}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <BookOpen size={12} className="text-slate-300" /> {exam.course_name}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-slate-50 dark:border-slate-800 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-slate-400">
                                        <MapPin size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Assigned Venue</p>
                                        <p className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase">{exam.room_number || 'TBD'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-slate-400">
                                        <Clock size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Session Window</p>
                                        <p className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase">{exam.start_time.slice(0, 5)} - {exam.end_time.slice(0, 5)}</p>
                                    </div>
                                </div>
                            </div>

                            <button 
                              onClick={() => handleStartExam(exam)}
                              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all group/btn"
                            >
                              <Zap size={14} className="group-hover/btn:animate-bounce" />
                              Start AI Assessment
                            </button>
                        </div>
                    </div>
                ))}

                {exams.length === 0 && (
                    <div className="col-span-full py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                        <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-300 mb-6">
                            <FileText size={64} />
                        </div>
                        <div className="max-w-xs space-y-2">
                            <h3 className="font-black text-slate-900 dark:text-white tracking-[0.2em] uppercase text-sm">Registry Empty</h3>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-tighter">No examination schedules have been established for the current academic session.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Assessment Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-xl p-10 shadow-2xl border border-slate-200 dark:border-slate-800 transform animate-in zoom-in-95 duration-300">
                         <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-navy-50 rounded-lg text-navy-600">
                                    <Calendar size={24} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                                    {editingExam ? 'Modify Assessment' : 'New Examination'}
                                </h2>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Assessment Nomenclature</label>
                                    <input 
                                        required
                                        type="text"
                                        className="input-formal w-full px-5 py-4 rounded-lg font-bold text-slate-800 dark:text-white text-[13px]"
                                        placeholder="e.g., Mathematics II End-Semester"
                                        value={formData.exam_name}
                                        onChange={(e) => setFormData({...formData, exam_name: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Academic Department</label>
                                    <select 
                                        required
                                        className="input-formal w-full px-5 py-4 rounded-lg font-bold text-slate-800 dark:text-white text-[13px] appearance-none"
                                        value={formData.course_id}
                                        onChange={(e) => setFormData({...formData, course_id: e.target.value})}
                                    >
                                        <option value="">Select Department...</option>
                                        {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Scheduled Date</label>
                                    <input 
                                        required
                                        type="date"
                                        className="input-formal w-full px-5 py-4 rounded-lg font-bold text-slate-800 dark:text-white text-[13px]"
                                        value={formData.exam_date}
                                        onChange={(e) => setFormData({...formData, exam_date: e.target.value})}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Commencement</label>
                                        <input 
                                            required
                                            type="time"
                                            className="input-formal w-full px-5 py-4 rounded-lg font-bold text-slate-800 dark:text-white text-[13px]"
                                            value={formData.start_time}
                                            onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Conclusion</label>
                                        <input 
                                            required
                                            type="time"
                                            className="input-formal w-full px-5 py-4 rounded-lg font-bold text-slate-800 dark:text-white text-[13px]"
                                            value={formData.end_time}
                                            onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Assigned Venue</label>
                                    <input 
                                        type="text"
                                        className="input-formal w-full px-5 py-4 rounded-lg font-bold text-slate-800 dark:text-white text-[13px]"
                                        placeholder="Room 102 / Hall B"
                                        value={formData.room_number}
                                        onChange={(e) => setFormData({...formData, room_number: e.target.value})}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-[11px] font-black text-slate-500 uppercase mb-2 ml-1 tracking-widest">Assessment Value</label>
                                    <input 
                                        type="number"
                                        className="input-formal w-full px-5 py-4 rounded-lg font-bold text-slate-800 dark:text-white text-[13px]"
                                        value={formData.total_marks}
                                        onChange={(e) => setFormData({...formData, total_marks: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)} 
                                    className="flex-1 py-4 font-black text-[11px] uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-100 transition-colors"
                                >
                                    Abort
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-[2] py-4 bg-navy-950 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-lg shadow-lg shadow-navy-950/25 transition-all active:scale-[0.98] border border-navy-800"
                                >
                                    {editingExam ? 'Confirm Updates' : 'Establish Schedule'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Exams;

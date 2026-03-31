import { 
  LayoutDashboard, 
  Users, 
  DollarSign,
  GraduationCap,
  ClipboardCheck,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  activeView: 'dashboard' | 'students' | 'fees' | 'academic' | 'attendance' | 'exams';
  onViewChange: (view: 'dashboard' | 'students' | 'fees' | 'academic' | 'attendance' | 'exams') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  onViewChange 
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Student Directory', icon: Users },
    { id: 'fees', label: 'Financial Ledger', icon: DollarSign },
    { id: 'academic', label: 'Academic Branch', icon: GraduationCap },
    { id: 'attendance', label: 'Attendance Registry', icon: ClipboardCheck },
    { id: 'exams', label: 'Examination Cell', icon: ShieldCheck },
  ] as const;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-[#030712] border-r border-slate-100 dark:border-indigo-500/10 z-[60] flex flex-col transition-all duration-300">
      {/* Brand Header - Compacted */}
      <div className="p-6 mb-2">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onViewChange('dashboard')}>
          <div className="w-9 h-9 bg-navy-600 rounded-lg flex items-center justify-center shadow-lg shadow-navy-200 dark:shadow-none transition-transform group-hover:scale-105">
            <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-md font-extrabold tracking-tight leading-none text-slate-800 dark:text-white uppercase">
              Education <span className="text-navy-600">for you</span>
            </h1>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">v4.0 Final</p>
          </div>
        </div>
      </div>

      {/* Navigation Section - Compacted */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-6 custom-scrollbar">
        <div>
          <h2 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-3">Main Menu</h2>
          <div className="space-y-1">
            {navItems.map((item, studentsIndex) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 transform hover:translate-x-1 active:scale-95 animate-fade-in-up ${
                  activeView === item.id
                    ? 'bg-navy-50/60 dark:bg-navy-500/10 text-navy-600 dark:text-navy-400 border border-navy-100/50 dark:border-navy-500/20 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-navy-600 dark:hover:text-navy-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
                style={{ animationDelay: `${studentsIndex * 0.1}s` }}
              >
                <item.icon size={18} className={activeView === item.id ? 'text-navy-600' : 'text-slate-400'} />
                <span className="text-[13px] font-semibold tracking-tight">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

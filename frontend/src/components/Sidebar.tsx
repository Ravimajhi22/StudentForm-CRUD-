import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Moon, 
  Sun, 
  ChevronRight,
  DollarSign,
  GraduationCap,
  ClipboardCheck
} from 'lucide-react';

interface SidebarProps {
  isDark: boolean;
  onToggleDark: () => void;
  activeView: 'dashboard' | 'students' | 'fees' | 'academic' | 'attendance';
  onViewChange: (view: 'dashboard' | 'students' | 'fees' | 'academic' | 'attendance') => void;
  stats: {
    total: number;
    male: number;
    female: number;
    other: number;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isDark, 
  onToggleDark, 
  activeView, 
  onViewChange, 
  stats 
}) => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-[60] flex flex-col p-6 transition-all duration-300">
      {/* Logo Section */}
      <div className="flex items-center gap-2.5 mb-10 px-2 mt-2 cursor-pointer group" onClick={() => onViewChange('dashboard')}>
        <div className="relative w-9 h-9 flex-shrink-0">
          <div className="absolute bottom-1 left-0 w-4.5 h-4.5 bg-slate-500 rounded-[2px] shadow-sm transform group-hover:-translate-y-0.5 transition-transform duration-300"></div>
          <div className="absolute top-1 right-0 w-4.5 h-4.5 bg-[#fbbf24] rounded-[2px] shadow-sm transform group-hover:translate-x-0.5 transition-transform duration-300"></div>
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight leading-none">
            <span className="text-slate-800 dark:text-white">Mai</span>
            <span className="text-sky-500">prosoft</span>
          </h1>
          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">College of Excellence</p>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 space-y-8">
        <div>
          <h2 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">Main Menu</h2>
          <div className="space-y-1.5">
            <button
              onClick={() => onViewChange('dashboard')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                activeView === 'dashboard'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-[#fefce8] hover:text-yellow-700 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={20} strokeWidth={activeView === 'dashboard' ? 2.5 : 2} />
                <span className="text-sm font-bold">Dashboard</span>
              </div>
              <ChevronRight size={14} className={`transition-transform duration-300 ${activeView === 'dashboard' ? 'rotate-90 opacity-100' : 'opacity-0'}`} />
            </button>

            <button
              onClick={() => onViewChange('students')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                activeView === 'students'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-[#fefce8] hover:text-yellow-700 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users size={20} strokeWidth={activeView === 'students' ? 2.5 : 2} />
                <span className="text-sm font-bold">Students List</span>
              </div>
              <ChevronRight size={14} className={`transition-transform duration-300 ${activeView === 'students' ? 'rotate-90 opacity-100' : 'opacity-0'}`} />
            </button>

            <button
              onClick={() => onViewChange('fees')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                activeView === 'fees'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-[#fefce8] hover:text-yellow-700 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <DollarSign size={20} strokeWidth={activeView === 'fees' ? 2.5 : 2} />
                <span className="text-sm font-bold">College Fees</span>
              </div>
              <ChevronRight size={14} className={`transition-transform duration-300 ${activeView === 'fees' ? 'rotate-90 opacity-100' : 'opacity-0'}`} />
            </button>

            <button
              onClick={() => onViewChange('academic')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                activeView === 'academic'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-[#fefce8] hover:text-yellow-700 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <GraduationCap size={20} strokeWidth={activeView === 'academic' ? 2.5 : 2} />
                <span className="text-sm font-bold">Academic Org</span>
              </div>
              <ChevronRight size={14} className={`transition-transform duration-300 ${activeView === 'academic' ? 'rotate-90 opacity-100' : 'opacity-0'}`} />
            </button>

            <button
              onClick={() => onViewChange('attendance')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                activeView === 'attendance'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-[#fefce8] hover:text-yellow-700 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <ClipboardCheck size={20} strokeWidth={activeView === 'attendance' ? 2.5 : 2} />
                <span className="text-sm font-bold">Attendance</span>
              </div>
              <ChevronRight size={14} className={`transition-transform duration-300 ${activeView === 'attendance' ? 'rotate-90 opacity-100' : 'opacity-0'}`} />
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 px-2">Quick Stats</h2>
          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 rounded-2xl bg-[#fefce8]/50 dark:bg-slate-800/40 border border-[#fef08a] dark:border-slate-800/50">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[11px] font-bold text-yellow-700/80 uppercase">Total Students</p>
                <div className="p-1.5 bg-white rounded-lg text-yellow-600 shadow-sm">
                  <Users size={14} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-800 dark:text-white leading-tight">{stats.total}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/20 border border-[#e0f2fe] dark:border-slate-800/40 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.4)]"></div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Gender Distribution</p>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'Male', count: stats.male, color: 'bg-sky-500' },
                  { label: 'Female', count: stats.female, color: 'bg-indigo-400' },
                  { label: 'Other', count: stats.other, color: 'bg-slate-300' }
                ].map((item) => (
                  <div key={item.label} className="group cursor-default">
                    <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                      <span className="text-slate-500 dark:text-slate-400">{item.label}</span>
                      <span className="text-slate-800 dark:text-white">{item.count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full transition-all duration-1000`} 
                        style={{ width: stats.total > 0 ? `${(item.count / stats.total) * 100}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 space-y-4">
        <button
          onClick={onToggleDark}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-300 group"
        >
          <div className={`p-2 rounded-xl transition-all duration-500 ${isDark ? 'bg-amber-100/10 text-amber-400' : 'bg-blue-50 text-blue-600'}`}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </div>
          <span className="text-sm font-bold group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>

        <div className="px-2">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-700 flex items-center justify-center text-slate-400 overflow-hidden shadow-sm">
               <img src="https://ui-avatars.com/api/?name=Admin&background=0284c7&color=fff" alt="Admin" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-800 dark:text-white truncate">Administrator</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Super Access</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

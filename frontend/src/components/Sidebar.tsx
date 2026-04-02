import { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign,
  GraduationCap,
  ClipboardCheck,
  ShieldCheck,
  BookOpen,
  Languages,
  ChevronUp
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  activeView: 'dashboard' | 'students' | 'fees' | 'academic' | 'attendance' | 'exams';
  onViewChange: (view: 'dashboard' | 'students' | 'fees' | 'academic' | 'attendance' | 'exams') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  onViewChange 
}) => {
  const { t, i18n } = useTranslation();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'dashboard', label: t('sidebar.dashboard'), icon: LayoutDashboard },
    { id: 'students', label: t('sidebar.students'), icon: Users },
    { id: 'fees', label: t('sidebar.fees'), icon: DollarSign },
    { id: 'academic', label: t('sidebar.academic'), icon: GraduationCap },
    { id: 'attendance', label: t('sidebar.attendance'), icon: ClipboardCheck },
    { id: 'exams', label: t('sidebar.exams'), icon: ShieldCheck },
  ] as const;

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi (हिंदी)' },
    { code: 'te', label: 'Telugu (తెలుగు)' },
    { code: 'ur', label: 'Urdu (اردو)' },
    { code: 'ta', label: 'Tamil (தமிழ்)' },
    { code: 'ml', label: 'Malayalam (മലയാളം)' },
    { code: 'kn', label: 'Kannada (ಕನ್ನಡ)' },
    { code: 'or', label: 'Odia (ଓଡ଼ିଆ)' },
  ];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsLangMenuOpen(false);
  };

  const getLanguageLabel = (code: string) => {
    return languages.find(l => l.code === code)?.label.split(' ')[0] || 'English';
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
              {t('sidebar.brand_name')} <span className="text-navy-600">{t('sidebar.brand_tagline')}</span>
            </h1>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">v4.0 Final</p>
          </div>
        </div>
      </div>

      {/* Navigation Section - Compacted */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-6 custom-scrollbar">
        <div>
          <h2 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-3">{t('sidebar.main_menu')}</h2>
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

      {/* Language Switcher Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-indigo-500/10 relative" ref={langMenuRef}>
        {/* Language Selection Menu */}
        {isLangMenuOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-300 z-[70]">
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-colors ${
                    i18n.language === lang.code 
                      ? 'bg-navy-50 dark:bg-navy-900/30 text-navy-600 dark:text-navy-400' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-navy-600'
                  }`}
                >
                  <span>{lang.label}</span>
                  {i18n.language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-navy-600 dark:bg-navy-400 shadow-sm shadow-navy-200"></div>}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 border group ${
            isLangMenuOpen 
              ? 'bg-navy-50 dark:bg-navy-900/30 border-navy-200 dark:border-navy-800' 
              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 hover:bg-navy-50 dark:hover:bg-navy-900/30 text-slate-600 dark:text-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transition-all duration-300 ${
              isLangMenuOpen ? 'bg-navy-600 text-white scale-110' : 'bg-white dark:bg-slate-700 text-navy-600 dark:text-navy-400 group-hover:scale-110'
            }`}>
              <Languages size={16} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">
              {getLanguageLabel(i18n.language)}
            </span>
          </div>
          <ChevronUp size={14} className={`transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''} text-slate-400`} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

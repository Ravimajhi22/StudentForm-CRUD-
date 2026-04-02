import React, { useState } from 'react';
import { Mail, Lock, LogIn, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { API_URL } from '../apiConfig';

interface LoginProps {
  onLoginSuccess: (token: string, admin: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLoginSuccess(data.token, data.admin);
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection refused. Is the server running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#030712] p-6 font-sans relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-navy-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl shadow-indigo-500/5 p-8 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex w-16 h-16 bg-navy-600 rounded-2xl items-center justify-center shadow-xl shadow-navy-200 dark:shadow-none mb-6 group hover:scale-105 transition-transform duration-300">
              <BookOpen size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">
              Institutional <span className="text-navy-600">Gate</span>
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Secure Administrator Access</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 mb-2 block">
                Official Email
              </label>
              <div className="relative group">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy-600 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@education.com"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:border-navy-500/50 focus:ring-4 focus:ring-navy-500/5 transition-all text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 mb-2 block">
                Secure Password
              </label>
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy-600 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:border-navy-500/50 focus:ring-4 focus:ring-navy-500/5 transition-all text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl p-4 flex items-start gap-3 animate-in shake duration-300">
                <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase leading-relaxed">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-navy-950 dark:bg-navy-600 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-navy-900/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:active:scale-100 group"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                  Authenticate Session
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
              Default Access: admin@education.com / admin123
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] opacity-50">
          Powered by Institutional Governance v4.0
        </p>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  UserPlus, 
  LogIn, 
  Building2, 
  Mail, 
  Lock, 
  User, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Briefcase,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAuthenticated: (user: UserProfile) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onUserAuthenticated,
  initialMode = 'register',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('workonlinegctpk@gmail.com');
  const [password, setPassword] = useState<string>('');
  const [company, setCompany] = useState<string>('SAMP Global Solutions');
  const [workspaceName, setWorkspaceName] = useState<string>('Primary Production Workspace');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'register') {
        const user = await api.register({
          name: name.trim() || 'SAMP Administrator',
          email: email.trim().toLowerCase(),
          password,
          company: company.trim(),
          workspaceName: workspaceName.trim(),
          role: 'owner',
        });
        onUserAuthenticated(user);
        onClose();
      } else {
        const user = await api.login(email.trim().toLowerCase(), password);
        onUserAuthenticated(user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await api.register({
        name: 'SAMP Lead Executive',
        email: 'workonlinegctpk@gmail.com',
        company: 'SAMP Global Marketing',
        workspaceName: 'Executive Command Center',
        role: 'owner',
      }).catch(async () => {
        return await api.login('workonlinegctpk@gmail.com');
      });
      onUserAuthenticated(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {mode === 'register' ? 'Create SAMP Account' : 'Sign In to Workspace'}
              </h2>
              <p className="text-xs text-slate-400">
                Enterprise Multi-Platform Social Media Automation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {/* Mode Switcher */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Henderson"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Company
                  </label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Agency Name"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Workspace
                  </label>
                  <div className="relative">
                    <Briefcase className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      placeholder="Marketing Hub"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : mode === 'register' ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account & Workspace</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Access Platform</span>
                </>
              )}
            </button>
          </form>

          {/* Quick One-Click Setup with current user email */}
          <div className="pt-3 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              disabled={loading}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center justify-center gap-1.5 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>One-Click Sign In as {email}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

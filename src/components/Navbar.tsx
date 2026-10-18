import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Clock, 
  GitBranch, 
  Sparkles, 
  Bell, 
  ChevronDown, 
  CheckCircle2, 
  Radio
} from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  onOpenComposer: () => void;
  onOpenGitHubModal: () => void;
  unreadCount?: number;
  currentWorkspace?: string;
  onSelectWorkspace?: (ws: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenComposer,
  onOpenGitHubModal,
  unreadCount = 2,
  currentWorkspace = 'SAMP Global Agency Workspace',
  onSelectWorkspace
}) => {
  const [time, setTime] = useState<string>('');
  const [workspaceDropdown, setWorkspaceDropdown] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const workspaces = [
    'SAMP Global Agency Workspace',
    'E-Commerce & DTC Brands',
    'Creator Growth Hub',
    'Enterprise B2B Portfolio'
  ];

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#0c121e]/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 flex items-center justify-between">
      {/* Left: Mobile Logo & Workspace Switcher */}
      <div className="flex items-center gap-4">
        <div className="lg:hidden">
          <Logo size="sm" showSubtitle={false} />
        </div>

        {/* Workspace Dropdown */}
        <div className="relative">
          <button
            onClick={() => setWorkspaceDropdown(!workspaceDropdown)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition-all shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="truncate max-w-[160px] sm:max-w-[220px] font-semibold">{currentWorkspace}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {workspaceDropdown && (
            <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50">
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800/60">
                Switch Organization / Workspace
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws}
                  onClick={() => {
                    if (onSelectWorkspace) onSelectWorkspace(ws);
                    setWorkspaceDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                    currentWorkspace === ws ? 'text-indigo-400 font-semibold bg-indigo-500/10' : 'text-slate-300'
                  }`}
                >
                  <span className="truncate">{ws}</span>
                  {currentWorkspace === ws && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Real-time Scheduler Engine Pulse */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Real-Time Scheduler Active (10s sync)</span>
        </div>
      </div>

      {/* Right: Actions, Clock, GitHub Automation & User Profile */}
      <div className="flex items-center gap-3">
        {/* Live System Time */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-900/60 border border-slate-800/80 px-2.5 py-1 rounded-md">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>{time} UTC</span>
        </div>

        {/* GitHub Automation Button */}
        <button
          onClick={onOpenGitHubModal}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
          title="Automate GitHub repository & deployment creation"
        >
          <GitBranch className="w-4 h-4 text-purple-400" />
          <span className="hidden sm:inline">GitHub Deploy</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-950 border border-purple-500/40 text-purple-300 font-mono">
            SAMP-Platform
          </span>
        </button>

        {/* Primary New Post Button */}
        <button
          onClick={onOpenComposer}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Post</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors relative"
            title="Community inbox notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[10px] font-extrabold text-white rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Profile"
            className="w-8 h-8 rounded-full ring-2 ring-indigo-500/40 object-cover"
          />
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-slate-200">Admin Account</div>
            <div className="text-[10px] text-indigo-400 font-medium">Enterprise Pro</div>
          </div>
        </div>
      </div>
    </header>
  );
};

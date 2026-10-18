import React from 'react';
import { 
  LayoutDashboard, 
  Send, 
  Calendar, 
  Share2, 
  Zap, 
  MessageSquare, 
  BarChart3, 
  Database, 
  GitPullRequest,
  Sparkles,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { Logo } from './Logo';

export type TabType = 
  | 'dashboard' 
  | 'composer' 
  | 'calendar' 
  | 'accounts' 
  | 'automations' 
  | 'inbox' 
  | 'analytics' 
  | 'schema' 
  | 'github';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  inboxCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onSelectTab,
  inboxCount = 0 
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'composer', label: 'Composer', icon: Send, badge: 'Hero' },
    { id: 'calendar', label: 'Schedule & Calendar', icon: Calendar },
    { id: 'accounts', label: 'Social Accounts', icon: Share2 },
    { id: 'automations', label: 'Automations & Queues', icon: Zap },
    { id: 'inbox', label: 'Social Inbox', icon: MessageSquare, count: inboxCount },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'schema', label: 'Database Schema', icon: Database, badge: 'Postgres' },
    { id: 'github', label: 'GitHub Auto-Deploy', icon: GitPullRequest, badge: 'CI/CD' },
  ];

  return (
    <aside className="w-64 bg-[#090d16] border-r border-slate-800/80 flex flex-col shrink-0 min-h-screen select-none">
      {/* Top Brand Logo */}
      <div className="h-16 px-5 flex items-center border-b border-slate-800/80">
        <Logo size="md" showSubtitle={true} />
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
          Main Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as TabType)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/20 to-violet-600/10 text-white border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-850 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  item.badge === 'Hero'
                    ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/30'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}

              {typeof item.count === 'number' && item.count > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* HeroPost Style Quick Info Footer */}
      <div className="p-3 m-3 rounded-xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/20">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-white">SAMP Engine v2.4</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
          Enterprise real-time scheduling & multi-channel automation inspired by HeroPost.
        </p>
        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
          <span>PostgreSQL & SQLite</span>
          <span className="text-emerald-400 font-mono">● Operational</span>
        </div>
      </div>
    </aside>
  );
};

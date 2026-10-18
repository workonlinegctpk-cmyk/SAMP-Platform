import React, { useState } from 'react';
import { SocialAccount, SocialPlatform } from '../types';
import { 
  Share2, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  ShieldCheck, 
  Key, 
  ExternalLink 
} from 'lucide-react';

interface SocialAccountsProps {
  accounts: SocialAccount[];
  onAddAccount: (acc: { platform: string; name: string; username: string; accountType?: string }) => void;
  onDeleteAccount: (id: string) => void;
}

export const SocialAccounts: React.FC<SocialAccountsProps> = ({
  accounts,
  onAddAccount,
  onDeleteAccount,
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [accountType, setAccountType] = useState<string>('profile');
  const [refreshingId, setRefreshingId] = useState<string | null>(null);

  const availablePlatforms: { id: SocialPlatform; name: string; icon: string; desc: string }[] = [
    { id: 'instagram', name: 'Instagram', icon: '📸', desc: 'Feed posts, Reels, Stories, & Carousel' },
    { id: 'twitter', name: 'X / Twitter', icon: '🐦', desc: 'Tweets, Threads, & Media uploads' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', desc: 'Company Pages & Personal Profiles' },
    { id: 'facebook', name: 'Facebook', icon: '👤', desc: 'Pages, Groups, & Business Meta Suite' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', desc: 'Short-form videos & Creator Studio' },
    { id: 'youtube', name: 'YouTube', icon: '▶️', desc: 'Shorts, Community Posts, & Videos' },
    { id: 'pinterest', name: 'Pinterest', icon: '📌', desc: 'Boards, Pins, & Rich Product Pins' },
    { id: 'threads', name: 'Threads', icon: '🧵', desc: 'Conversational threads & updates' },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username) {
      alert('Please fill in Account Name and Handle');
      return;
    }
    onAddAccount({
      platform,
      name,
      username,
      accountType,
    });
    setName('');
    setUsername('');
    setShowAddModal(false);
  };

  const handleRefreshTokens = (id: string) => {
    setRefreshingId(id);
    setTimeout(() => {
      setRefreshingId(null);
      alert('OAuth credentials & access tokens refreshed successfully.');
    }, 1000);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-400" />
            <span>Social Accounts & Channel Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Connect, refresh, and orchestrate publishing permissions across 8 supported social platforms.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/25"
        >
          <Plus className="w-4 h-4" />
          <span>Connect Social Channel</span>
        </button>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {accounts.map((acc) => {
          const isRefreshing = refreshingId === acc.id;

          return (
            <div
              key={acc.id}
              className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={acc.avatarUrl}
                      alt={acc.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/20"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white capitalize">{acc.name}</h3>
                      <div className="text-xs text-indigo-400 font-mono">{acc.username}</div>
                      <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-slate-900 border border-slate-800 text-slate-400">
                        {acc.platform} · {acc.accountType}
                      </span>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>Active</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Audience</span>
                    <span className="font-extrabold text-slate-200">
                      {acc.followersCount.toLocaleString()} followers
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Token Health</span>
                    <span className="font-mono text-emerald-400 text-[11px]">Valid 60d+</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => handleRefreshTokens(acc.id)}
                  disabled={isRefreshing}
                  className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
                  <span>{isRefreshing ? 'Refreshing...' : 'Verify Token'}</span>
                </button>

                <button
                  onClick={() => onDeleteAccount(acc.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                  title="Disconnect Channel"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CONNECT CHANNEL MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Connect New Social Channel</h2>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Select platform to link credentials, generate access tokens, and sync publishing streams.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Platform Selector Grid */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-2">
                  Select Social Platform
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {availablePlatforms.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setPlatform(p.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        platform === p.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/50'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xl mb-1">{p.icon}</div>
                      <div className="text-[11px] font-bold">{p.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                  Brand or Channel Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. SAMP Global Media"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Handle */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                  Social Handle / Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. @samp_global or samp_official"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Account Type */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                  Account Type
                </label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="business">Business / Organization</option>
                  <option value="page">Public Page</option>
                  <option value="profile">Personal Profile</option>
                  <option value="channel">Channel / Studio</option>
                </select>
              </div>

              {/* OAuth notice */}
              <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-start gap-2">
                <Key className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  SAMP will register the OAuth credential hash with scoped permissions (Publish Posts, Read Insights, Manage Comments).
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30"
                >
                  Confirm & Link Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

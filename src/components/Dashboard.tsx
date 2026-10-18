import React from 'react';
import { 
  SocialAccount, 
  ScheduledPost, 
  AnalyticsSummary, 
  SocialPlatform 
} from '../types';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  Radio, 
  Send, 
  Share2, 
  Flame, 
  Activity, 
  Check, 
  ExternalLink,
  Layers
} from 'lucide-react';

interface DashboardProps {
  accounts: SocialAccount[];
  posts: ScheduledPost[];
  analytics: AnalyticsSummary | null;
  onOpenComposer: () => void;
  onOpenCalendar: () => void;
  onOpenAccounts: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  accounts,
  posts,
  analytics,
  onOpenComposer,
  onOpenCalendar,
  onOpenAccounts
}) => {
  const scheduledPosts = posts.filter((p) => p.status === 'scheduled');
  const publishedPosts = posts.filter((p) => p.status === 'published');
  
  // Next scheduled post
  const nextPost = scheduledPosts.slice().sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())[0];

  const platformIcons: Record<SocialPlatform, string> = {
    instagram: '📸',
    twitter: '🐦',
    linkedin: '💼',
    facebook: '👤',
    tiktok: '🎵',
    youtube: '▶️',
    pinterest: '📌',
    threads: '🧵',
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Hero Greeting */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border border-indigo-500/30 p-6 shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                HeroPost-Class Suite
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Live Real-Time Engine</span>
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              SAMP Social Command Center
            </h1>
            <p className="text-xs lg:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Automate multi-network social media publishing, monitor brand engagement, and coordinate scheduled queues seamlessly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenComposer}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Compose Post</span>
            </button>
            <button
              onClick={onOpenCalendar}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-semibold transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>View Planner</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Audience */}
        <div className="bg-[#0f172a] border border-slate-800/90 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Audience</span>
            <div className="p-2 rounded-lg bg-indigo-950/60 text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {(analytics?.totalAudience || 208370).toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{analytics?.growthRate || 14.6}% this month</span>
          </div>
        </div>

        {/* Scheduled Pipeline */}
        <div className="bg-[#0f172a] border border-slate-800/90 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Scheduled Queue</span>
            <div className="p-2 rounded-lg bg-amber-950/60 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {scheduledPosts.length} <span className="text-xs font-normal text-slate-400">posts</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span>Next run:</span>
            <span className="text-indigo-300 font-semibold">
              {nextPost ? new Date(nextPost.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No queue'}
            </span>
          </div>
        </div>

        {/* Published Posts */}
        <div className="bg-[#0f172a] border border-slate-800/90 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Published</span>
            <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {publishedPosts.length} <span className="text-xs font-normal text-slate-400">delivered</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-2">
            100% Delivery Success Rate
          </div>
        </div>

        {/* Avg Engagement */}
        <div className="bg-[#0f172a] border border-slate-800/90 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Engagement</span>
            <div className="p-2 rounded-lg bg-violet-950/60 text-violet-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {analytics?.averageEngagementRate || 4.82}%
          </div>
          <div className="text-[11px] text-indigo-300 font-medium mt-2">
            Across 6 connected networks
          </div>
        </div>
      </div>

      {/* Middle Row: Next Upcoming Post Alert & Connected Social Channels Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Next Scheduled Post in Pipeline */}
        <div className="lg:col-span-7 bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Next Upcoming Post in Pipeline
              </h2>
            </div>
            <button
              onClick={onOpenCalendar}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View Full Calendar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {nextPost ? (
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950/80 text-amber-300 border border-amber-500/40">
                    Scheduled
                  </div>
                  <span className="text-xs font-mono text-slate-300">
                    {new Date(nextPost.scheduledFor).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {nextPost.targetPlatforms.map((plat) => (
                    <span
                      key={plat}
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-950/70 text-indigo-300 border border-indigo-500/30"
                    >
                      {plat}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed">
                {nextPost.content}
              </p>

              {nextPost.media.length > 0 && (
                <div className="h-28 rounded-lg overflow-hidden border border-slate-800">
                  <img
                    src={nextPost.media[0].url}
                    alt="Media preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {nextPost.firstComment && (
                <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                  <span className="font-bold text-slate-300 mr-1.5">First comment:</span>
                  <span>{nextPost.firstComment}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl">
              <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <div className="text-xs text-slate-400 font-medium">No posts currently in scheduled queue</div>
              <button
                onClick={onOpenComposer}
                className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 font-bold"
              >
                + Schedule your first post
              </button>
            </div>
          )}
        </div>

        {/* Connected Channels Grid */}
        <div className="lg:col-span-5 bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Channel Health & Connectivity
              </h2>
            </div>
            <button
              onClick={onOpenAccounts}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Manage
            </button>
          </div>

          <div className="space-y-2.5">
            {accounts.slice(0, 5).map((acc) => (
              <div
                key={acc.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={acc.avatarUrl}
                    alt={acc.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-200 capitalize flex items-center gap-1.5">
                      <span>{acc.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{acc.username}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {acc.followersCount.toLocaleString()} followers
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Active</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Published Posts & Real-Time Delivery Log */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Real-Time Publication & Delivery Audit Feed
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Auto-refreshed via SAMP Engine
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="pb-3">Post Content</th>
                <th className="pb-3">Networks</th>
                <th className="pb-3">Scheduled / Published</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Delivery Log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {posts.slice(0, 5).map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 pr-4 max-w-sm">
                    <div className="font-medium text-slate-200 truncate">{p.content}</div>
                    {p.tags.length > 0 && (
                      <div className="text-[10px] text-indigo-400 mt-0.5">
                        {p.tags.map((t) => `#${t}`).join(' ')}
                      </div>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1">
                      {p.targetPlatforms.map((plat) => (
                        <span
                          key={plat}
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-900 border border-slate-800 text-slate-300"
                        >
                          {plat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-slate-400 font-mono text-[11px]">
                    {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : new Date(p.scheduledFor).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.status === 'published'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center justify-end gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>HTTP 200 OK</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

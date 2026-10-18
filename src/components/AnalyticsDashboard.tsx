import React, { useState } from 'react';
import { AnalyticsSummary, PlatformMetric, SocialPlatform } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointerClick, 
  Download, 
  Calendar, 
  Sparkles, 
  Flame, 
  Check, 
  ArrowUpRight 
} from 'lucide-react';

interface AnalyticsDashboardProps {
  summary: AnalyticsSummary | null;
  metrics: PlatformMetric[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  summary,
  metrics,
}) => {
  const [dateRange, setDateRange] = useState<string>('30d');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];

  // Synthetic best times heatmap score matrix (0 to 100)
  const heatmapData = [
    [25, 85, 45, 60, 95, 40], // Mon
    [30, 90, 70, 75, 98, 50], // Tue
    [40, 95, 65, 80, 100, 60], // Wed
    [35, 92, 80, 85, 94, 55], // Thu
    [45, 88, 75, 90, 85, 70], // Fri
    [60, 40, 50, 65, 75, 85], // Sat
    [70, 45, 55, 70, 80, 90], // Sun
  ];

  const handleExport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <span>Integrated Analytics & Performance Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-platform engagement tracking, audience growth velocity, and algorithmic posting heatmap.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Time range selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter</option>
            <option value="1y">Year to Date</option>
          </select>

          <button
            onClick={handleExport}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>{downloadSuccess ? 'Export Ready (CSV)' : 'Export Report'}</span>
          </button>
        </div>
      </div>

      {/* Hero Performance Overview Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Impressions</span>
            <Eye className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {(summary?.totalImpressions || 348200).toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+22.4% vs previous 30d</span>
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Link Clicks</span>
            <MousePointerClick className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {(summary?.totalClicks || 21940).toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.1% CTR conversion</span>
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Engagement Rate</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {summary?.averageEngagementRate || 4.82}%
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-2">
            <span>Industry Benchmark: 2.4%</span>
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Net Follower Growth</span>
            <Users className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            +{(Math.floor((summary?.totalAudience || 208370) * 0.082)).toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-violet-400 font-semibold mt-2">
            <span>+{summary?.growthRate || 14.6}% annualized</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Platform Performance Breakdown & Best Time to Post Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Platform Breakdown Cards */}
        <div className="lg:col-span-6 bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Channel-Level Performance Breakdown
            </h2>
            <span className="text-xs text-slate-400">All Metrics Normalized</span>
          </div>

          <div className="space-y-3">
            {metrics.map((m) => (
              <div
                key={m.platform}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="capitalize font-bold text-xs text-white">{m.platform}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({m.postsCount} posts)</span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-400">
                    {m.engagement}% Engagement
                  </span>
                </div>

                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mb-2.5">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, m.engagement * 16)}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Audience: {m.followers.toLocaleString()}</span>
                  <span>Impressions: {m.impressions.toLocaleString()}</span>
                  <span>Clicks: {m.clicks.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap: Best Times to Post */}
        <div className="lg:col-span-6 bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Audience Activity Heatmap</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Darker cyan/indigo indicates optimal publishing engagement windows.
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
              AI Recommendation
            </span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[420px]">
              {/* Header hours */}
              <div className="grid grid-cols-7 text-center pb-2 text-[10px] font-bold text-slate-400 uppercase">
                <div className="text-left pl-1">Day</div>
                {hours.map((h) => (
                  <div key={h}>{h}</div>
                ))}
              </div>

              {/* Day rows */}
              <div className="space-y-1.5">
                {daysOfWeek.map((day, dIdx) => (
                  <div key={day} className="grid grid-cols-7 items-center gap-1">
                    <div className="text-[11px] font-bold text-slate-300">{day}</div>
                    {heatmapData[dIdx].map((score, hIdx) => {
                      // Color intensity based on score
                      const bg =
                        score > 90
                          ? 'bg-cyan-400 text-black font-extrabold'
                          : score > 75
                          ? 'bg-indigo-600 text-white font-bold'
                          : score > 50
                          ? 'bg-indigo-900/80 text-indigo-200'
                          : 'bg-slate-900 text-slate-500';

                      return (
                        <div
                          key={hIdx}
                          title={`${day} at ${hours[hIdx]}: ${score}% engagement score`}
                          className={`h-7 rounded-md flex items-center justify-center text-[10px] transition-transform hover:scale-105 cursor-pointer ${bg}`}
                        >
                          {score}%
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span>Prime Publishing Recommendation:</span>
            <span className="font-extrabold text-cyan-400">Wednesday @ 18:00 UTC (100% Score)</span>
          </div>
        </div>
      </div>

      {/* Top Performing Content Ranking */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
            Top Performing Content Leaderboard
          </h2>
          <span className="text-xs text-slate-400">Ranked by Engagement & Conversion</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-extrabold uppercase text-slate-400">
                <th className="pb-3">Post Preview</th>
                <th className="pb-3">Networks</th>
                <th className="pb-3">Reach</th>
                <th className="pb-3">Reactions</th>
                <th className="pb-3">Clicks</th>
                <th className="pb-3 text-right">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-900/50 transition-colors">
                <td className="py-3 pr-4 max-w-sm">
                  <div className="font-semibold text-slate-100 truncate">
                    Excited to announce the next generation of Social Media Automation with SAMP!
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Published Oct 18 · Image Carousel</div>
                </td>
                <td className="py-3 pr-4">
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-900 border border-slate-800 text-slate-300">
                    IG · X · LI
                  </span>
                </td>
                <td className="py-3 pr-4 font-mono text-slate-300">84,920</td>
                <td className="py-3 pr-4 font-mono text-slate-300">4,120</td>
                <td className="py-3 pr-4 font-mono text-slate-300">1,280</td>
                <td className="py-3 text-right font-mono font-bold text-emerald-400">6.8%</td>
              </tr>
              <tr className="hover:bg-slate-900/50 transition-colors">
                <td className="py-3 pr-4 max-w-sm">
                  <div className="font-semibold text-slate-100 truncate">
                    Scaling your brand presence across 8 platforms without chaotic context switching.
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Published Oct 16 · Standard Update</div>
                </td>
                <td className="py-3 pr-4">
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-900 border border-slate-800 text-slate-300">
                    LI · FB
                  </span>
                </td>
                <td className="py-3 pr-4 font-mono text-slate-300">42,100</td>
                <td className="py-3 pr-4 font-mono text-slate-300">2,380</td>
                <td className="py-3 pr-4 font-mono text-slate-300">940</td>
                <td className="py-3 text-right font-mono font-bold text-emerald-400">5.9%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  ScheduledPost, 
  SocialPlatform, 
  PostStatus 
} from '../types';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Filter, 
  Plus, 
  Send, 
  CheckCircle, 
  ExternalLink,
  Trash2
} from 'lucide-react';

interface CalendarViewProps {
  posts: ScheduledPost[];
  onOpenComposer: () => void;
  onPublishNow: (id: string) => void;
  onDeletePost: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  posts,
  onOpenComposer,
  onPublishNow,
  onDeletePost
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    if (filterPlatform !== 'all' && !p.targetPlatforms.includes(filterPlatform as SocialPlatform)) {
      return false;
    }
    if (filterStatus !== 'all' && p.status !== filterStatus) {
      return false;
    }
    return true;
  });

  // Calculate days in current month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-400" />
            <span>Interactive Publishing Calendar</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualize your social schedule across days, weeks, and platforms with real-time execution.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            {(['month', 'week', 'list'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded text-xs font-bold capitalize transition-all ${
                  viewMode === mode
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenComposer}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0f172a] border border-slate-800 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-extrabold text-white min-w-[140px] text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Platform:</span>
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">All Channels</option>
              <option value="instagram">Instagram</option>
              <option value="twitter">Twitter / X</option>
              <option value="linkedin">LinkedIn</option>
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="queued">Queued</option>
            </select>
          </div>
        </div>
      </div>

      {/* MONTH VIEW */}
      {viewMode === 'month' && (
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-900/80 text-center py-2.5">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-800/80">
            {/* Blank leading slots */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`blank-${i}`} className="min-h-[110px] bg-slate-950/40 p-1.5"></div>
            ))}

            {/* Day slots */}
            {Array.from({ length: totalDays }).map((_, i) => {
              const dayNumber = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
              
              const dayPosts = filteredPosts.filter((p) => {
                const pDate = (p.publishedAt || p.scheduledFor).slice(0, 10);
                return pDate === dateStr;
              });

              const isToday =
                new Date().getDate() === dayNumber &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;

              return (
                <div
                  key={dayNumber}
                  className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors hover:bg-slate-900/40 ${
                    isToday ? 'bg-indigo-950/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                        isToday ? 'bg-indigo-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      {dayNumber}
                    </span>
                    {dayPosts.length > 0 && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {dayPosts.length} posts
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 overflow-y-auto max-h-[85px]">
                    {dayPosts.map((p) => (
                      <div
                        key={p.id}
                        className={`p-1.5 rounded-lg border text-[11px] leading-tight group relative ${
                          p.status === 'published'
                            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                            : 'bg-indigo-950/50 border-indigo-500/30 text-indigo-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono text-[9px] text-slate-400">
                            {new Date(p.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="capitalize text-[9px] font-bold">
                            {p.targetPlatforms[0]}
                          </span>
                        </div>
                        <div className="truncate mt-0.5 text-white/90">{p.content}</div>

                        {/* Hover action to publish now or delete */}
                        <div className="absolute inset-0 bg-slate-950/90 rounded-lg p-1 hidden group-hover:flex items-center justify-center gap-2">
                          {p.status === 'scheduled' && (
                            <button
                              onClick={() => onPublishNow(p.id)}
                              className="px-2 py-0.5 rounded text-[10px] bg-emerald-600 text-white font-bold"
                              title="Publish right now"
                            >
                              Dispatch
                            </button>
                          )}
                          <button
                            onClick={() => onDeletePost(p.id)}
                            className="p-1 rounded text-rose-400 hover:bg-rose-950"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
            Timeline of All Scheduled & Published Posts ({filteredPosts.length})
          </div>

          <div className="divide-y divide-slate-800/80">
            {filteredPosts.map((p) => (
              <div key={p.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  {p.media.length > 0 ? (
                    <img
                      src={p.media[0].url}
                      alt="Thumbnail"
                      className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-800"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 shrink-0 font-mono text-xs">
                      Text
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.status === 'published'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {p.status}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {new Date(p.scheduledFor).toLocaleString()}
                      </span>
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
                    </div>
                    <div className="text-xs text-slate-200 line-clamp-2 max-w-2xl">{p.content}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  {p.status === 'scheduled' && (
                    <button
                      onClick={() => onPublishNow(p.id)}
                      className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Send className="w-3 h-3" />
                      <span>Publish Now</span>
                    </button>
                  )}
                  <button
                    onClick={() => onDeletePost(p.id)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {viewMode === 'week' && (
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl text-center">
          <div className="text-xs font-bold text-slate-300 uppercase mb-2">7-Day Rolling Horizon</div>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
            Optimized view showing hourly dispatch pipeline and queuing distribution.
          </p>
          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map((day, idx) => (
              <div key={day} className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 min-h-[160px] text-left">
                <div className="text-xs font-bold text-slate-200">{day}</div>
                <div className="text-[10px] text-slate-400 mb-2">Queue Slots: 3</div>
                <div className="space-y-1.5">
                  <div className="p-1.5 rounded bg-indigo-950/60 border border-indigo-500/20 text-[10px] text-indigo-300">
                    09:00 - Morning Burst
                  </div>
                  <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800 text-[10px] text-slate-400">
                    14:30 - Midday Engage
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

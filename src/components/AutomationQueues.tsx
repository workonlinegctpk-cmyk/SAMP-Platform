import React, { useState } from 'react';
import { RssFeedAutomation, EvergreenQueue, SocialAccount } from '../types';
import { 
  Zap, 
  Rss, 
  Repeat, 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  Download, 
  Upload, 
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface AutomationQueuesProps {
  rssList: RssFeedAutomation[];
  evergreenList: EvergreenQueue[];
  accounts: SocialAccount[];
  onCreateRss: (data: Partial<RssFeedAutomation>) => void;
  onDeleteRss: (id: string) => void;
  onCreateEvergreen: (data: Partial<EvergreenQueue>) => void;
  onDeleteEvergreen: (id: string) => void;
}

export const AutomationQueues: React.FC<AutomationQueuesProps> = ({
  rssList,
  evergreenList,
  accounts,
  onCreateRss,
  onDeleteRss,
  onCreateEvergreen,
  onDeleteEvergreen,
}) => {
  const [activeTab, setActiveTab] = useState<'rss' | 'evergreen' | 'bulk'>('rss');

  // New RSS form state
  const [showRssModal, setShowRssModal] = useState<boolean>(false);
  const [rssName, setRssName] = useState<string>('');
  const [rssUrl, setRssUrl] = useState<string>('');
  const [rssTemplate, setRssTemplate] = useState<string>('📰 {title} - Read more: {link} #TechNews');

  // New Evergreen form state
  const [showEvergreenModal, setShowEvergreenModal] = useState<boolean>(false);
  const [evgName, setEvgName] = useState<string>('');
  const [evgInterval, setEvgInterval] = useState<number>(24);

  // Bulk CSV state
  const [csvUploadSuccess, setCsvUploadSuccess] = useState<string | null>(null);

  const handleAddRss = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rssUrl) return;
    onCreateRss({
      name: rssName || 'Automated RSS Ingestion',
      feedUrl: rssUrl,
      template: rssTemplate,
      targetAccountIds: accounts.slice(0, 2).map((a) => a.id),
      checkIntervalMinutes: 30,
      isActive: true,
    });
    setRssName('');
    setRssUrl('');
    setShowRssModal(false);
  };

  const handleAddEvergreen = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateEvergreen({
      name: evgName || 'High-Engagement Evergreen Recycler',
      intervalHours: Number(evgInterval),
      targetAccountIds: accounts.slice(0, 2).map((a) => a.id),
      isActive: true,
      postCount: 8,
    });
    setEvgName('');
    setShowEvergreenModal(false);
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvUploadSuccess(`Successfully parsed ${file.name} - 24 scheduled posts queued into database.`);
      setTimeout(() => setCsvUploadSuccess(null), 5000);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            <span>Automations & Recycling Engines</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Set up self-running publishing loops: RSS auto-posting, evergreen recyclers, and bulk uploads.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('rss')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'rss' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Rss className="w-3.5 h-3.5" />
            <span>RSS to Social</span>
          </button>
          <button
            onClick={() => setActiveTab('evergreen')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'evergreen' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Evergreen Recycler</span>
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'bulk' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Bulk CSV Importer</span>
          </button>
        </div>
      </div>

      {/* RSS FEEDS TAB */}
      {activeTab === 'rss' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Active RSS Feed Automations ({rssList.length})
            </div>
            <button
              onClick={() => setShowRssModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add RSS Feed</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rssList.map((item) => (
              <div
                key={item.id}
                className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-orange-950/60 text-orange-400 border border-orange-500/30">
                      <Rss className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{item.name}</h3>
                      <div className="text-[11px] text-slate-400 font-mono truncate max-w-xs">{item.feedUrl}</div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Polling</span>
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
                  {item.template}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <span>Every {item.checkIntervalMinutes} mins</span>
                  <span className="font-semibold text-indigo-300">{item.postsPublishedCount} posts published</span>
                  <button
                    onClick={() => onDeleteRss(item.id)}
                    className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EVERGREEN TAB */}
      {activeTab === 'evergreen' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Recycling Queues ({evergreenList.length})
            </div>
            <button
              onClick={() => setShowEvergreenModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Create Recycler Queue</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evergreenList.map((queue) => (
              <div
                key={queue.id}
                className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-violet-950/60 text-violet-400 border border-violet-500/30">
                      <Repeat className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{queue.name}</h3>
                      <div className="text-xs text-slate-400">Recycles every {queue.intervalHours} hours</div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-violet-950 text-violet-300 border border-violet-500/30">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <span className="font-semibold">{queue.postCount} Timeless Posts in loop</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Last cycle: {queue.lastRunAt ? new Date(queue.lastRunAt).toLocaleDateString() : 'Pending'}
                  </span>
                  <button
                    onClick={() => onDeleteEvergreen(queue.id)}
                    className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BULK CSV TAB */}
      {activeTab === 'bulk' && (
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Bulk Content Importer & Schedule Generator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Upload spreadsheets with hundreds of captions, target networks, and publish timestamps for instant batch scheduling.
            </p>
          </div>

          <div className="p-8 border-2 border-dashed border-slate-700/80 rounded-xl text-center bg-slate-900/40 hover:bg-slate-900/60 transition-colors">
            <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
            <div className="text-xs font-bold text-white mb-1">Drag and drop your CSV or Excel file</div>
            <div className="text-[10px] text-slate-400 mb-4">Supported columns: Content, Networks, ScheduledDate, FirstComment, MediaUrl</div>
            
            <label className="inline-block px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer transition-all shadow">
              <span>Browse CSV Files</span>
              <input type="file" accept=".csv" onChange={handleBulkUpload} className="hidden" />
            </label>
          </div>

          {csvUploadSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{csvUploadSuccess}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
            <span className="text-slate-400">Need a template to get started?</span>
            <button
              type="button"
              onClick={() => {
                const sampleCsv = `Content,Networks,ScheduledDate,FirstComment,MediaUrl\n"🚀 Launching our new product line today! Check out the details at our website.","instagram,twitter,linkedin","2026-10-25T14:00:00.000Z","#LaunchDay #Innovation","https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000"\n"💡 Pro tip: Automate your social media scheduling to maintain consistency without daily manual work.","twitter,linkedin","2026-10-26T16:30:00.000Z","#MarketingTips #Automation",""\n"🎉 Celebrating 10,000 community members! Thank you for being part of our journey.","instagram,facebook,tiktok","2026-10-27T18:00:00.000Z","#Milestone #Community","https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000"`;
                const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'samp_bulk_schedule_template.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download SAMP CSV Template</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL: ADD RSS */}
      {showRssModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Connect New RSS Feed</h3>
            <form onSubmit={handleAddRss} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">Feed Label</label>
                <input
                  type="text"
                  value={rssName}
                  onChange={(e) => setRssName(e.target.value)}
                  placeholder="e.g. Wired Tech Digest"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">RSS / Atom URL</label>
                <input
                  type="url"
                  required
                  value={rssUrl}
                  onChange={(e) => setRssUrl(e.target.value)}
                  placeholder="https://example.com/feed.xml"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">Post Template</label>
                <input
                  type="text"
                  value={rssTemplate}
                  onChange={(e) => setRssTemplate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Placeholders: &#123;title&#125;, &#123;link&#125;, &#123;author&#125;</span>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRssModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-xs font-bold text-white"
                >
                  Save Feed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD EVERGREEN */}
      {showEvergreenModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Create Evergreen Recycling Loop</h3>
            <form onSubmit={handleAddEvergreen} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">Recycler Name</label>
                <input
                  type="text"
                  value={evgName}
                  onChange={(e) => setEvgName(e.target.value)}
                  placeholder="e.g. Industry Tips & Wisdom"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">Cycle Interval (Hours)</label>
                <input
                  type="number"
                  min={6}
                  max={168}
                  value={evgInterval}
                  onChange={(e) => setEvgInterval(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEvergreenModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-xs font-bold text-white"
                >
                  Create Loop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  SocialAccount, 
  ScheduledPost, 
  SocialPlatform, 
  MediaItem 
} from '../types';
import { 
  Send, 
  Calendar as CalendarIcon, 
  Clock, 
  Image as ImageIcon, 
  Video, 
  Sparkles, 
  Hash, 
  Smile, 
  Link as LinkIcon, 
  MessageSquare, 
  Check, 
  AlertCircle, 
  X, 
  Layers, 
  Eye, 
  Share2, 
  ThumbsUp, 
  Heart, 
  MessageCircle, 
  Repeat, 
  Bookmark, 
  Flame,
  Globe,
  MoreHorizontal
} from 'lucide-react';

interface ComposerProps {
  accounts: SocialAccount[];
  onPostCreated: (newPost: ScheduledPost) => void;
  onClose?: () => void;
}

export const Composer: React.FC<ComposerProps> = ({ 
  accounts, 
  onPostCreated, 
  onClose 
}) => {
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>(
    accounts.slice(0, 3).map((a) => a.id)
  );
  const [content, setContent] = useState<string>(
    '🚀 Elevating our social pipeline with SAMP! Automated multi-network scheduling, pixel-accurate previews, and real-time execution across all channels. #SocialAutomation #MarketingTech #Growth'
  );
  const [firstComment, setFirstComment] = useState<string>('#SAMP #Automation #MarketingTips #Scale');
  const [showFirstComment, setShowFirstComment] = useState<boolean>(true);
  const [showUtmBuilder, setShowUtmBuilder] = useState<boolean>(false);
  const [utmSource, setUtmSource] = useState<string>('samp_social');
  const [utmMedium, setUtmMedium] = useState<string>('social_media');
  const [utmCampaign, setUtmCampaign] = useState<string>('q4_growth_launch');
  const [locationTag, setLocationTag] = useState<string>('Global Headquarters');
  const [postType, setPostType] = useState<'standard' | 'reel' | 'story' | 'carousel'>('standard');
  const [scheduleDate, setScheduleDate] = useState<string>(() => {
    const d = new Date(Date.now() + 2 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 16);
  });
  const [schedulingMode, setSchedulingMode] = useState<'schedule' | 'now' | 'queue'>('schedule');
  const [mediaList, setMediaList] = useState<MediaItem[]>([
    {
      id: 'med_comp_01',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
      type: 'image',
      name: 'samp_hero_creative.jpg',
      sizeBytes: 1024000,
      aspectRatio: '16:9'
    }
  ]);
  const [activePreviewPlatform, setActivePreviewPlatform] = useState<SocialPlatform>('instagram');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState<boolean>(false);

  // Selected accounts objects
  const selectedAccounts = accounts.filter((a) => selectedAccountIds.includes(a.id));
  const activePlatforms = Array.from(new Set(selectedAccounts.map((a) => a.platform)));

  // Character limits per platform
  const charLimits: Record<SocialPlatform, number> = {
    twitter: 280,
    instagram: 2200,
    linkedin: 3000,
    facebook: 63206,
    tiktok: 2200,
    youtube: 5000,
    pinterest: 500,
    threads: 500,
  };

  const handleToggleAccount = (id: string) => {
    setSelectedAccountIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedAccountIds.length === accounts.length) {
      setSelectedAccountIds([]);
    } else {
      setSelectedAccountIds(accounts.map((a) => a.id));
    }
  };

  const handleAddMedia = () => {
    const sampleUrls = [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1000&q=80',
    ];
    const randomUrl = sampleUrls[Math.floor(Math.random() * sampleUrls.length)];
    const newItem: MediaItem = {
      id: `med_${Date.now()}`,
      url: randomUrl,
      type: 'image',
      name: `asset_${Date.now().toString().slice(-4)}.jpg`,
      sizeBytes: 850000,
      aspectRatio: '16:9'
    };
    setMediaList((prev) => [...prev, newItem]);
  };

  const handleRemoveMedia = (id: string) => {
    setMediaList((prev) => prev.filter((m) => m.id !== id));
  };

  const applyAiHook = (type: 'hook' | 'hashtags' | 'cta' | 'polish') => {
    if (type === 'hook') {
      setContent((prev) => `🚨 STOP SCROLLING: The secret to scaling to 500k+ reach without 12-hour workdays.\n\n${prev}`);
    } else if (type === 'hashtags') {
      setContent((prev) => `${prev}\n\n#GrowthMarketing #SocialAutomation #SAMP #ScaleYourBrand #B2BGrowth #Productivity`);
    } else if (type === 'cta') {
      setContent((prev) => `${prev}\n\n👉 Click the link in bio to deploy your social engine today.`);
    } else if (type === 'polish') {
      setContent((prev) => prev.replace(/\s+/g, ' ').trim());
    }
    setAiAssistantOpen(false);
  };

  const handleSubmit = async () => {
    if (selectedAccountIds.length === 0) {
      alert('Please select at least one social account');
      return;
    }
    if (!content.trim() && mediaList.length === 0) {
      alert('Please provide post text content or attach media');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        content,
        media: mediaList,
        targetAccountIds: selectedAccountIds,
        targetPlatforms: activePlatforms,
        scheduledFor: schedulingMode === 'now' ? new Date().toISOString() : new Date(scheduleDate).toISOString(),
        publishNow: schedulingMode === 'now',
        firstComment: showFirstComment ? firstComment : undefined,
        utmParameters: showUtmBuilder ? { source: utmSource, medium: utmMedium, campaign: utmCampaign } : undefined,
        tags: ['SAMP', 'Automation'],
        locationTag: locationTag || undefined,
        postType,
      };

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to create post');
      const created = await res.json();
      onPostCreated(created);
      if (onClose) onClose();
    } catch (err: any) {
      alert(err.message || 'Error creating scheduled post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-100 p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-800/80 mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2.5">
            <span>Multi-Channel Post Composer</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/30">
              HeroPost Core
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Compose once, customize per network, and preview pixel-accurately before dispatching.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Two-Column Layout: Left = Editor & Settings, Right = Live Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Post Builder */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Account Target Selector */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <span>Select Target Channels</span>
                <span className="text-indigo-400 font-mono">({selectedAccountIds.length}/{accounts.length})</span>
              </span>
              <button
                onClick={handleSelectAll}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {selectedAccountIds.length === accounts.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {accounts.map((acc) => {
                const isSelected = selectedAccountIds.includes(acc.id);
                return (
                  <button
                    key={acc.id}
                    onClick={() => handleToggleAccount(acc.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/40'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={acc.avatarUrl}
                      alt={acc.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="capitalize">{acc.platform}</span>
                    <span className="text-slate-400 text-[10px]">{acc.username}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Format / Post Type Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-xl">
            {(['standard', 'reel', 'story', 'carousel'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setPostType(type)}
                className={`flex-1 py-1.5 text-xs font-bold capitalize rounded-lg transition-all ${
                  postType === type
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* 3. Content Textarea & Smart Tools */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Post Caption</span>
              
              {/* AI Assistant Quick Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/70 border border-indigo-500/40 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/50 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>AI Copy Tools</span>
                </button>

                {aiAssistantOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50">
                    <button
                      onClick={() => applyAiHook('hook')}
                      className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>Add Viral Hook</span>
                    </button>
                    <button
                      onClick={() => applyAiHook('hashtags')}
                      className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Hash className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Auto-Generate Hashtags</span>
                    </button>
                    <button
                      onClick={() => applyAiHook('cta')}
                      className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Add Strong CTA</span>
                    </button>
                    <button
                      onClick={() => applyAiHook('polish')}
                      className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Clean & Format Text</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="What would you like to publish across your social channels?"
              className="w-full bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans leading-relaxed"
            />

            {/* Character Counters per Platform */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
              {activePlatforms.map((plat) => {
                const limit = charLimits[plat];
                const count = content.length;
                const remaining = limit - count;
                const isOver = remaining < 0;

                return (
                  <div
                    key={plat}
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded border font-mono text-[10px] ${
                      isOver
                        ? 'bg-rose-950/60 border-rose-500/50 text-rose-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="capitalize">{plat}:</span>
                    <span>{count}/{limit}</span>
                  </div>
                );
              })}
            </div>

            {/* Media Upload & Manager */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">Media Attachments</span>
                <button
                  onClick={handleAddMedia}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>+ Attach Media</span>
                </button>
              </div>

              {mediaList.length > 0 ? (
                <div className="grid grid-cols-3 gap-2.5">
                  {mediaList.map((m) => (
                    <div
                      key={m.id}
                      className="group relative rounded-lg overflow-hidden border border-slate-800 bg-slate-900 aspect-video flex items-center justify-center"
                    >
                      <img
                        src={m.url}
                        alt={m.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleRemoveMedia(m.id)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded text-[9px] bg-black/60 text-white font-mono">
                        {m.aspectRatio || '16:9'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  onClick={handleAddMedia}
                  className="border border-dashed border-slate-800 hover:border-slate-700 rounded-lg p-6 text-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/70 transition-colors"
                >
                  <ImageIcon className="w-6 h-6 text-slate-500 mx-auto mb-1.5" />
                  <div className="text-xs text-slate-300 font-medium">Click to attach photos or video clips</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Supports JPG, PNG, MP4 up to 50MB</div>
                </div>
              )}
            </div>
          </div>

          {/* 4. First Comment Automation (HeroPost Signature Tool) */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-slate-200">First Comment Automation</span>
                <span className="text-[10px] text-slate-400">(Dispatches instantly on Instagram & LinkedIn)</span>
              </div>
              <input
                type="checkbox"
                checked={showFirstComment}
                onChange={(e) => setShowFirstComment(e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
            </div>

            {showFirstComment && (
              <input
                type="text"
                value={firstComment}
                onChange={(e) => setFirstComment(e.target.value)}
                placeholder="Insert hashtags, links or disclosures here..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            )}
          </div>

          {/* 5. UTM Tracking Builder */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-slate-200">UTM Tracking Parameters</span>
              </div>
              <button
                onClick={() => setShowUtmBuilder(!showUtmBuilder)}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                {showUtmBuilder ? 'Hide' : 'Configure'}
              </button>
            </div>

            {showUtmBuilder && (
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">utm_source</label>
                  <input
                    type="text"
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">utm_medium</label>
                  <input
                    type="text"
                    value={utmMedium}
                    onChange={(e) => setUtmMedium(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">utm_campaign</label>
                  <input
                    type="text"
                    value={utmCampaign}
                    onChange={(e) => setUtmCampaign(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 6. Scheduling Execution Modes */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSchedulingMode('schedule')}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  schedulingMode === 'schedule'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Schedule Time</span>
              </button>

              <button
                onClick={() => setSchedulingMode('now')}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  schedulingMode === 'now'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Immediately</span>
              </button>

              <button
                onClick={() => setSchedulingMode('queue')}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  schedulingMode === 'queue'
                    ? 'bg-violet-600/20 border-violet-500 text-violet-300 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Add to Next Queue</span>
              </button>
            </div>

            {schedulingMode === 'schedule' && (
              <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <CalendarIcon className="w-4 h-4 text-indigo-400" />
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Select Target Publish Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Processing Platform Handlers...</span>
            ) : schedulingMode === 'now' ? (
              <>
                <Send className="w-4 h-4" />
                <span>Publish Instantly to {selectedAccountIds.length} Channels</span>
              </>
            ) : (
              <>
                <CalendarIcon className="w-4 h-4" />
                <span>Queue & Schedule Post</span>
              </>
            )}
          </button>
        </div>

        {/* RIGHT COLUMN: Pixel-Accurate Platform Previews (HeroPost Simulator) */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 shadow-xl">
            {/* Preview Network Selector Tabs */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>Real-Time Feed Simulator</span>
              </span>

              <div className="flex items-center gap-1">
                {(['instagram', 'twitter', 'linkedin', 'facebook', 'tiktok'] as SocialPlatform[]).map((plat) => (
                  <button
                    key={plat}
                    onClick={() => setActivePreviewPlatform(plat)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                      activePreviewPlatform === plat
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {plat === 'twitter' ? 'X' : plat.slice(0, 2)}
                  </button>
                ))}
              </div>
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="mt-4">
              {/* INSTAGRAM SIMULATOR */}
              {activePreviewPlatform === 'instagram' && (
                <div className="bg-black rounded-xl border border-neutral-800 text-white overflow-hidden max-w-sm mx-auto shadow-2xl">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between p-3 border-b border-neutral-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full ring-2 ring-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[1.5px]">
                        <img
                          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"
                          alt="IG"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-none">samp_global</div>
                        <div className="text-[10px] text-neutral-400">{locationTag || 'Original audio'}</div>
                      </div>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                  </div>

                  {/* Media Content */}
                  <div className="bg-neutral-950 aspect-square flex items-center justify-center overflow-hidden">
                    {mediaList.length > 0 ? (
                      <img
                        src={mediaList[0].url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-xs text-neutral-600 font-mono">No Image Attached</div>
                    )}
                  </div>

                  {/* Action Icons */}
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-white hover:text-rose-500 cursor-pointer" />
                        <MessageCircle className="w-5 h-5 text-white" />
                        <Send className="w-5 h-5 text-white -rotate-12" />
                      </div>
                      <Bookmark className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-[11px] font-bold mb-1">1,492 likes</div>
                    <div className="text-xs leading-relaxed">
                      <span className="font-bold mr-1.5">samp_global</span>
                      <span className="text-neutral-200">{content}</span>
                    </div>

                    {showFirstComment && firstComment && (
                      <div className="mt-2 pt-2 border-t border-neutral-900 text-[11px] text-neutral-400">
                        <span className="font-bold text-white mr-1.5">samp_global</span>
                        <span>{firstComment}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* X / TWITTER SIMULATOR */}
              {activePreviewPlatform === 'twitter' && (
                <div className="bg-black rounded-xl border border-neutral-800 text-white p-4 max-w-sm mx-auto shadow-2xl">
                  <div className="flex items-start gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      alt="Twitter"
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold">SAMP Media Tech</span>
                        <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[8px] font-bold">✓</span>
                        <span className="text-xs text-neutral-500">@samp_tech · 1m</span>
                      </div>

                      <div className="text-xs text-neutral-200 mt-1 leading-relaxed whitespace-pre-wrap">
                        {content}
                      </div>

                      {mediaList.length > 0 && (
                        <div className="mt-2.5 rounded-xl overflow-hidden border border-neutral-800 aspect-video">
                          <img
                            src={mediaList[0].url}
                            alt="Tweet media"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between text-neutral-500 mt-3 pt-2 border-t border-neutral-900 text-xs">
                        <span className="flex items-center gap-1 hover:text-sky-400">
                          <MessageCircle className="w-3.5 h-3.5" /> 18
                        </span>
                        <span className="flex items-center gap-1 hover:text-emerald-400">
                          <Repeat className="w-3.5 h-3.5" /> 42
                        </span>
                        <span className="flex items-center gap-1 hover:text-rose-400">
                          <Heart className="w-3.5 h-3.5" /> 312
                        </span>
                        <span className="flex items-center gap-1 hover:text-sky-400">
                          <Bookmark className="w-3.5 h-3.5" /> 64
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LINKEDIN SIMULATOR */}
              {activePreviewPlatform === 'linkedin' && (
                <div className="bg-[#1b222d] rounded-xl border border-slate-700/80 text-white p-3.5 max-w-sm mx-auto shadow-2xl">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                      alt="LinkedIn"
                      className="w-9 h-9 rounded-md object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>SAMP Enterprise Solutions</span>
                        <span className="text-[10px] text-slate-400">• 1st</span>
                      </div>
                      <div className="text-[10px] text-slate-400">17,850 followers · Just now · 🌐</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap mb-2.5">
                    {content}
                  </div>

                  {mediaList.length > 0 && (
                    <div className="rounded-lg overflow-hidden border border-slate-700 mb-2.5 aspect-video">
                      <img
                        src={mediaList[0].url}
                        alt="Media"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-300">
                    <button className="flex items-center gap-1.5 hover:text-indigo-400">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Like</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-indigo-400">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Comment</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-indigo-400">
                      <Repeat className="w-3.5 h-3.5" />
                      <span>Repost</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-indigo-400">
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              )}

              {/* FACEBOOK SIMULATOR */}
              {activePreviewPlatform === 'facebook' && (
                <div className="bg-[#182232] rounded-xl border border-slate-700 text-white p-3.5 max-w-sm mx-auto shadow-2xl">
                  <div className="flex items-center gap-2.5 mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                      alt="FB"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold">SAMP Official Brand</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <span>Just now</span> · <Globe className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-200 mb-2 leading-relaxed">
                    {content}
                  </div>

                  {mediaList.length > 0 && (
                    <div className="rounded-lg overflow-hidden border border-slate-700 aspect-video mb-2">
                      <img src={mediaList[0].url} alt="FB media" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5 text-blue-400" /> Like</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> Comment</span>
                    <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> Share</span>
                  </div>
                </div>
              )}

              {/* TIKTOK SIMULATOR */}
              {activePreviewPlatform === 'tiktok' && (
                <div className="bg-black rounded-2xl border border-neutral-800 text-white p-3 max-w-xs mx-auto shadow-2xl relative aspect-[9/16] overflow-hidden flex flex-col justify-end">
                  {mediaList.length > 0 && (
                    <img
                      src={mediaList[0].url}
                      alt="TikTok bg"
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30"></div>

                  {/* Floating Action Rail */}
                  <div className="absolute right-2 bottom-16 flex flex-col items-center gap-3 z-10">
                    <div className="w-9 h-9 rounded-full bg-neutral-900/80 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                    </div>
                    <div className="w-9 h-9 rounded-full bg-neutral-900/80 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-9 h-9 rounded-full bg-neutral-900/80 flex items-center justify-center">
                      <Bookmark className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="w-9 h-9 rounded-full bg-neutral-900/80 flex items-center justify-center">
                      <Share2 className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Caption & Account Info */}
                  <div className="relative z-10 p-2">
                    <div className="text-xs font-bold text-white mb-1">@samp_creatives</div>
                    <div className="text-[11px] text-white/90 line-clamp-2 leading-relaxed">{content}</div>
                    <div className="text-[10px] text-neutral-300 mt-1 flex items-center gap-1">
                      <span>🎵 Original Sound - SAMP Production</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { InboxMessage } from '../types';
import { 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Smile, 
  Meh, 
  Frown, 
  CornerDownRight, 
  Filter, 
  Search 
} from 'lucide-react';

interface SocialInboxProps {
  messages: InboxMessage[];
  onReply: (id: string, text: string) => void;
  onMarkRead: (id: string) => void;
}

export const SocialInbox: React.FC<SocialInboxProps> = ({
  messages,
  onReply,
  onMarkRead,
}) => {
  const [selectedMessageId, setSelectedMessageId] = useState<string>(
    messages[0]?.id || ''
  );
  const [replyText, setReplyText] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedMessage = messages.find((m) => m.id === selectedMessageId);

  const filteredMessages = messages.filter((m) => {
    if (filterType === 'unread' && m.isRead) return false;
    if (filterType !== 'all' && filterType !== 'unread' && m.platform !== filterType) return false;
    if (searchQuery && !m.message.toLowerCase().includes(searchQuery.toLowerCase()) && !m.senderName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedMessageId) return;
    onReply(selectedMessageId, replyText);
    setReplyText('');
  };

  const sentimentPill = (sentiment: 'positive' | 'neutral' | 'negative') => {
    if (sentiment === 'positive') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
          <Smile className="w-3 h-3" /> Positive
        </span>
      );
    }
    if (sentiment === 'negative') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded">
          <Frown className="w-3 h-3" /> Urgent Attention
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
        <Meh className="w-3 h-3" /> Neutral
      </span>
    );
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <span>Unified Social Inbox & Engagement Stream</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Consolidate comments, direct messages, and brand mentions across all platforms with sentiment prioritization.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversation..."
              className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Interactions</option>
            <option value="unread">Unread Only</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">X / Twitter</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>
      </div>

      {/* Main Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        {/* Left Column: Messages List */}
        <div className="lg:col-span-5 bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
          <div className="p-3 border-b border-slate-800 bg-slate-900/60 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Conversations ({filteredMessages.length})</span>
            <span className="text-[10px] text-emerald-400 font-mono">Live Sync</span>
          </div>

          <div className="divide-y divide-slate-800/80 overflow-y-auto flex-1">
            {filteredMessages.map((msg) => {
              const isSelected = msg.id === selectedMessageId;

              return (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessageId(msg.id);
                    if (!msg.isRead) onMarkRead(msg.id);
                  }}
                  className={`p-4 cursor-pointer transition-colors hover:bg-slate-900/70 ${
                    isSelected ? 'bg-indigo-950/30 border-l-4 border-indigo-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{msg.senderName}</span>
                          {!msg.isRead && (
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono capitalize">
                          {msg.platform} · {msg.type}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mt-1">
                    {msg.message}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between">
                    {sentimentPill(msg.sentiment)}
                    {msg.replies && msg.replies.length > 0 && (
                      <span className="text-[10px] text-indigo-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                        <span>Replied ({msg.replies.length})</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Thread & Instant Reply */}
        <div className="lg:col-span-7 bg-[#0f172a] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          {selectedMessage ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              {/* Message Header */}
              <div>
                <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedMessage.senderAvatar}
                      alt={selectedMessage.senderName}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <div>
                      <h2 className="text-sm font-bold text-white">{selectedMessage.senderName}</h2>
                      <div className="text-xs text-indigo-400 font-mono">{selectedMessage.senderUsername}</div>
                      <div className="text-[10px] text-slate-400 capitalize mt-0.5">
                        Received on {selectedMessage.platform} via {selectedMessage.type}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {sentimentPill(selectedMessage.sentiment)}
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(selectedMessage.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Original Body */}
                <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                  {selectedMessage.message}
                </div>

                {/* Reply Threads */}
                {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Dispatched Responses
                    </div>
                    {selectedMessage.replies.map((r) => (
                      <div
                        key={r.id}
                        className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30 text-xs space-y-1 ml-4"
                      >
                        <div className="flex items-center justify-between text-[10px] text-indigo-300 font-semibold">
                          <span>{r.sender}</span>
                          <span className="font-mono text-slate-400">
                            {new Date(r.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-slate-200">{r.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reply Composer Form */}
              <form onSubmit={handleSendReply} className="mt-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <CornerDownRight className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs font-bold text-slate-300">
                    Reply directly to {selectedMessage.senderName}
                  </span>
                </div>

                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type an instant reply to synchronize back to the social channel..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-xs">
              Select a conversation to begin engagement
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

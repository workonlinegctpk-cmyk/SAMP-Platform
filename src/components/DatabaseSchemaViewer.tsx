import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Copy, 
  Check, 
  Table, 
  Key, 
  FileCode, 
  ShieldCheck, 
  Server, 
  Activity 
} from 'lucide-react';

export const DatabaseSchemaViewer: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const [ddlCode, setDdlCode] = useState<string>('');
  const [selectedTable, setSelectedTable] = useState<string>('scheduled_posts');

  useEffect(() => {
    fetch('/api/schema')
      .then((res) => res.json())
      .then((data) => {
        if (data.ddl) setDdlCode(data.ddl);
      })
      .catch((err) => console.error('Failed to load DDL:', err));
  }, []);

  const tables = [
    {
      name: 'scheduled_posts',
      description: 'Core scheduler state machine managing draft, queued, scheduled, publishing, published, and failed lifecycle states.',
      columns: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'Unique post identifier' },
        { name: 'workspace_id', type: 'UUID', key: 'FK', desc: 'Workspace isolation' },
        { name: 'content', type: 'TEXT', key: '', desc: 'Post caption text' },
        { name: 'post_type', type: 'VARCHAR(50)', key: '', desc: 'standard, reel, story, carousel' },
        { name: 'status', type: 'post_status', key: 'IDX', desc: 'scheduled, published, failed' },
        { name: 'scheduled_for', type: 'TIMESTAMPTZ', key: 'IDX', desc: 'Real-time execution timestamp' },
        { name: 'published_at', type: 'TIMESTAMPTZ', key: '', desc: 'Successful delivery timestamp' },
        { name: 'first_comment', type: 'TEXT', key: '', desc: 'Auto-posted first comment' },
        { name: 'utm_parameters', type: 'JSONB', key: '', desc: 'source, medium, campaign' },
      ],
      indexes: [
        'idx_posts_scheduler_due ON scheduled_posts (scheduled_for ASC) WHERE status IN (\'scheduled\', \'queued\')',
        'idx_posts_workspace_status_date ON scheduled_posts (workspace_id, status, scheduled_for DESC)'
      ]
    },
    {
      name: 'social_accounts',
      description: 'Encrypted OAuth access tokens, refresh tokens, permissions, and channel metadata.',
      columns: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'Account identifier' },
        { name: 'workspace_id', type: 'UUID', key: 'FK', desc: 'Target workspace' },
        { name: 'platform', type: 'platform_type', key: '', desc: 'instagram, twitter, linkedin, etc.' },
        { name: 'account_type', type: 'VARCHAR(50)', key: '', desc: 'page, profile, channel, business' },
        { name: 'name', type: 'VARCHAR(255)', key: '', desc: 'Channel name' },
        { name: 'username', type: 'VARCHAR(255)', key: '', desc: 'Social handle' },
        { name: 'access_token', type: 'TEXT', key: '', desc: 'Encrypted token' },
        { name: 'token_expires_at', type: 'TIMESTAMPTZ', key: 'IDX', desc: 'Token expiration date' },
        { name: 'status', type: 'account_status', key: '', desc: 'active, expired, rate_limited' },
      ],
      indexes: [
        'idx_accounts_status_token ON social_accounts (status, token_expires_at)'
      ]
    },
    {
      name: 'publishing_delivery_logs',
      description: 'Auditing and diagnostics log recording HTTP status codes, latency, and platform URLs for each dispatch.',
      columns: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'Log ID' },
        { name: 'post_id', type: 'UUID', key: 'FK', desc: 'Target post' },
        { name: 'account_id', type: 'UUID', key: 'FK', desc: 'Target account' },
        { name: 'platform', type: 'platform_type', key: '', desc: 'Platform executed' },
        { name: 'status', type: 'VARCHAR(50)', key: '', desc: 'success, failed' },
        { name: 'platform_post_id', type: 'VARCHAR(255)', key: '', desc: 'Remote network post ID' },
        { name: 'latency_ms', type: 'INT', key: '', desc: 'API execution latency' },
        { name: 'executed_at', type: 'TIMESTAMPTZ', key: '', desc: 'Execution timestamp' },
      ],
      indexes: [
        'idx_delivery_logs_post_status ON publishing_delivery_logs (post_id, status)'
      ]
    },
    {
      name: 'post_media',
      description: 'Media attachments supporting images, reels, carousels, aspect ratios, and file sizes.',
      columns: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'Media ID' },
        { name: 'post_id', type: 'UUID', key: 'FK', desc: 'Parent post' },
        { name: 'media_url', type: 'TEXT', key: '', desc: 'Storage asset URL' },
        { name: 'media_type', type: 'media_type', key: '', desc: 'image, video, gif' },
        { name: 'file_size_bytes', type: 'BIGINT', key: '', desc: 'Payload size' },
        { name: 'order_index', type: 'INT', key: '', desc: 'Carousel sequence index' },
      ],
      indexes: []
    },
    {
      name: 'inbox_messages',
      description: 'Cross-channel stream of mentions, DMs, and comments with real-time sentiment scoring.',
      columns: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'Message ID' },
        { name: 'workspace_id', type: 'UUID', key: 'FK', desc: 'Workspace ID' },
        { name: 'account_id', type: 'UUID', key: 'FK', desc: 'Source account' },
        { name: 'platform', type: 'platform_type', key: '', desc: 'Source network' },
        { name: 'sender_name', type: 'VARCHAR(255)', key: '', desc: 'Sender author' },
        { name: 'sentiment', type: 'VARCHAR(20)', key: '', desc: 'positive, neutral, negative' },
        { name: 'is_read', type: 'BOOLEAN', key: 'IDX', desc: 'Read state' },
      ],
      indexes: [
        'idx_inbox_unread ON inbox_messages (workspace_id, is_read, received_at DESC)'
      ]
    }
  ];

  const handleCopyDdl = () => {
    navigator.clipboard.writeText(ddlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const activeTable = tables.find((t) => t.name === selectedTable) || tables[0];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <span>Robust PostgreSQL Scheduling Schema</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Designed for high-concurrency real-time multi-network scheduling, partial retries, and analytics aggregation.
          </p>
        </div>

        <button
          onClick={handleCopyDdl}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30"
        >
          {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied schema.sql' : 'Copy Full schema.sql'}</span>
        </button>
      </div>

      {/* Schema Highlights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-indigo-400 mb-1">
            <Server className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Engine Compatibility</span>
          </div>
          <div className="text-lg font-extrabold text-white">PostgreSQL 14+ / Supabase</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Standard ACID compliance with native JSONB, UUIDs, and partial scheduling indexes.
          </p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Sub-Millisecond Polling</span>
          </div>
          <div className="text-lg font-extrabold text-white">Filtered Partial Index</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Indexes only active upcoming posts (`WHERE status IN ('scheduled', 'queued')`).
          </p>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Audit & Delivery Resilience</span>
          </div>
          <div className="text-lg font-extrabold text-white">Per-Channel Execution Logs</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Tracks individual network response codes, latency ms, and retry backoffs.
          </p>
        </div>
      </div>

      {/* Interactive Table Explorer & DDL Code */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table Selector Column */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Database Entities ({tables.length})
          </div>
          {tables.map((t) => (
            <button
              key={t.name}
              onClick={() => setSelectedTable(t.name)}
              className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all flex items-center justify-between ${
                selectedTable === t.name
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/50'
                  : 'bg-[#0f172a] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Table className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-bold">{t.name}</span>
              </div>
              <span className="text-[10px] text-slate-500">{t.columns.length} cols</span>
            </button>
          ))}
        </div>

        {/* Selected Table Columns & Indexes */}
        <div className="lg:col-span-8 bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-start justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-mono font-extrabold text-white">{activeTable.name}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                  Table
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {activeTable.description}
              </p>
            </div>
          </div>

          {/* Columns Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-bold uppercase text-slate-400">
                  <th className="pb-2">Column</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Key / Index</th>
                  <th className="pb-2">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-[11px]">
                {activeTable.columns.map((col) => (
                  <tr key={col.name} className="hover:bg-slate-900/40">
                    <td className="py-2.5 font-bold text-slate-200">{col.name}</td>
                    <td className="py-2.5 text-indigo-300">{col.type}</td>
                    <td className="py-2.5">
                      {col.key === 'PK' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-950 text-amber-300 border border-amber-500/40 font-bold">
                          PRIMARY
                        </span>
                      )}
                      {col.key === 'FK' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-sky-950 text-sky-300 border border-sky-500/40 font-bold">
                          FOREIGN
                        </span>
                      )}
                      {col.key === 'IDX' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                          INDEX
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 text-slate-400 font-sans">{col.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dedicated Indexes */}
          {activeTable.indexes.length > 0 && (
            <div className="pt-3 border-t border-slate-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Specialized Indexes on this table:
              </span>
              {activeTable.indexes.map((idx, i) => (
                <div key={i} className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10px] text-emerald-400">
                  CREATE INDEX {idx};
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Raw DDL Viewer */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Raw Production schema.sql DDL
            </h3>
          </div>
          <button
            onClick={handleCopyDdl}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold"
          >
            {copied ? 'Copied' : 'Copy All'}
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-72 leading-relaxed">
          {ddlCode || '-- Loading schema.sql...'}
        </pre>
      </div>
    </div>
  );
};

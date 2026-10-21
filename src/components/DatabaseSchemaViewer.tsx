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
  Activity,
  Layers,
  Sparkles,
  Flame,
  CheckCircle2
} from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';

export const DatabaseSchemaViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'firestore' | 'postgres'>('firestore');
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedRules, setCopiedRules] = useState<boolean>(false);
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

  const firestoreCollections = [
    {
      name: 'accounts',
      path: '/accounts/{accountId}',
      description: 'Connected social panel accounts (Instagram, Twitter/X, Facebook, LinkedIn, TikTok, YouTube, Threads, Pinterest).',
      fields: ['id', 'userId', 'platform', 'name', 'username', 'accountType', 'status', 'followersCount', 'connectedAt', 'tokenExpiresAt'],
      security: 'Owned by request.auth.uid. Validates schema and ID format.'
    },
    {
      name: 'posts',
      path: '/posts/{postId}',
      description: 'Scheduled, queued, and published posts with media, target accounts, tags, and delivery logs.',
      fields: ['id', 'userId', 'content', 'targetAccountIds', 'targetPlatforms', 'status', 'scheduledFor', 'publishedAt', 'createdAt', 'updatedAt'],
      security: 'Owned by request.auth.uid. Enforces immutable creation timestamps and status enums.'
    },
    {
      name: 'users',
      path: '/users/{userId}',
      description: 'User profiles generated via Google Authentication or email signup.',
      fields: ['id', 'name', 'email', 'role', 'company', 'workspaceName', 'avatarUrl', 'createdAt'],
      security: 'Read/write restricted to request.auth.uid == userId.'
    },
    {
      name: 'rssAutomations',
      path: '/rssAutomations/{rssId}',
      description: 'RSS-to-social publishing streams and interval checking automations.',
      fields: ['id', 'userId', 'name', 'feedUrl', 'targetAccountIds', 'template', 'isActive', 'checkIntervalMinutes'],
      security: 'Owned by request.auth.uid.'
    },
    {
      name: 'evergreenQueues',
      path: '/evergreenQueues/{queueId}',
      description: 'Recurring content publishing recycling queues.',
      fields: ['id', 'userId', 'name', 'targetAccountIds', 'intervalHours', 'isActive', 'postCount'],
      security: 'Owned by request.auth.uid.'
    },
    {
      name: 'inboxMessages',
      path: '/inboxMessages/{messageId}',
      description: 'Social inbox mentions, comments, and direct messages across linked channels.',
      fields: ['id', 'userId', 'accountId', 'platform', 'senderName', 'message', 'timestamp', 'isRead', 'replies'],
      security: 'Owned by request.auth.uid.'
    }
  ];

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
    }
  ];

  const handleCopyDdl = () => {
    navigator.clipboard.writeText(ddlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeTable = tables.find((t) => t.name === selectedTable) || tables[0];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <span>Database Architecture & Cloud Engine</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cloud Firestore real-time NoSQL database engine alongside relational PostgreSQL schema.
          </p>
        </div>

        {/* Engine Switcher */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('firestore')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'firestore'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Firebase Firestore (Active)</span>
          </button>
          <button
            onClick={() => setActiveTab('postgres')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'postgres'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>PostgreSQL Schema DDL</span>
          </button>
        </div>
      </div>

      {activeTab === 'firestore' ? (
        /* FIREBASE FIRESTORE CLOUD DATABASE VIEW */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Active Cloud Config Banner */}
          <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Provisioned & Deployed</span>
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Asia Southeast Region</span>
                </div>
                <h2 className="text-base font-bold text-white">
                  Google Cloud Firestore Database
                </h2>
                <div className="text-xs text-slate-400 font-mono mt-1 space-y-0.5">
                  <div>Project ID: <span className="text-indigo-300 font-bold">{firebaseConfig.projectId}</span></div>
                  <div>Database ID: <span className="text-indigo-300 font-bold">{firebaseConfig.firestoreDatabaseId}</span></div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-xs font-bold text-emerald-400">Google Auth</div>
                  <div className="text-[10px] text-slate-400">OAuth Popup</div>
                </div>
                <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-xs font-bold text-indigo-400">Zero-Trust ABAC</div>
                  <div className="text-[10px] text-slate-400">Strict Rules Active</div>
                </div>
              </div>
            </div>
          </div>

          {/* Collections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {firestoreCollections.map((col) => (
              <div
                key={col.name}
                className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-sm font-bold text-white font-mono">{col.path}</h3>
                    <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                      Collection
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {col.description}
                  </p>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Indexed Document Fields:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {col.fields.map((f) => (
                        <span key={f} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[10px] text-emerald-400 font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>{col.security}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* RELATIONAL POSTGRESQL DDL VIEW */
        <div className="space-y-6 animate-in fade-in duration-200">
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
                <span className="text-xs font-bold uppercase tracking-wider">High-Concurrency Scheduling</span>
              </div>
              <div className="text-lg font-extrabold text-white">Zero Deadlock Execution</div>
              <p className="text-[11px] text-slate-400 mt-1">
                Optimized for FOR UPDATE SKIP LOCKED worker queues and cron microservices.
              </p>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-violet-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Security & Tokens</span>
              </div>
              <div className="text-lg font-extrabold text-white">Multi-Tenant Isolation</div>
              <p className="text-[11px] text-slate-400 mt-1">
                Foreign-keyed workspace scoping preventing cross-account access.
              </p>
            </div>
          </div>

          {/* Interactive Table Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 bg-[#0f172a] border border-slate-800 rounded-2xl p-4 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-2 mb-2">
                Relational Tables ({tables.length})
              </span>
              {tables.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setSelectedTable(t.name)}
                  className={`w-full text-left p-3 rounded-xl transition-all border ${
                    selectedTable === t.name
                      ? 'bg-indigo-600/15 border-indigo-500/50 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-indigo-400">{t.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({t.columns.length} cols)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{t.description}</p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-mono text-sm font-extrabold text-white">{activeTable.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{activeTable.description}</p>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-slate-900 text-indigo-300 border border-slate-800">
                  {activeTable.columns.length} Columns · {activeTable.indexes.length} Indexes
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800/80 text-[10px] uppercase">
                      <th className="pb-2">Column</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Key / Constraint</th>
                      <th className="pb-2">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {activeTable.columns.map((col) => (
                      <tr key={col.name} className="hover:bg-slate-800/30">
                        <td className="py-2.5 text-white font-bold">{col.name}</td>
                        <td className="py-2.5 text-indigo-400">{col.type}</td>
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
      )}
    </div>
  );
};

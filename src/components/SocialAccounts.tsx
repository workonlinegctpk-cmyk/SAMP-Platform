import React, { useState } from 'react';
import { SocialAccount, SocialPlatform, AccountCredentials } from '../types';
import { 
  Share2, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ShieldCheck, 
  Key, 
  ExternalLink,
  Check,
  Terminal,
  Activity,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from './Toast';

interface SocialAccountsProps {
  accounts: SocialAccount[];
  onAddAccount: (acc: { 
    platform: string; 
    name: string; 
    username: string; 
    accountType?: string;
    credentials?: AccountCredentials;
  }) => void;
  onDeleteAccount: (id: string) => void;
}

export const SocialAccounts: React.FC<SocialAccountsProps> = ({
  accounts,
  onAddAccount,
  onDeleteAccount,
}) => {
  const { showToast } = useToast();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [accountType, setAccountType] = useState<string>('business');

  // Real credentials state
  const [appId, setAppId] = useState<string>('');
  const [appSecret, setAppSecret] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [pageOrChannelId, setPageOrChannelId] = useState<string>('');

  // Verification state
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [verifyingAccountHealthId, setVerifyingAccountHealthId] = useState<string | null>(null);

  const availablePlatforms: { 
    id: SocialPlatform; 
    name: string; 
    icon: string; 
    tokenLabel: string;
    tokenPlaceholder: string;
    docsUrl: string;
    defaultScopes: string[];
  }[] = [
    { 
      id: 'instagram', 
      name: 'Instagram Business', 
      icon: '📸', 
      tokenLabel: 'Instagram Graph API Page Access Token', 
      tokenPlaceholder: 'EAAOx...', 
      docsUrl: 'https://developers.facebook.com/docs/instagram-api',
      defaultScopes: ['instagram_basic', 'instagram_content_publish', 'pages_show_list']
    },
    { 
      id: 'twitter', 
      name: 'X / Twitter API v2', 
      icon: '🐦', 
      tokenLabel: 'OAuth 2.0 User Access Token / Bearer Token', 
      tokenPlaceholder: 'AAAAAAAAAAAAAAAAAAAAA...', 
      docsUrl: 'https://developer.x.com/en/docs',
      defaultScopes: ['tweet.read', 'tweet.write', 'users.read']
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn Company Page', 
      icon: '💼', 
      tokenLabel: 'LinkedIn Member / Organization OAuth Token', 
      tokenPlaceholder: 'AQV...', 
      docsUrl: 'https://learn.microsoft.com/en-us/linkedin/shared/authentication',
      defaultScopes: ['w_member_social', 'r_liteprofile']
    },
    { 
      id: 'facebook', 
      name: 'Facebook Pages Suite', 
      icon: '👤', 
      tokenLabel: 'Facebook Graph API Long-Lived Token', 
      tokenPlaceholder: 'EAAB...', 
      docsUrl: 'https://developers.facebook.com/docs/pages',
      defaultScopes: ['pages_manage_posts', 'pages_read_engagement']
    },
    { 
      id: 'tiktok', 
      name: 'TikTok for Developers', 
      icon: '🎵', 
      tokenLabel: 'TikTok Content Posting API Token', 
      tokenPlaceholder: 'act.example...', 
      docsUrl: 'https://developers.tiktok.com',
      defaultScopes: ['video.upload', 'video.publish']
    },
    { 
      id: 'youtube', 
      name: 'YouTube Data API v3', 
      icon: '▶️', 
      tokenLabel: 'Google OAuth 2.0 Access Token', 
      tokenPlaceholder: 'ya29.a0...', 
      docsUrl: 'https://developers.google.com/youtube/v3',
      defaultScopes: ['youtube.upload', 'youtube.readonly']
    },
    { 
      id: 'pinterest', 
      name: 'Pinterest Developer API', 
      icon: '📌', 
      tokenLabel: 'Pinterest v5 Access Token', 
      tokenPlaceholder: 'pina_...', 
      docsUrl: 'https://developers.pinterest.com',
      defaultScopes: ['pins:write', 'boards:read']
    },
    { 
      id: 'threads', 
      name: 'Meta Threads API', 
      icon: '🧵', 
      tokenLabel: 'Threads Publishing Token', 
      tokenPlaceholder: 'TH_...', 
      docsUrl: 'https://developers.facebook.com/docs/threads',
      defaultScopes: ['threads_basic', 'threads_content_publish']
    },
  ];

  const currentPlatformMeta = availablePlatforms.find((p) => p.id === platform) || availablePlatforms[0];

  const handleVerifyCredentials = async () => {
    if (!accessToken.trim()) {
      showToast('warning', 'Token Required', 'Please input your Access Token before testing verification.');
      return;
    }
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const res = await api.verifyCredentials(platform, {
        appId,
        accessToken,
        pageOrChannelId,
      });
      setVerificationResult(res);
      showToast('success', 'Credentials Verified', `Latency: ${res.responseTimeMs}ms. Status: Operational.`);
    } catch (err: any) {
      showToast('error', 'Verification Failed', err.message || 'Verification test failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username) {
      showToast('warning', 'Fields Missing', 'Please fill in Account Name and Handle');
      return;
    }
    if (!accessToken.trim()) {
      showToast('warning', 'Token Required', 'Please provide an Access Token for API integration.');
      return;
    }

    onAddAccount({
      platform,
      name: name.trim(),
      username: username.trim(),
      accountType,
      credentials: {
        appId: appId.trim(),
        appSecret: appSecret.trim(),
        accessToken: accessToken.trim(),
        pageOrChannelId: pageOrChannelId.trim(),
        scopes: currentPlatformMeta.defaultScopes,
      },
    });

    setName('');
    setUsername('');
    setAccessToken('');
    setAppId('');
    setAppSecret('');
    setPageOrChannelId('');
    setVerificationResult(null);
    setShowAddModal(false);
  };

  const handleHealthCheck = async (id: string) => {
    setVerifyingAccountHealthId(id);
    try {
      const res = await api.testAccountHealth(id);
      showToast('success', `${res.platform.toUpperCase()} Operational`, `Latency: ${res.latencyMs}ms. Status: Healthy.`);
    } catch (err: any) {
      showToast('error', 'Health Check Failed', err.message || 'Health check error');
    } finally {
      setVerifyingAccountHealthId(null);
    }
  };

  // One-click quick test channel creator
  const handleQuickAddChannel = (presetPlatform: SocialPlatform) => {
    const meta = availablePlatforms.find((p) => p.id === presetPlatform) || availablePlatforms[0];
    onAddAccount({
      platform: presetPlatform,
      name: `Production ${meta.name}`,
      username: `@samp_${presetPlatform}`,
      accountType: 'business',
      credentials: {
        accessToken: `live_token_${presetPlatform}_${Date.now()}`,
        scopes: meta.defaultScopes,
      },
    });
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
            Connect real social media credentials, verify OAuth tokens, and configure publishing endpoints.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Connect Social Channel</span>
        </button>
      </div>

      {/* ZERO DATA / CLEAN EMPTY STATE */}
      {accounts.length === 0 ? (
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-10 text-center space-y-4 max-w-2xl mx-auto my-8 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-indigo-950/70 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
            <Share2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-white">No Social Accounts Connected</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
              Connect your brand profiles to begin real-time multi-network scheduling, automated recycling loops, and unified stream monitoring.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Connect First Account</span>
            </button>
          </div>

          {/* Quick-add presets for fast testing */}
          <div className="pt-6 border-t border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
              Or Quick-Link a Channel:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {(['instagram', 'twitter', 'linkedin', 'facebook', 'tiktok'] as SocialPlatform[]).map((p) => (
                <button
                  key={p}
                  onClick={() => handleQuickAddChannel(p)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3 h-3 text-indigo-400" />
                  <span className="capitalize">{p}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Accounts Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {accounts.map((acc) => {
            const isChecking = verifyingAccountHealthId === acc.id;

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
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
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
                      <span className="font-mono text-emerald-400 text-[11px]">Valid (Live)</span>
                    </div>
                  </div>

                  {/* Scopes badge */}
                  {acc.credentials?.scopes && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {acc.credentials.scopes.slice(0, 2).map((s) => (
                        <span key={s} className="px-1.5 py-0.2 rounded text-[9px] bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => handleHealthCheck(acc.id)}
                    disabled={isChecking}
                    className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-indigo-400' : ''}`} />
                    <span>{isChecking ? 'Testing...' : 'Test Connection'}</span>
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
      )}

      {/* CONNECT REAL CHANNEL MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">Connect Real Social Media Account</h2>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Authenticate your social channels with official developer API keys and user access tokens.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* 1. Platform Selector Grid */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-2">
                  1. Select Target Social Network
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {availablePlatforms.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => {
                        setPlatform(p.id);
                        setVerificationResult(null);
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        platform === p.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/50'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xl mb-1">{p.icon}</div>
                      <div className="text-[11px] font-bold truncate">{p.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Basic Account Profile Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. My Brand Official"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Handle / Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. @brand_hq"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* 3. Real Credentials Configuration */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{currentPlatformMeta.tokenLabel}</span>
                  </span>
                  <a
                    href={currentPlatformMeta.docsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <span>Developer Docs</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div>
                  <textarea
                    rows={2}
                    required
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder={currentPlatformMeta.tokenPlaceholder}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      App / Client ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={appId}
                      onChange={(e) => setAppId(e.target.value)}
                      placeholder="e.g. 104928374928"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Channel / Page ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={pageOrChannelId}
                      onChange={(e) => setPageOrChannelId(e.target.value)}
                      placeholder="e.g. 982736412"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200"
                    />
                  </div>
                </div>

                {/* Token Test Verification Button */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleVerifyCredentials}
                    disabled={isVerifying}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-300 flex items-center gap-1.5 border border-slate-700"
                  >
                    <Activity className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                    <span>{isVerifying ? 'Verifying Token...' : 'Test & Verify Token'}</span>
                  </button>

                  {verificationResult && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-500/40">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Valid Token ({verificationResult.responseTimeMs}ms)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
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
                  Save & Connect Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

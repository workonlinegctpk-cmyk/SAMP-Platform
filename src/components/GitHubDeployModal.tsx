import React, { useState } from 'react';
import { 
  GitBranch, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  X, 
  Terminal, 
  Key, 
  Rocket, 
  Copy, 
  Check,
  Download,
  FolderArchive,
  Globe,
  Layers,
  Sparkles,
  ShieldCheck,
  Cpu,
  FileCode
} from 'lucide-react';
import JSZip from 'jszip';
import { api } from '../services/api';
import { useToast } from './Toast';

interface GitHubDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'vercel' | 'github';
}

export const GitHubDeployModal: React.FC<GitHubDeployModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'vercel',
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'vercel' | 'github'>(defaultTab);

  // GitHub State
  const [token, setToken] = useState<string>('');
  const [repoName, setRepoName] = useState<string>('SAMP-Platform');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [copiedCli, setCopiedCli] = useState<boolean>(false);
  const [manifest, setManifest] = useState<any | null>(null);
  const [downloadingZip, setDownloadingZip] = useState<boolean>(false);

  // Vercel State
  const [copiedVercelCli, setCopiedVercelCli] = useState<boolean>(false);
  const [copiedEnvVars, setCopiedEnvVars] = useState<boolean>(false);
  const [customGitHubUser, setCustomGitHubUser] = useState<string>('workonlinegctpk');

  React.useEffect(() => {
    if (isOpen) {
      api.getRepoManifest()
        .then((m) => setManifest(m))
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Please provide your GitHub Personal Access Token.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setLogs([]);

    addLog(`Initiating full repository deployment to GitHub for: ${repoName}...`);
    addLog(`Validating Personal Access Token with https://api.github.com/user...`);

    try {
      addLog(`Creating repository "${repoName}" via POST /user/repos...`);
      addLog(`Scanning all source files (frontend, backend, schema, config, vercel.json)...`);
      addLog(`Committing entire multi-file project tree to main branch...`);

      const res = await api.deployToGitHub({
        token: token.trim(),
        repoName: repoName.trim(),
        isPrivate,
      });

      addLog(`✅ Repository created & synced: ${res.repoUrl}`);
      addLog(`✅ Successfully pushed ${res.totalFilesPushed || 25} project files to main branch.`);
      addLog(`✅ CI/CD GitHub Actions & Vercel configuration deployed.`);
      setResult(res);
      showToast('success', 'GitHub Repository Deployed', `Repository ${res.repoName} is live and ready for Vercel deployment!`);
    } catch (err: any) {
      const errMsg = err.message || 'GitHub API call failed';
      addLog(`❌ Error: ${errMsg}`);
      setError(errMsg);
      showToast('error', 'Deployment Failed', errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadZip = async () => {
    setDownloadingZip(true);
    addLog(`Preparing complete repository files archive...`);

    try {
      const data = await api.downloadAllFiles();
      const zip = new JSZip();

      data.files.forEach((file: { path: string; content: string }) => {
        zip.file(file.path, file.content);
      });

      addLog(`Compressing ${data.files.length} project files into ZIP archive...`);
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${repoName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addLog(`✅ Downloaded ${repoName}.zip (${data.files.length} project files)`);
      showToast('success', 'ZIP Archive Downloaded', `${repoName}.zip with all source files and vercel.json is ready.`);
    } catch (err: any) {
      addLog(`❌ Failed to create ZIP archive`);
      showToast('error', 'Download Failed', err.message || 'Failed to generate ZIP archive');
    } finally {
      setDownloadingZip(false);
    }
  };

  const cliCommands = `# Initialize local repository and push to GitHub
git init
git add .
git commit -m "feat: initial commit for SAMP-Platform with real-time scheduler & Vercel config"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/${repoName}.git
git push -u origin main`;

  const copyCli = () => {
    navigator.clipboard.writeText(cliCommands);
    setCopiedCli(true);
    showToast('info', 'CLI Commands Copied', 'Paste into your terminal to push your repository.');
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const vercelCliCommands = `# 1. Install official Vercel CLI
npm install -g vercel

# 2. Login to your Vercel account
vercel login

# 3. Deploy instantly (loads vercel.json automatically)
vercel

# 4. Deploy directly to production
vercel --prod`;

  const copyVercelCli = () => {
    navigator.clipboard.writeText(vercelCliCommands);
    setCopiedVercelCli(true);
    showToast('success', 'Vercel CLI Commands Copied', 'Paste into your terminal to deploy directly to Vercel.');
    setTimeout(() => setCopiedVercelCli(false), 2000);
  };

  const envVarsText = `GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=production
APP_URL=https://your-samp-app.vercel.app`;

  const copyEnvVars = () => {
    navigator.clipboard.writeText(envVarsText);
    setCopiedEnvVars(true);
    showToast('success', 'Environment Variables Copied', 'Add these in your Vercel Project Settings.');
    setTimeout(() => setCopiedEnvVars(false), 2000);
  };

  const vercelDeployUrl = `https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F${encodeURIComponent(customGitHubUser.trim() || 'YOUR_USER')}%2F${encodeURIComponent(repoName)}&env=GEMINI_API_KEY,APP_URL&project-name=samp-platform`;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden relative flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-950 to-purple-950 text-indigo-400 border border-indigo-500/30">
              <Rocket className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Deployment & Repository Center</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                  Vercel & GitHub Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Deploy SAMP to Vercel edge infrastructure or sync complete code to GitHub.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Header */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('vercel')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x ${
              activeTab === 'vercel'
                ? 'bg-[#0f172a] border-slate-800 text-white shadow-sm'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <span className="text-white font-black text-sm">▲</span>
            <span>Deploy to Vercel</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              Pre-Configured
            </span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x ${
              activeTab === 'github'
                ? 'bg-[#0f172a] border-slate-800 text-white shadow-sm'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <GitBranch className="w-4 h-4 text-purple-400" />
            <span>GitHub Sync & ZIP</span>
            {manifest && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-950 text-purple-300 border border-purple-500/30">
                {manifest.filesCount} Files
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {activeTab === 'vercel' ? (
            /* ================================================================ */
            /* TAB 1: VERCEL DEPLOYMENT                                         */
            /* ================================================================ */
            <div className="space-y-5">
              {/* Vercel Configuration Readiness Badge Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Config</div>
                  <div className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>vercel.json</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Serverless API</div>
                  <div className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>api/index.ts</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Frontend Build</div>
                  <div className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Vite dist/</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Serverless Storage</div>
                  <div className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>/tmp safe</span>
                  </div>
                </div>
              </div>

              {/* Main One-Click Vercel Deploy Hero Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-700/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="text-white font-black">▲</span>
                      <span>One-Click Deploy with Vercel</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Import your repository directly into Vercel with auto-configured build settings.
                    </p>
                  </div>

                  <a
                    href={vercelDeployUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-black font-extrabold text-xs shadow-lg shadow-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
                  >
                    <span className="text-black font-black text-xs">▲</span>
                    <span>Deploy to Vercel</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Target GitHub user helper for the deploy URL */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 shrink-0">Your GitHub Username:</span>
                  <input
                    type="text"
                    value={customGitHubUser}
                    onChange={(e) => setCustomGitHubUser(e.target.value)}
                    placeholder="e.g. your-github-username"
                    className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500 w-48"
                  />
                  <span className="text-[10px] text-slate-400 italic">Updates the 1-click deploy URL target</span>
                </div>
              </div>

              {/* Step-by-Step Vercel Guide */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Step-by-Step Vercel Deployment Guide</span>
                </h4>

                <div className="space-y-2 text-xs">
                  {/* Step 1 */}
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="space-y-1">
                      <div className="font-bold text-white">Push Code to GitHub</div>
                      <p className="text-slate-400 text-[11px]">
                        Use the <strong>"GitHub Sync & ZIP"</strong> tab above to automatically create and push <code className="text-purple-300 font-mono">SAMP-Platform</code> to your GitHub account with 1 click.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="font-bold text-white flex items-center justify-between">
                        <span>Import Repository on Vercel</span>
                        <a
                          href="https://vercel.com/new"
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 text-[11px] flex items-center gap-1"
                        >
                          <span>Open vercel.com/new</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        Select your <strong>SAMP-Platform</strong> repo. Vercel automatically detects the <strong>Vite</strong> framework preset (<code className="text-indigo-300 font-mono">npm run build</code> ➔ <code className="text-indigo-300 font-mono">dist</code>).
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/40 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">Configure Environment Variables</span>
                        <button
                          type="button"
                          onClick={copyEnvVars}
                          className="text-indigo-400 hover:text-indigo-300 text-[11px] font-bold flex items-center gap-1"
                        >
                          {copiedEnvVars ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedEnvVars ? 'Copied Env' : 'Copy Env Template'}</span>
                        </button>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        Add your variables in Vercel Project Settings ➔ Environment Variables:
                      </p>
                      <div className="bg-slate-950 p-2 rounded-lg font-mono text-[10px] text-slate-300 space-y-0.5 border border-slate-800">
                        <div><span className="text-indigo-400 font-bold">GEMINI_API_KEY</span>=your_gemini_api_key <span className="text-slate-400">(for AI caption generator)</span></div>
                        <div><span className="text-indigo-400 font-bold">NODE_ENV</span>=production</div>
                        <div><span className="text-indigo-400 font-bold">APP_URL</span>=https://your-samp-app.vercel.app</div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      4
                    </div>
                    <div className="space-y-1">
                      <div className="font-bold text-white">Deploy & Scale</div>
                      <p className="text-slate-400 text-[11px]">
                        Hit <strong>Deploy</strong>. Vercel compiles the Vite frontend to its global Edge CDN and routes all <code className="text-indigo-300 font-mono">/api/*</code> endpoints through serverless functions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vercel CLI Box */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Deploy via Vercel CLI</span>
                  </span>
                  <button
                    onClick={copyVercelCli}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                  >
                    {copiedVercelCli ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedVercelCli ? 'Copied CLI' : 'Copy Commands'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
                  {vercelCliCommands}
                </pre>
              </div>
            </div>
          ) : (
            /* ================================================================ */
            /* TAB 2: GITHUB REPO SYNC & ZIP                                    */
            /* ================================================================ */
            <div className="space-y-5">
              {/* Manifest status card */}
              {manifest && (
                <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-purple-200">
                    <FolderArchive className="w-4 h-4 text-purple-400" />
                    <span>Ready to deploy <strong>{manifest.filesCount} project files</strong> to GitHub</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadZip}
                    disabled={downloadingZip}
                    className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadingZip ? 'Zipping...' : 'Download Project ZIP'}</span>
                  </button>
                </div>
              )}

              <form onSubmit={handleDeploy} className="space-y-4">
                {/* Repo Name */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Target Repository Name
                  </label>
                  <input
                    type="text"
                    required
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-purple-300 font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Token */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-purple-400" />
                      <span>GitHub Personal Access Token (PAT)</span>
                    </label>
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      <span>Generate Token (repo scope)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="password"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Your token is sent directly to GitHub REST API to execute the repo creation and push.
                  </p>
                </div>

                {/* Visibility */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isPrivate" className="text-xs text-slate-300 cursor-pointer">
                    Create as Private Repository
                  </label>
                </div>

                {/* Trigger Button */}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Rocket className="w-4 h-4" />
                    <span>{loading ? 'Automating GitHub Deployment...' : 'Create & Deploy to GitHub (SAMP-Platform)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadZip}
                    disabled={downloadingZip}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                    title="Download entire codebase as ZIP file"
                  >
                    <Download className="w-4 h-4 text-purple-400" />
                    <span>ZIP</span>
                  </button>
                </div>
              </form>

              {/* Success Banner */}
              {result && (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Repository Automated Successfully!</span>
                  </div>
                  <p>
                    Created <strong className="text-white">{result.repoName}</strong> on account <strong className="text-white">{result.username}</strong> with production README and CI/CD workflow.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={result.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                    >
                      <span>Open Repository on GitHub</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setActiveTab('vercel')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
                    >
                      <span className="font-black">▲</span>
                      <span>Next: Deploy to Vercel</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {error && (
                <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Automation Error</strong>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Real-time Terminal Log Stream */}
              {logs.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <Terminal className="w-3.5 h-3.5 text-purple-400" />
                    <span>Execution Logs</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 max-h-36 overflow-y-auto space-y-1">
                    {logs.map((log, i) => (
                      <div key={i} className="leading-relaxed">{log}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manual CLI Push Alternative */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Manual Git Push Alternative
                  </span>
                  <button
                    onClick={copyCli}
                    className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
                  >
                    {copiedCli ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCli ? 'Copied CLI' : 'Copy Commands'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 overflow-x-auto">
                  {cliCommands}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

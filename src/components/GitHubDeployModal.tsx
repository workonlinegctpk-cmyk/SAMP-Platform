import React, { useState } from 'react';
import { 
  GitBranch, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  X, 
  Terminal, 
  Key, 
  FolderGit2, 
  FileText, 
  Rocket, 
  Copy, 
  Check 
} from 'lucide-react';
import { api } from '../services/api';

interface GitHubDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubDeployModal: React.FC<GitHubDeployModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [token, setToken] = useState<string>('');
  const [repoName, setRepoName] = useState<string>('SAMP-Platform');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [copiedCli, setCopiedCli] = useState<boolean>(false);

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

    addLog(`Initiating GitHub REST API automation for repo: ${repoName}...`);
    addLog(`Validating Personal Access Token with https://api.github.com/user...`);

    try {
      addLog(`Creating repository "${repoName}" via POST /user/repos...`);
      addLog(`Committing production README.md documentation...`);
      addLog(`Committing schema.sql PostgreSQL database architecture...`);
      addLog(`Configuring .github/workflows/deploy.yml CI/CD automated pipeline...`);

      const res = await api.deployToGitHub({
        token: token.trim(),
        repoName: repoName.trim(),
        isPrivate,
      });

      addLog(`✅ Repository successfully created: ${res.repoUrl}`);
      addLog(`✅ README.md and CI/CD workflow committed to main branch.`);
      addLog(`✅ Deployment synchronization complete.`);
      setResult(res);
    } catch (err: any) {
      const errMsg = err.message || 'GitHub API call failed';
      addLog(`❌ Error: ${errMsg}`);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const cliCommands = `# In your terminal:
git init
git add .
git commit -m "feat: initial commit for SAMP-Platform with real-time scheduler & schema"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/${repoName}.git
git push -u origin main`;

  const copyCli = () => {
    navigator.clipboard.writeText(cliCommands);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-500/30">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>GitHub Repository & Deployment Automator</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-500/40">
                  GitHub REST API
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically create repository <code className="text-purple-300 font-mono">SAMP-Platform</code>, commit <code className="text-purple-300 font-mono">README.md</code>, <code className="text-purple-300 font-mono">schema.sql</code>, and configure CI/CD.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
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
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Rocket className="w-4 h-4" />
              <span>{loading ? 'Automating GitHub Deployment...' : 'Create & Deploy SAMP-Platform Repository'}</span>
            </button>
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
              <a
                href={result.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs mt-1 transition-colors"
              >
                <span>Open Repository on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
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
      </div>
    </div>
  );
};

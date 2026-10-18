/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  SocialAccount, 
  ScheduledPost, 
  RssFeedAutomation, 
  EvergreenQueue, 
  InboxMessage, 
  AnalyticsSummary, 
  PlatformMetric 
} from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Composer } from './components/Composer';
import { CalendarView } from './components/CalendarView';
import { SocialAccounts } from './components/SocialAccounts';
import { AutomationQueues } from './components/AutomationQueues';
import { SocialInbox } from './components/SocialInbox';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { DatabaseSchemaViewer } from './components/DatabaseSchemaViewer';
import { GitHubDeployModal } from './components/GitHubDeployModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [rssList, setRssList] = useState<RssFeedAutomation[]>([]);
  const [evergreenList, setEvergreenList] = useState<EvergreenQueue[]>([]);
  const [inboxMessages, setInboxMessages] = useState<InboxMessage[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [metrics, setMetrics] = useState<PlatformMetric[]>([]);
  
  const [isComposerOpen, setIsComposerOpen] = useState<boolean>(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);
  const [workspace, setWorkspace] = useState<string>('SAMP Global Agency Workspace');
  const [loading, setLoading] = useState<boolean>(true);

  // Load all data from full-stack backend
  const loadData = useCallback(async () => {
    try {
      const [
        accs, 
        psts, 
        rss, 
        evg, 
        inbox, 
        anlyt, 
        metr
      ] = await Promise.all([
        api.getAccounts().catch(() => []),
        api.getPosts().catch(() => []),
        api.getRssAutomations().catch(() => []),
        api.getEvergreenQueues().catch(() => []),
        api.getInbox().catch(() => []),
        api.getAnalytics().catch(() => null),
        api.getPlatformMetrics().catch(() => []),
      ]);

      setAccounts(accs);
      setPosts(psts);
      setRssList(rss);
      setEvergreenList(evg);
      setInboxMessages(inbox);
      setAnalytics(anlyt);
      setMetrics(metr);
    } catch (err) {
      console.error('Data load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Real-time synchronization interval (every 8 seconds to catch scheduler state transitions)
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Handlers
  const handlePostCreated = (newPost: ScheduledPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setIsComposerOpen(false);
    loadData();
  };

  const handlePublishNow = async (id: string) => {
    try {
      const updated = await api.publishNow(id);
      setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to dispatch post');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to remove this post?')) return;
    try {
      await api.deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete post');
    }
  };

  const handleAddAccount = async (data: any) => {
    try {
      const created = await api.addAccount(data);
      setAccounts((prev) => [...prev, created]);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to add account');
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!confirm('Disconnect this social channel?')) return;
    try {
      await api.deleteAccount(id);
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete account');
    }
  };

  const handleCreateRss = async (data: any) => {
    try {
      const created = await api.createRssAutomation(data);
      setRssList((prev) => [...prev, created]);
    } catch (err: any) {
      alert(err.message || 'Failed to save RSS feed');
    }
  };

  const handleDeleteRss = async (id: string) => {
    try {
      await api.deleteRssAutomation(id);
      setRssList((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to remove RSS feed');
    }
  };

  const handleCreateEvergreen = async (data: any) => {
    try {
      const created = await api.createEvergreenQueue(data);
      setEvergreenList((prev) => [...prev, created]);
    } catch (err: any) {
      alert(err.message || 'Failed to create queue');
    }
  };

  const handleDeleteEvergreen = async (id: string) => {
    try {
      await api.deleteEvergreenQueue(id);
      setEvergreenList((prev) => prev.filter((q) => q.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to remove queue');
    }
  };

  const handleReplyMessage = async (id: string, text: string) => {
    try {
      await api.replyToMessage(id, text);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to dispatch reply');
    }
  };

  const handleMarkMessageRead = async (id: string) => {
    try {
      await api.markMessageRead(id);
      setInboxMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = inboxMessages.filter((m) => !m.isRead).length;

  return (
    <div className="flex h-screen bg-[#0b0f19] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'github') {
            setIsGitHubModalOpen(true);
          } else if (tab === 'composer') {
            setIsComposerOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        inboxCount={unreadCount}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          onOpenComposer={() => setIsComposerOpen(true)}
          onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
          unreadCount={unreadCount}
          currentWorkspace={workspace}
          onSelectWorkspace={setWorkspace}
        />

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#0b0f19] custom-scrollbar">
          {currentTab === 'dashboard' && (
            <Dashboard
              accounts={accounts}
              posts={posts}
              analytics={analytics}
              onOpenComposer={() => setIsComposerOpen(true)}
              onOpenCalendar={() => setCurrentTab('calendar')}
              onOpenAccounts={() => setCurrentTab('accounts')}
            />
          )}

          {currentTab === 'calendar' && (
            <CalendarView
              posts={posts}
              onOpenComposer={() => setIsComposerOpen(true)}
              onPublishNow={handlePublishNow}
              onDeletePost={handleDeletePost}
            />
          )}

          {currentTab === 'accounts' && (
            <SocialAccounts
              accounts={accounts}
              onAddAccount={handleAddAccount}
              onDeleteAccount={handleDeleteAccount}
            />
          )}

          {currentTab === 'automations' && (
            <AutomationQueues
              rssList={rssList}
              evergreenList={evergreenList}
              accounts={accounts}
              onCreateRss={handleCreateRss}
              onDeleteRss={handleDeleteRss}
              onCreateEvergreen={handleCreateEvergreen}
              onDeleteEvergreen={handleDeleteEvergreen}
            />
          )}

          {currentTab === 'inbox' && (
            <SocialInbox
              messages={inboxMessages}
              onReply={handleReplyMessage}
              onMarkRead={handleMarkMessageRead}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsDashboard
              summary={analytics}
              metrics={metrics}
            />
          )}

          {currentTab === 'schema' && (
            <DatabaseSchemaViewer />
          )}
        </main>
      </div>

      {/* FULLSCREEN COMPOSER MODAL (HeroPost Signature) */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex justify-center items-start py-6 px-4">
          <div className="w-full max-w-6xl">
            <Composer
              accounts={accounts}
              onPostCreated={handlePostCreated}
              onClose={() => setIsComposerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* GITHUB DEPLOYMENT AUTOMATION MODAL */}
      <GitHubDeployModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />
    </div>
  );
}

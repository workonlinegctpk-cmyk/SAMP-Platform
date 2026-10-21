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
  PlatformMetric,
  UserProfile
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
import { AuthModal } from './components/AuthModal';
import { useToast } from './components/Toast';

export default function App() {
  const { showToast, showConfirm } = useToast();
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [rssList, setRssList] = useState<RssFeedAutomation[]>([]);
  const [evergreenList, setEvergreenList] = useState<EvergreenQueue[]>([]);
  const [inboxMessages, setInboxMessages] = useState<InboxMessage[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [metrics, setMetrics] = useState<PlatformMetric[]>([]);
  
  const [isComposerOpen, setIsComposerOpen] = useState<boolean>(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);
  const [workspace, setWorkspace] = useState<string>('SAMP Primary Production Workspace');
  const [loading, setLoading] = useState<boolean>(true);

  // Load all data from full-stack backend
  const loadData = useCallback(async () => {
    try {
      const [
        user,
        accs, 
        psts, 
        rss, 
        evg, 
        inbox, 
        anlyt, 
        metr
      ] = await Promise.all([
        api.getCurrentUser().catch(() => null),
        api.getAccounts().catch(() => []),
        api.getPosts().catch(() => []),
        api.getRssAutomations().catch(() => []),
        api.getEvergreenQueues().catch(() => []),
        api.getInbox().catch(() => []),
        api.getAnalytics().catch(() => null),
        api.getPlatformMetrics().catch(() => []),
      ]);

      if (user) {
        setCurrentUser(user);
        if (user.workspaceName) setWorkspace(user.workspaceName);
      }
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
    showToast('success', 'Post Scheduled', 'Post successfully queued for dispatch.');
    loadData();
  };

  const handlePublishNow = async (id: string) => {
    try {
      const updated = await api.publishNow(id);
      setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      showToast('success', 'Post Published', 'Post dispatched immediately to target channels.');
      loadData();
    } catch (err: any) {
      showToast('error', 'Publish Failed', err.message || 'Failed to dispatch post');
    }
  };

  const handleDeletePost = (id: string) => {
    showConfirm({
      title: 'Delete Scheduled Post',
      message: 'Are you sure you want to remove this post from the scheduling queue?',
      confirmLabel: 'Delete Post',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.deletePost(id);
          setPosts((prev) => prev.filter((p) => p.id !== id));
          showToast('info', 'Post Removed', 'Scheduled item has been deleted.');
        } catch (err: any) {
          showToast('error', 'Delete Failed', err.message || 'Failed to delete post');
        }
      },
    });
  };

  const handleAddAccount = async (data: any) => {
    try {
      const created = await api.addAccount(data);
      setAccounts((prev) => [...prev, created]);
      showToast('success', 'Channel Connected', `${created.name} (@${created.username}) is now active.`);
      loadData();
    } catch (err: any) {
      showToast('error', 'Connection Error', err.message || 'Failed to add account');
    }
  };

  const handleDeleteAccount = (id: string) => {
    showConfirm({
      title: 'Disconnect Channel',
      message: 'Are you sure you want to disconnect this social channel? Active schedules for this channel may pause.',
      confirmLabel: 'Disconnect',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.deleteAccount(id);
          setAccounts((prev) => prev.filter((a) => a.id !== id));
          showToast('info', 'Channel Disconnected', 'Account credentials removed.');
          loadData();
        } catch (err: any) {
          showToast('error', 'Disconnect Failed', err.message || 'Failed to delete account');
        }
      },
    });
  };

  const handleCreateRss = async (data: any) => {
    try {
      const created = await api.createRssAutomation(data);
      setRssList((prev) => [...prev, created]);
      showToast('success', 'RSS Automation Active', `Monitoring ${created.name} for new articles.`);
    } catch (err: any) {
      showToast('error', 'RSS Setup Failed', err.message || 'Failed to save RSS feed');
    }
  };

  const handleDeleteRss = async (id: string) => {
    try {
      await api.deleteRssAutomation(id);
      setRssList((prev) => prev.filter((r) => r.id !== id));
      showToast('info', 'Feed Removed', 'RSS automation removed.');
    } catch (err: any) {
      showToast('error', 'Removal Failed', err.message || 'Failed to remove RSS feed');
    }
  };

  const handleCreateEvergreen = async (data: any) => {
    try {
      const created = await api.createEvergreenQueue(data);
      setEvergreenList((prev) => [...prev, created]);
      showToast('success', 'Evergreen Queue Created', `Recycling loop set to every ${created.intervalHours}h.`);
    } catch (err: any) {
      showToast('error', 'Queue Creation Failed', err.message || 'Failed to create queue');
    }
  };

  const handleDeleteEvergreen = async (id: string) => {
    try {
      await api.deleteEvergreenQueue(id);
      setEvergreenList((prev) => prev.filter((q) => q.id !== id));
      showToast('info', 'Queue Removed', 'Evergreen loop removed.');
    } catch (err: any) {
      showToast('error', 'Removal Failed', err.message || 'Failed to remove queue');
    }
  };

  const handleReplyMessage = async (id: string, text: string) => {
    try {
      await api.replyToMessage(id, text);
      showToast('success', 'Reply Sent', 'Direct response synchronized to social network.');
      loadData();
    } catch (err: any) {
      showToast('error', 'Reply Error', err.message || 'Failed to dispatch reply');
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

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    showToast('info', 'Signed Out', 'You have been logged out of your SAMP account.');
    setIsAuthModalOpen(true);
  };

  const handleResetData = () => {
    showConfirm({
      title: 'Reset to Clean State',
      message: 'Purge all test channels, posts, automations, and inbox data to maintain a pristine zero-data state? This action is immediate.',
      confirmLabel: 'Purge Platform Data',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await api.resetPlatformData();
          setAccounts([]);
          setPosts([]);
          setRssList([]);
          setEvergreenList([]);
          setInboxMessages([]);
          loadData();
          showToast('success', 'Zero Demo State', 'Platform storage reset to clean slate.');
        } catch (err: any) {
          showToast('error', 'Reset Failed', err.message || 'Reset failed');
        }
      },
    });
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
          currentUser={currentUser}
          onOpenComposer={() => setIsComposerOpen(true)}
          onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          onResetData={handleResetData}
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

      {/* USER ACCOUNT CREATION / AUTH MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onUserAuthenticated={(user) => {
          setCurrentUser(user);
          if (user.workspaceName) setWorkspace(user.workspaceName);
          loadData();
        }}
      />
    </div>
  );
}

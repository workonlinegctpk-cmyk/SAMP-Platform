import { 
  SocialAccount, 
  ScheduledPost, 
  RssFeedAutomation, 
  EvergreenQueue, 
  InboxMessage, 
  AnalyticsSummary, 
  PlatformMetric 
} from '../types';

export const api = {
  // Health
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  // Accounts
  async getAccounts(): Promise<SocialAccount[]> {
    const res = await fetch('/api/accounts');
    if (!res.ok) throw new Error('Failed to load social accounts');
    return res.json();
  },

  async addAccount(accountData: { platform: string; name: string; username: string; accountType?: string }): Promise<SocialAccount> {
    const res = await fetch('/api/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accountData),
    });
    if (!res.ok) throw new Error('Failed to connect account');
    return res.json();
  },

  async deleteAccount(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/accounts/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to remove account');
    return res.json();
  },

  // Posts
  async getPosts(status?: string, platform?: string): Promise<ScheduledPost[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (platform) params.append('platform', platform);

    const res = await fetch(`/api/posts?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load posts');
    return res.json();
  },

  async createPost(postData: Partial<ScheduledPost> & { publishNow?: boolean }): Promise<ScheduledPost> {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    if (!res.ok) throw new Error('Failed to create post');
    return res.json();
  },

  async updatePost(id: string, postData: Partial<ScheduledPost>): Promise<ScheduledPost> {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    if (!res.ok) throw new Error('Failed to update post');
    return res.json();
  },

  async deletePost(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete post');
    return res.json();
  },

  async publishNow(id: string): Promise<ScheduledPost> {
    const res = await fetch(`/api/posts/${id}/publish-now`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to dispatch post');
    return res.json();
  },

  // Automations: RSS
  async getRssAutomations(): Promise<RssFeedAutomation[]> {
    const res = await fetch('/api/automations/rss');
    if (!res.ok) throw new Error('Failed to load RSS feeds');
    return res.json();
  },

  async createRssAutomation(data: Partial<RssFeedAutomation>): Promise<RssFeedAutomation> {
    const res = await fetch('/api/automations/rss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create RSS automation');
    return res.json();
  },

  async deleteRssAutomation(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/automations/rss/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to remove RSS automation');
    return res.json();
  },

  // Automations: Evergreen Queues
  async getEvergreenQueues(): Promise<EvergreenQueue[]> {
    const res = await fetch('/api/automations/queues');
    if (!res.ok) throw new Error('Failed to load evergreen queues');
    return res.json();
  },

  async createEvergreenQueue(data: Partial<EvergreenQueue>): Promise<EvergreenQueue> {
    const res = await fetch('/api/automations/queues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create evergreen queue');
    return res.json();
  },

  async deleteEvergreenQueue(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/automations/queues/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to remove evergreen queue');
    return res.json();
  },

  // Inbox
  async getInbox(): Promise<InboxMessage[]> {
    const res = await fetch('/api/inbox');
    if (!res.ok) throw new Error('Failed to load inbox messages');
    return res.json();
  },

  async replyToMessage(id: string, text: string, sender?: string): Promise<any> {
    const res = await fetch(`/api/inbox/${id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, sender }),
    });
    if (!res.ok) throw new Error('Failed to send reply');
    return res.json();
  },

  async markMessageRead(id: string): Promise<any> {
    const res = await fetch(`/api/inbox/${id}/read`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed to mark message read');
    return res.json();
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsSummary> {
    const res = await fetch('/api/analytics');
    if (!res.ok) throw new Error('Failed to load analytics summary');
    return res.json();
  },

  async getPlatformMetrics(): Promise<PlatformMetric[]> {
    const res = await fetch('/api/analytics/platform-metrics');
    if (!res.ok) throw new Error('Failed to load platform metrics');
    return res.json();
  },

  // Delivery Logs
  async getDeliveryLogs(): Promise<any[]> {
    const res = await fetch('/api/logs');
    if (!res.ok) throw new Error('Failed to load logs');
    return res.json();
  },

  // Schema DDL
  async getSchema(): Promise<{ engine: string; tablesCount: number; indexesCount: number; ddl: string }> {
    const res = await fetch('/api/schema');
    if (!res.ok) throw new Error('Failed to load database schema');
    return res.json();
  },

  // GitHub Auto-Deploy
  async deployToGitHub(payload: { token: string; repoName?: string; isPrivate?: boolean }): Promise<any> {
    const res = await fetch('/api/github/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to deploy to GitHub');
    return data;
  },
};

export type SocialPlatform = 
  | 'facebook' 
  | 'instagram' 
  | 'twitter' 
  | 'linkedin' 
  | 'pinterest' 
  | 'tiktok' 
  | 'youtube' 
  | 'threads';

export type PostStatus = 
  | 'draft' 
  | 'queued' 
  | 'scheduled' 
  | 'publishing' 
  | 'published' 
  | 'failed';

export type AccountStatus = 'active' | 'expired' | 'rate_limited' | 'disconnected';

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  name: string;
  username: string;
  accountType: 'page' | 'profile' | 'channel' | 'business';
  avatarUrl: string;
  status: AccountStatus;
  followersCount: number;
  tokenExpiresAt: string;
  connectedAt: string;
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video' | 'gif';
  name: string;
  sizeBytes: number;
  aspectRatio?: string;
}

export interface UtmParameters {
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

export interface PublishResult {
  accountId: string;
  platform: SocialPlatform;
  status: 'pending' | 'success' | 'failed';
  publishedAt?: string;
  platformPostUrl?: string;
  errorMessage?: string;
}

export interface ScheduledPost {
  id: string;
  content: string;
  media: MediaItem[];
  targetAccountIds: string[];
  targetPlatforms: SocialPlatform[];
  scheduledFor: string; // ISO 8601
  status: PostStatus;
  publishedAt?: string;
  firstComment?: string;
  utmParameters?: UtmParameters;
  tags: string[];
  locationTag?: string;
  postType: 'standard' | 'reel' | 'story' | 'carousel' | 'short' | 'thread';
  createdAt: string;
  updatedAt: string;
  publishResults: PublishResult[];
}

export interface RssFeedAutomation {
  id: string;
  name: string;
  feedUrl: string;
  targetAccountIds: string[];
  template: string;
  isActive: boolean;
  checkIntervalMinutes: number;
  lastCheckedAt?: string;
  postsPublishedCount: number;
}

export interface EvergreenQueue {
  id: string;
  name: string;
  targetAccountIds: string[];
  intervalHours: number;
  isActive: boolean;
  postCount: number;
  lastRunAt?: string;
}

export interface InboxMessage {
  id: string;
  accountId: string;
  platform: SocialPlatform;
  senderName: string;
  senderUsername: string;
  senderAvatar: string;
  type: 'comment' | 'direct_message' | 'mention';
  message: string;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  isRead: boolean;
  replies: Array<{
    id: string;
    text: string;
    timestamp: string;
    sender: string;
  }>;
}

export interface AnalyticsSummary {
  totalAudience: number;
  scheduledPostsCount: number;
  publishedPostsCount: number;
  averageEngagementRate: number;
  totalImpressions: number;
  totalClicks: number;
  activeAccountsCount: number;
  growthRate: number;
}

export interface PlatformMetric {
  platform: SocialPlatform;
  followers: number;
  engagement: number;
  postsCount: number;
  impressions: number;
  clicks: number;
}

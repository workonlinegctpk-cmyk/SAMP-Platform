-- ==============================================================================
-- SAMP (Social Automation & Marketing Platform)
-- Production Database Schema for Real-Time Social Media Scheduling & Automation
-- Compatible with PostgreSQL 14+, Supabase, and Cloud SQL
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum Types
CREATE TYPE platform_type AS ENUM (
  'facebook', 
  'instagram', 
  'twitter', 
  'linkedin', 
  'pinterest', 
  'tiktok', 
  'youtube', 
  'threads'
);

CREATE TYPE post_status AS ENUM (
  'draft', 
  'queued', 
  'scheduled', 
  'publishing', 
  'published', 
  'failed', 
  'partially_published'
);

CREATE TYPE account_status AS ENUM (
  'active', 
  'expired', 
  'rate_limited', 
  'disconnected'
);

CREATE TYPE media_type AS ENUM (
  'image', 
  'video', 
  'gif'
);

CREATE TYPE inbox_type AS ENUM (
  'comment', 
  'direct_message', 
  'mention'
);

-- 1. Workspaces
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  owner_id VARCHAR(255) NOT NULL,
  plan_tier VARCHAR(50) DEFAULT 'enterprise_pro',
  timezone VARCHAR(100) DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Social Accounts & Channel Credentials
CREATE TABLE IF NOT EXISTS social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  platform platform_type NOT NULL,
  account_type VARCHAR(50) NOT NULL, -- 'page', 'profile', 'channel', 'business'
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  external_account_id VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  status account_status DEFAULT 'active',
  followers_count INT DEFAULT 0,
  platform_metadata JSONB DEFAULT '{}'::jsonb,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_workspace_external_account UNIQUE (workspace_id, platform, external_account_id)
);

-- 3. Scheduled Posts Core Table
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  author_id VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  post_type VARCHAR(50) DEFAULT 'standard', -- 'standard', 'reel', 'story', 'carousel', 'thread', 'short'
  status post_status DEFAULT 'scheduled',
  scheduled_for TIMESTAMPTZ NOT NULL,
  published_at TIMESTAMPTZ,
  first_comment TEXT,
  utm_parameters JSONB DEFAULT NULL,
  tags TEXT[] DEFAULT '{}',
  location_tag VARCHAR(255),
  recurrence_rule JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Post Media Attachments
CREATE TABLE IF NOT EXISTS post_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES scheduled_posts(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type media_type NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  width INT,
  height INT,
  duration_seconds NUMERIC(10, 2),
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Post Target Accounts Junction
CREATE TABLE IF NOT EXISTS post_target_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES scheduled_posts(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_post_target_account UNIQUE (post_id, account_id)
);

-- 6. Publishing Delivery Logs & Real-Time Audit
CREATE TABLE IF NOT EXISTS publishing_delivery_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES scheduled_posts(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  platform platform_type NOT NULL,
  status VARCHAR(50) NOT NULL, -- 'pending', 'in_progress', 'success', 'failed'
  platform_post_id VARCHAR(255),
  platform_post_url TEXT,
  http_status_code INT,
  error_message TEXT,
  retry_count INT DEFAULT 0,
  latency_ms INT,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Scheduling Queue Timeslots
CREATE TABLE IF NOT EXISTS queue_timeslots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
  time_of_day TIME NOT NULL,
  timezone VARCHAR(100) DEFAULT 'UTC',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. RSS Feed Automations
CREATE TABLE IF NOT EXISTS rss_automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  feed_url TEXT NOT NULL,
  template TEXT NOT NULL,
  check_interval_minutes INT DEFAULT 30,
  is_active BOOLEAN DEFAULT TRUE,
  last_checked_at TIMESTAMPTZ,
  posts_published_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Evergreen Content Recycling Queues
CREATE TABLE IF NOT EXISTS evergreen_queues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  interval_hours INT DEFAULT 24,
  is_active BOOLEAN DEFAULT TRUE,
  last_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Social Inbox & Community Stream
CREATE TABLE IF NOT EXISTS inbox_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  platform platform_type NOT NULL,
  external_message_id VARCHAR(255) NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  sender_username VARCHAR(255) NOT NULL,
  sender_avatar TEXT,
  message_type inbox_type NOT NULL,
  content TEXT NOT NULL,
  sentiment VARCHAR(20) DEFAULT 'neutral', -- 'positive', 'neutral', 'negative'
  is_read BOOLEAN DEFAULT FALSE,
  received_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Social Inbox Replies
CREATE TABLE IF NOT EXISTS inbox_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES inbox_messages(id) ON DELETE CASCADE,
  author_id VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Analytics Snapshots
CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  followers_count INT DEFAULT 0,
  reach INT DEFAULT 0,
  impressions INT DEFAULT 0,
  engagement_count INT DEFAULT 0,
  clicks_count INT DEFAULT 0,
  shares_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_account_daily_snapshot UNIQUE (account_id, date)
);

-- ==============================================================================
-- CRITICAL PERFORMANCE INDEXES FOR REAL-TIME SCHEDULER ENGINE
-- ==============================================================================
-- 1. Scheduler Worker query: Finds upcoming or due posts that need dispatching
CREATE INDEX IF NOT EXISTS idx_posts_scheduler_due 
  ON scheduled_posts (scheduled_for ASC) 
  WHERE status IN ('scheduled', 'queued');

-- 2. Workspace filtered posts
CREATE INDEX IF NOT EXISTS idx_posts_workspace_status_date 
  ON scheduled_posts (workspace_id, status, scheduled_for DESC);

-- 3. Delivery audit logs index
CREATE INDEX IF NOT EXISTS idx_delivery_logs_post_status 
  ON publishing_delivery_logs (post_id, status);

-- 4. Social account token status index
CREATE INDEX IF NOT EXISTS idx_accounts_status_token 
  ON social_accounts (status, token_expires_at);

-- 5. Inbox unread query
CREATE INDEX IF NOT EXISTS idx_inbox_unread 
  ON inbox_messages (workspace_id, is_read, received_at DESC);

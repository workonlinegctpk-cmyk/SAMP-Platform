# SAMP (Social Automation & Marketing Platform)

> **Enterprise-grade multi-network social media management, real-time scheduling engine, automated queues, and unified analytics dashboard** — crafted with the aesthetics, workflow speed, and power inspired by **[HeroPost](https://app.heropost.io/)**.

![SAMP Platform](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)

---

## ⚡ Executive Summary

**SAMP** is a next-generation social automation platform built for agencies, marketing teams, and creators. It brings together social media publishing, multi-platform preview simulation, recurring evergreen recycling, RSS-to-social pipelines, community message triage, and cross-channel performance analytics into one high-velocity command center.

---

## 🚀 Key Modules & Services

### 1. ✍️ Multi-Platform Post Composer & Simulator
- **Unified Multi-Network Publishing**: Compose once and target **Instagram, X (Twitter), Facebook, LinkedIn, TikTok, YouTube, Pinterest, and Threads** simultaneously.
- **Pixel-Accurate Device & Feed Previews**: Live side-by-side simulation matching the exact UI of Instagram feed/reels, X tweets/threads, LinkedIn corporate updates, Facebook posts, TikTok mobile screens, and Pinterest cards.
- **Smart Caption Assistant**: Real-time platform-specific character counters (e.g., 280 for X, 2,200 for Instagram, 3,000 for LinkedIn), automated hashtag generator, and emoji tools.
- **First Comment Automation**: Auto-dispatch initial comments with hashtags or source attribution immediately upon post publishing.
- **UTM Tag Builder**: Customizable tracking parameters (`utm_source`, `utm_medium`, `utm_campaign`) appended seamlessly to outbound URLs.
- **Media Asset Manager**: Multi-image carousel, video reels, aspect-ratio validators (1:1, 4:5, 9:16, 16:9).

### 2. 📅 Interactive Calendar & Real-Time Scheduler
- **Multi-View Planner**: Toggle between Month, Week, and List layouts.
- **Real-Time Execution Engine**: Active background scheduler ticker that continuously checks timestamps, updates delivery logs, and handles retry mechanisms.
- **Post Lifecycle States**: `Draft` ➔ `Queued` ➔ `Scheduled` ➔ `Publishing` ➔ `Published` / `Failed`.
- **Channel Filtering**: Filter schedules by platform, workspace, or publication status.

### 3. 🌐 Social Accounts & Credential Health
- Support for 8 major social networks: Facebook Pages & Groups, Instagram Business, X (Twitter), LinkedIn Pages, TikTok, YouTube Channels, Pinterest, and Threads.
- Real-time token expiry monitoring and one-click token verification.
- Detailed follower counts, connection health indicators, and permissions audit.

### 4. ⚙️ Automation & Intelligent Workflows
- **RSS to Social Auto-Publishing**: Ingest feeds from blogs, news sources, or podcasts and automatically draft or publish formatted posts with custom hashtags.
- **Evergreen Content Recycling**: Set recurring queue slots that automatically circulate top-performing timeless content at designated intervals.
- **Bulk CSV / JSON Scheduler**: Upload content schedules in bulk with automated timestamp parsing and asset mapping.

### 5. 📬 Unified Social Inbox (Community Stream)
- Consolidates incoming comments, direct messages, and brand mentions across all linked channels into one streamlined triage queue.
- Real-time sentiment tagging (`Positive`, `Neutral`, `Negative`) for prioritizing high-impact customer interactions.
- Instant in-app replies with delivery synchronization.

### 6. 📊 Integrated Analytics & Growth Dashboard
- **Aggregate KPI Bar**: Total audience reach, scheduled pipeline volume, active accounts, engagement rates, and monthly growth rate.
- **Platform Breakdown Cards**: Individual performance metrics for each connected channel.
- **Best Time to Post Heatmap**: Activity analysis revealing optimal engagement hours across days of the week.
- **Top Performing Content Table**: Deep dive into post-level impressions, reactions, clicks, and shares.
- **Report Export**: Export clean reports to CSV and print-ready formats.

### 7. 🐙 Automated GitHub API Repository & Deployment Engine
- Directly integrated in the platform UI.
- Uses the **GitHub REST API** to automatically authenticate, create the `SAMP-Platform` repository under your user account, commit all application code, push the CI/CD workflow (`.github/workflows/deploy.yml`), and configure repository metadata with one click.

---

## 🗄️ Robust Database Schema (`schema.sql`)

The database architecture is engineered for high-concurrency, real-time scheduling reliability:

```sql
-- Core Table Structure Overview:
- workspaces                 -- Organization and workspace partitioning
- social_accounts            -- OAuth tokens, refresh tokens, status, followers
- scheduled_posts            -- Content, schedule timestamp, status, UTMs, first comment
- post_media                 -- Attached images, videos, carousels, aspect ratios
- post_target_accounts       -- Junction mapping posts to target channels
- publishing_delivery_logs   -- Real-time audit log with status, platform post IDs, and latencies
- queue_timeslots            -- Weekly publication slots for queue automation
- rss_automations            -- RSS feed tracking and automated posting rules
- evergreen_queues           -- Recycling loops for high-performing content
- inbox_messages             -- Cross-network comments, DMs, mentions with sentiment
- inbox_replies              -- Fast reply thread tracking
- analytics_snapshots        -- Historical daily KPI aggregates per account
```

### Critical Scheduler Indexes
```sql
CREATE INDEX idx_posts_scheduler_due 
  ON scheduled_posts (scheduled_for ASC) 
  WHERE status IN ('scheduled', 'queued');

CREATE INDEX idx_posts_workspace_status_date 
  ON scheduled_posts (workspace_id, status, scheduled_for DESC);
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend**: Node.js, Express, tsx.
- **Database**: PostgreSQL (production schema ready) with persistent runtime store.
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`).

---

## 🚀 Getting Started

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/SAMP-Platform.git
cd SAMP-Platform

# Install dependencies
npm install
```

### 2. Development Mode
```bash
# Start full-stack development server
npm run dev
```
The app will be accessible at `http://localhost:3000`.

### 3. Build for Production
```bash
# Compile and build production assets
npm run build

# Start production server
npm start
```

---

## 📜 License
Apache-2.0 License. Built for **SAMP (Social Automation & Marketing Platform)**.

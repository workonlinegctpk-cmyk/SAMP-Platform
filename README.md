# SAMP (Social Automation & Marketing Platform)

<p align="center">
  <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80" alt="SAMP Platform Banner" width="100%" style="border-radius: 12px;" />
</p>

<p align="center">
  <a href="#-features"><img src="https://img.shields.io/badge/Status-Production%20Ready-emerald?style=for-the-badge&logo=rocket" alt="Status" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-61dafb?style=for-the-badge&logo=react" alt="React 19" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS v4" /></a>
  <a href="#-database-schema"><img src="https://img.shields.io/badge/Database-PostgreSQL%2014%2B-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL" /></a>
  <a href="#-license"><img src="https://img.shields.io/badge/License-Apache--2.0-indigo?style=for-the-badge" alt="License" /></a>
</p>

---

## ⚡ Overview

**SAMP (Social Automation & Marketing Platform)** is a high-velocity, enterprise-grade social media management, real-time scheduling, and marketing automation platform built with the modern UI aesthetics, tools, and workflows inspired by **[HeroPost](https://app.heropost.io/)**.

Engineered for marketing teams, media agencies, and modern creators, SAMP enables seamless multi-channel publishing, pixel-accurate live feed preview simulation, automated evergreen recycling queues, RSS-to-social ingestion pipelines, cross-network community triage, and normalized performance analytics.

---

## 🚀 Key Modules & Services

### 1. ✍️ Multi-Platform Post Composer & Device Simulator
- **Unified Multi-Network Publishing**: Target **Instagram, X (Twitter), LinkedIn, Facebook, TikTok, YouTube, Pinterest, and Threads** in a single flow.
- **Pixel-Accurate Device Previews**: Live side-by-side feed simulation matching the exact UI of:
  - **Instagram**: Feed post, Reels, Stories, carousels, action icons, likes counter, caption hashtags, and first comments.
  - **X (Twitter)**: Handle, blue verified badge, tweet body, embedded media cards, retweet/like/view counts.
  - **LinkedIn**: Company page or profile, "Promoted" or "1st" tag, formatted body, full-bleed media, and 5-way reaction bar (Like, Celebrate, Support, Insightful, Funny).
  - **Facebook**: Page brand name, globe public indicator, formatted copy, and social actions.
  - **TikTok**: Vertical phone mock with floating heart/comment/share rail, audio disc ticker, and caption overlay.
- **Real-Time Character Count Guards**: Visual warning indicators per platform (280 for X, 2,200 for Instagram, 3,000 for LinkedIn, 5,000 for YouTube).
- **First Comment Automation**: Auto-dispatch initial comment containing hashtags or attribution immediately upon publishing (HeroPost signature feature).
- **UTM Tracking Parameter Builder**: Auto-appends `utm_source`, `utm_medium`, and `utm_campaign` to outbound links for Google Analytics attribution.
- **Local Media File Upload & Library**: Drag-and-drop local image/video files, or select from high-resolution curated asset libraries.

### 2. 📅 Interactive Publishing Calendar & Real-Time Scheduler
- **Multi-View Planner**: Toggle between **Month**, **7-Day Rolling Horizon**, and **Timeline List** layouts.
- **Active Real-Time Background Scheduler**: Dedicated backend engine worker continuously polls scheduled timestamps, transitions post states (`draft` ➔ `queued` ➔ `scheduled` ➔ `publishing` ➔ `published`), and writes diagnostic delivery logs.
- **Status Badges & Filtering**: Filter by network, publication status, or workspace tag.
- **One-Click Dispatch**: Immediately publish any scheduled post ahead of time.

### 3. 🌐 Social Accounts & Real Credential Management
- Support for 8 major social networks with official developer credentials:
  - **Meta (Instagram Graph API & Facebook Pages)**: Page Access Token, App ID, App Secret, and Page / IG Business ID.
  - **Twitter / X API v2**: Client ID, Client Secret, API Key, and OAuth 2.0 User Bearer Token (`tweet.read`, `tweet.write`, `users.read`).
  - **LinkedIn**: Client ID, Client Secret, and Member / Organization OAuth Token (`w_member_social`, `w_organization_social`).
  - **TikTok for Developers**: Client Key, Client Secret, and Content Posting API Token.
  - **YouTube Data API v3**: Google Client ID, Channel ID, and OAuth 2.0 Access Token.
  - **Pinterest & Threads**: Developer API tokens with scoped publishing permissions.
- **Live Connection Verification (`POST /api/accounts/verify`)**: Validates token format, response latency (ms), and active OAuth permissions.
- **On-Demand Health Check (`POST /api/accounts/:id/test`)**: Ping active channels at any time to verify token health.

### 4. ⚙️ Automations & Smart Recycling Loops
- **RSS to Social Auto-Publishing**: Ingest feeds from blogs, news sources, or podcasts and automatically draft or publish formatted posts with custom templates (e.g. `{title} - {link} #tech`).
- **Evergreen Content Recycler**: Recirculate timeless top posts on customizable recurring cycles (e.g. every 24h, 48h, 72h).
- **Bulk CSV / JSON Post Scheduler**: Upload spreadsheets with hundreds of captions, target networks, and publish timestamps for instant batch scheduling.

### 5. 📬 Unified Social Inbox (Community Stream)
- Consolidates incoming comments, direct messages, and brand mentions across all linked channels into one streamlined triage queue.
- **Real-Time Sentiment Tagging**: Prioritizes interactions into `Positive`, `Neutral`, and `Urgent Attention / Negative`.
- **Instant In-App Replies**: Synchronizes immediate replies directly back to the respective social channel.

### 6. 📊 Integrated Analytics & Heatmap Dashboard
- **Executive KPIs**: Total audience reach, gross impressions, link click conversions, active accounts, and monthly growth velocity.
- **Audience Activity Heatmap**: 7-day x 24-hour matrix revealing optimal engagement windows with AI scoring.
- **Channel Breakdown**: Normalized engagement rates and leaderboard for top-performing posts with CSV export.

### 7. 🐙 Automated GitHub API Repository Deployer (`SAMP-Platform`)
- **Direct GitHub REST API Push**: Enter your GitHub Personal Access Token (`repo` scope) to automatically:
  1. Create the repository **`SAMP-Platform`** on your GitHub account.
  2. Commit every single project file (frontend, backend, schema, config, workflows).
  3. Deploy the GitHub Actions CI/CD pipeline (`.github/workflows/deploy.yml`).
  4. Return the live repository link: `https://github.com/<your-username>/SAMP-Platform`.
- **One-Click Source Code ZIP Download**: Download the entire repository bundle directly in-browser.

---

## 🗄️ Robust PostgreSQL Database Schema (`schema.sql`)

The schema is built for production scalability, partial retries, and high-concurrency scheduling:

```sql
-- Core Table Entities:
1.  workspaces                 -- Multi-tenant isolation & workspace configurations
2.  social_accounts            -- OAuth tokens, refresh tokens, status, audience
3.  scheduled_posts            -- Content, schedule timestamp, status, UTMs, first comment
4.  post_media                 -- Attached images, videos, carousels, aspect ratios
5.  post_target_accounts       -- Junction mapping posts to target channels
6.  publishing_delivery_logs   -- Real-time audit log with status, platform post IDs, and latencies
7.  queue_timeslots            -- Weekly publication slots for queue automation
8.  rss_automations            -- RSS feed tracking and automated posting rules
9.  evergreen_queues           -- Recycling loops for high-performing content
10. inbox_messages             -- Cross-network comments, DMs, mentions with sentiment
11. inbox_replies              -- Fast reply thread tracking
12. analytics_snapshots        -- Historical daily KPI aggregates per account
```

### Critical High-Performance Partial Index
```sql
-- Enables sub-millisecond query execution for background scheduling workers:
CREATE INDEX idx_posts_scheduler_due 
  ON scheduled_posts (scheduled_for ASC) 
  WHERE status IN ('scheduled', 'queued');
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, Motion, JSZip |
| **Backend** | Node.js, Express, tsx, RESTful JSON API |
| **Database** | PostgreSQL 14+ / Supabase / Cloud SQL (production schema) with JSON store fallback |
| **CI/CD** | GitHub Actions (`.github/workflows/deploy.yml`) |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20.x or 22.x
- npm or bun

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/SAMP-Platform.git
cd SAMP-Platform

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
# Optional: PostgreSQL Connection String
DATABASE_URL=postgresql://postgres:password@localhost:5432/samp_db
```

### 4. Development Mode
```bash
# Starts full-stack Express server with Vite middlewares
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
# Compile and build production assets
npm run build

# Start production server
npm start
```

---

## 🐳 Docker Deployment

A production-ready Dockerfile is included:

```dockerfile
FROM node:22-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run container:
```bash
docker build -t samp-platform .
docker run -p 3000:3000 samp-platform
```

---

## 📂 Project Structure

```
SAMP-Platform/
├── .github/
│   └── workflows/
│       └── deploy.yml        # Automated CI/CD deployment pipeline
├── data/
│   └── samp_store.json       # Persistent data store (clean zero-demo state)
├── src/
│   ├── components/
│   │   ├── AnalyticsDashboard.tsx   # Cross-platform analytics & posting heatmap
│   │   ├── AuthModal.tsx            # User registration & workspace creation
│   │   ├── AutomationQueues.tsx     # RSS auto-posting, Evergreen recycler, Bulk CSV
│   │   ├── CalendarView.tsx         # Month, Week, List scheduling calendar
│   │   ├── Composer.tsx             # Flagship composer with 5-channel live feed simulators
│   │   ├── Dashboard.tsx            # KPI command center & real-time delivery audit
│   │   ├── DatabaseSchemaViewer.tsx # Visual PostgreSQL schema explorer & SQL export
│   │   ├── GitHubDeployModal.tsx    # Automated GitHub REST API deployer & ZIP exporter
│   │   ├── Logo.tsx                 # Dynamic SVG SAMP automation logo
│   │   ├── Navbar.tsx               # Top navigation, user profile, live scheduler pulse
│   │   ├── Sidebar.tsx              # HeroPost-style navigation links
│   │   ├── SocialAccounts.tsx       # Channel credentials manager & token health check
│   │   └── SocialInbox.tsx          # Unified community stream & sentiment reply triage
│   ├── services/
│   │   └── api.ts                   # Typed API service client
│   ├── types/
│   │   └── index.ts                 # Core TypeScript definitions & schemas
│   ├── App.tsx                      # Root application orchestrator
│   ├── index.css                    # Tailwind CSS v4 styling & dark luxury theme
│   └── main.tsx                     # React 19 entry point
├── Dockerfile                       # Production container definition
├── README.md                        # Documentation & architecture guide
├── schema.sql                       # Production PostgreSQL database DDL
├── server.ts                        # Full-stack Express server with real-time scheduler
├── package.json
└── vite.config.ts
```

---

## 📜 License

Licensed under the **Apache-2.0 License**. Crafted for **SAMP (Social Automation & Marketing Platform)**.

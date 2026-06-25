# 🎯 HydraHunt: AI-Powered Career Warfare Platform

HydraHunt is an end-to-end, autonomous resume management and job application engine. It treats the job market as a target environment, using AI to optimize "lethality" (match scores) and automating the discovery and application process.

## 🚀 Core Capabilities

- **Intelligent Fusion:** Upload multiple messy files (.pdf, .docx, .txt); the AI deduplicates and merges them into a structured career profile.
- **Lethality Optimization:** Real-time match scoring against specific job descriptions with a "Surgical Edit" diff-viewer for precise improvements.
- **The Resume Vault:** Full version control. Create, archive, and revert resume versions organized by industry folders.
- **The Strike Engine:**
    - **Auto-Hunt:** Background Puppeteer scraping of LinkedIn, Indeed, and Glassdoor.
    - **Fit Scoring:** Every discovered job is automatically scored against your best resume.
    - **Auto-Apply:** Autonomous form filling and resume submission.
    - **Mission Log:** A Kanban-style tracker for all applications from `Queued` to `Offer`.

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS 4, shadcn/ui.
- **Backend:** Node.js, Prisma ORM.
- **Database:** PostgreSQL (Production), SQLite (Development).
- **Queue/Cache:** Redis + BullMQ (for asynchronous scraping/applying).
- **Automation:** Puppeteer (Headless Browser).
- **AI Layer:** Google Gemini / Abacus AI.

---

## 📦 Deployment Guide

### 1. Prerequisites
- **Node.js** v20+
- **PostgreSQL** (Supabase, Neon, or local)
- **Redis** (Upstash, Railway, or local)

### 2. Environment Setup
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/dbname"

# AI API Keys
GEMINI_API_KEY="your_gemini_key"
ABACUS_API_KEY="your_abacus_key"

# Redis (for Strike Engine)
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD="your_redis_password"

# Auth
NEXTAUTH_SECRET="your_secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Installation & Local Setup
```bash
# Install dependencies
npm install

# Initialize Database
npx prisma generate
npx prisma db push
```

### 4. Running the Application

#### A. Start the Web App (Frontend & API)
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

#### B. Start the Strike Engine (Background Worker)
The Strike Engine must run as a separate process to handle Puppeteer and BullMQ tasks.
```bash
# Use ts-node to run the worker directly
npx ts-node server/strike-worker.ts
```

---

## 🚢 Production Deployment Strategy

Since the app consists of a web frontend and a heavy-duty background worker, a **hybrid deployment** is recommended:

### Part 1: Frontend & API (Vercel / Netlify)
Deploy the `/src` directory to Vercel. Ensure `DATABASE_URL` and `REDIS_HOST` are set in the environment variables.

### Part 2: Strike Engine & Infrastructure (Railway / Render / AWS)
The `strike-worker.ts` requires a persistent environment with Chromium installed for Puppeteer. 
- **Recommended:** Railway.app.
- **Deployment:** Set the start command to `node server/strike-worker.js` (after compiling TS).

### Part 3: Database
Use a hosted PostgreSQL provider (e.g., **Supabase** or **Neon**) to ensure your data is persistent and accessible by both Vercel and the background worker.

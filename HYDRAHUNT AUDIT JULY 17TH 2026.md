# ***HYDRAHUNT AUDIT JULY 17TH 2026***

Good map. The upload flow involves: src/app/page.tsx (landing) \+ src/components/landing/ResumeQuickScan.tsx (upload widget) \+ src/app/api/resumes/upload/route.ts \+ src/services/parsing-orchestrator.ts \+ src/lib/ai.ts \+ src/lib/db.ts. Let me read these critical files in parallel.

Now the critical AI/DB/auth layer \+ the dashboard upload UI \+ existing audit docs:

Found the smoking gun. In useResumes.ts line 96 the upload appends field name 'file' (singular), but the API route at src/app/api/resumes/upload/route.ts line 46 reads formData.getAll('files') (plural) → always returns empty array → 400 "No files uploaded". Let me confirm the rest and read the existing audit docs \+ config in parallel.

The existing AUDIT\_REPORT.md is stale (references a different repo HYDRAHUNT\_STITCH\_Z\_190126 and files like App.tsx/vite.config.ts that don't exist here, and claims NextAuth "not configured" — but it actually is now). I need a fresh audit. Let me read the remaining critical files in parallel.

Second smoking gun. The middleware protects /api/resumes/quick-scan (it's not in the public list), but the landing-page ResumeQuickScan widget calls it unauthenticated → gets redirected to /login → JSON parse fails → "We could not assess your resume." So the landing-page upload is broken by middleware too. Let me read the remaining critical files.

Let me grep for all env var usage and read the remaining key API routes \+ the worklog in parallel.

No .env or .env.example exists (build prompt required one). mini-services/ is empty. Root services/ duplicates src/services/. Let me read the analyze route, ats-analyzer, signup route, and strike routes to complete the picture.

I now have a comprehensive, evidence-based picture. Let me update the todos and write the full audit report.

Audit complete. Here's the summary, Jay.

## What I did

Cloned your repo, read the full HYDRAHUNT BUILD PROMPT.md, and audited every file in the upload/AI/auth/data/deploy chain against it. The full report is saved to AUDIT\_REPORT\_FRESH.md in your repo root (the pre-existing AUDIT\_REPORT.md is stale — it describes a *different* repo and is wrong about NextAuth).

## TL;DR — current state

\~35% deployment-ready. The cyber-tactical UI is polished and NextAuth (login/signup/Google) is genuinely wired, but 5 of the 6 build-prompt modules are mockups, the AI layer is split across two providers with two env vars, and there are real security holes.

## 🔴 Why "Upload Resume" doesn't work — TWO independent bugs

Path A — landing-page "Get Assessed Instantly" widget

1. middleware.ts doesn't list /api/resumes/quick-scan as public → unauthenticated fetch() gets redirected to /login (HTML) → JSON parse fails → "We could not assess your resume."  
2. Even authed, if GEMINI\_API\_KEY/API\_KEY is missing, the route silently returns a fake {atsScore: 60, strengths: \[\], …} — looks broken.

Path B — dashboard Module-1 upload

* useResumes.ts sends field name file (singular), but /api/resumes/upload reads getAll('files') (plural) → always \[\] → 400 "No files uploaded" every single time. Classic typo.  
* Even after fixing that, it still needs GEMINI\_API\_KEY \+ a reachable Postgres.

## Other critical findings

* IDOR: GET/POST /api/resumes trust a client-supplied userId — any logged-in user can read/create *another user's* resumes.  
* JobTarget & AnalysisReport have no userId — global shared pool.  
* Prisma mismatch: schema says postgresql but a prisma/dev.db (SQLite) is committed; README says "SQLite for dev."  
* No .env.example — and .gitignore's .env\* pattern actively blocks one.  
* strike-queue.ts opens Redis at import time → breaks Vercel serverless.  
* Auto-apply is a demo stub (never clicks submit; uploads a non-existent /tmp/resume.pdf).  
* next.config.ts ships with ignoreBuildErrors: true.  
* Dashboard/Forge/Vault render hardcoded mock data (Stark Industries, "Alex Sterling", SYSTEMS\_ARCH\_V4.PDF).

## The fix plan (in the report, 5 phases)

* Phase 0 (1–2h) — fix the upload: rename field to files, whitelist quick-scan in middleware, fail loudly instead of fake-60.  
* Phase 1 (3–4h) — security: derive userId from session everywhere, add userId to JobTarget/AnalysisReport, resolve Prisma provider, add .env.example.  
* Phase 2 (4–6h) — unify the AI layer behind one service class \+ one env var.  
* Phase 3 (8–12h) — wire all mockup pages to real data \+ finish Module 2 (5 templates, inline edit, autosave, export, dnd).  
* Phase 4 (10–15h) — Module 5 reality (real scrapers, real PDF gen, real cover letters, disclaimer modal, split deploy for the Puppeteer worker).


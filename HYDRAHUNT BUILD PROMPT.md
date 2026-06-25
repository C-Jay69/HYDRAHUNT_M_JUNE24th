# ***HYDRAHUNT BUILD PROMPT***

\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*IMPORTANT\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*

***"Build Module 1 fully, then stop and wait for me to say 'next'."***

***\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\****

You are a senior full-stack engineer. Build a web application called "ResumeForge AI"  
— an end-to-end, AI-powered resume management and job application platform.

Read this ENTIRE specification before generating any code. Do not begin output  
until you have internalized every module, constraint, and dependency described below.

═══════════════════════════════════════════════════════════════  
TECH STACK (Use exactly these unless a conflict arises, in which case  
state the conflict and your substitution before proceeding):  
═══════════════════════════════════════════════════════════════

  Frontend  → React 18+ with TypeScript, TailwindCSS, shadcn/ui  
  Backend   → Node.js / Express (TypeScript)  
  Database  → PostgreSQL via Prisma ORM  
  Auth      → Clerk or NextAuth (your choice — justify briefly)  
  AI Layer  → OpenAI API (GPT-4o) — abstract behind a service class  
              so the model provider can be swapped later  
  File Parsing →  
      • PDF   : pdf-parse  
      • DOCX  : mammoth  
      • TXT   : native fs  
  Storage   → AWS S3 (or compatible) for file/resume storage  
  Web Scraping → Puppeteer \+ Cheerio (for job discovery)  
  Queue     → BullMQ (Redis-backed) for async job scraping/application tasks  
  Export    → React-PDF for generating styled resume PDFs

═══════════════════════════════════════════════════════════════  
MODULE 1 — DOCUMENT UPLOAD & INTELLIGENT PARSING  
═══════════════════════════════════════════════════════════════

GOAL: The user should be able to upload one OR MULTIPLE files  
(.txt, .pdf, .docx) containing \*unstructured, messy, random\*  
career-relevant information — and the system extracts structured  
resume data from it.

REQUIREMENTS:  
  1\. Drag-and-drop upload zone \+ traditional file picker.  
  2\. Accept: .txt, .pdf, .docx — reject everything else with a  
     clear error message and accepted-format list.  
  3\. Parse each file → extract raw text.  
  4\. Send extracted text to the AI layer with a prompt that instructs  
     it to identify and categorize:  
       \- Contact info (name, email, phone, LinkedIn, portfolio URL)  
       \- Work experience (title, company, dates, bullet points)  
       \- Education (institution, degree, field, dates, GPA if present)  
       \- Skills (technical & soft — separate them)  
       \- Certifications / Licenses  
       \- Projects  
       \- Awards / Publications / Volunteer work  
       \- Any other relevant resume content  
  5\. If data is ambiguous or incomplete, the AI should flag it with  
     a confidence score and ask the user to confirm/correct via  
     inline prompts in the UI.  
  6\. Multiple files should MERGE intelligently — deduplicate entries,  
     resolve conflicts by prompting the user.

OUTPUT: A structured JSON resume object stored in the database.

═══════════════════════════════════════════════════════════════  
MODULE 2 — RESUME BUILDER & TEMPLATE ENGINE  
═══════════════════════════════════════════════════════════════

GOAL: Take the structured JSON from Module 1 and render it into a  
beautiful, professional, ATS-friendly resume.

REQUIREMENTS:  
  1\. Provide a MINIMUM of 5 distinct resume templates:  
       \- Classic / Traditional  
       \- Modern / Minimalist  
       \- Creative (subtle color accents, icons)  
       \- Executive (for senior-level roles)  
       \- Technical (optimized for engineering/IT — skills-heavy)  
  2\. Live preview — the user sees changes in real-time as they edit.  
  3\. Every field is directly editable inline on the preview.  
  4\. Drag-and-drop section reordering.  
  5\. Custom color accent picker (primary color at minimum).  
  6\. Export to PDF (pixel-perfect) and DOCX.  
  7\. Every resume auto-saves on each change (debounced 2 seconds).

═══════════════════════════════════════════════════════════════  
MODULE 3 — AI RESUME ANALYZER & OPTIMIZER  
═══════════════════════════════════════════════════════════════

GOAL: The user specifies a target job field / title. The AI evaluates  
how well their resume is suited and provides actionable feedback.

REQUIREMENTS:  
  1\. Input: User enters one or more target job titles or fields  
     (e.g., "Frontend Developer", "Data Analyst", "Cybersecurity").  
  2\. The AI analyzes the resume against the target and returns:  
       a. MATCH SCORE — 0 to 100 with a visual gauge/meter.  
       b. STRENGTHS — what already aligns well (list with explanations).  
       c. GAPS — what is missing or weak (list with explanations).  
       d. KEYWORD ANALYSIS — important ATS keywords for that field  
          that are present vs. missing.  
       e. SPECIFIC SUGGESTIONS — concrete, ranked changes to improve  
          the score (e.g., "Add a bullet point under \[Job X\]  
          highlighting \[Skill Y\] experience").  
  3\. After viewing the analysis, the user gets TWO buttons:  
       ┌─────────────────────────┐  ┌──────────────────────────────┐  
       │  ✏️  I'll Edit Myself   │  │  🤖 Let AI Make the Changes  │  
       └─────────────────────────┘  └──────────────────────────────┘  
  4\. "I'll Edit Myself" → returns to the builder (Module 2\) with the  
     suggestions displayed in a collapsible sidebar for reference.  
  5\. "Let AI Make the Changes" → AI generates a NEW version of the  
     resume with all suggested improvements applied. Show a  
     DIFF VIEW (before/after, highlighted changes) so the user can  
     accept or reject each change individually or accept all.  
  6\. The modified resume becomes a new version (see Module 4).

═══════════════════════════════════════════════════════════════  
MODULE 4 — RESUME VERSION MANAGER ("My Resume Vault")  
═══════════════════════════════════════════════════════════════

GOAL: Users accumulate many resume versions. Give them a clean  
folder/file-management interface.

REQUIREMENTS:  
  1\. Default folder: "All Resumes"  
  2\. User can create custom folders (e.g., "Tech Jobs", "Finance",  
     "Career Change — Cyber").  
  3\. Each resume card shows:  
       \- Thumbnail preview  
       \- Title (editable)  
       \- Template used  
       \- Last modified date  
       \- Match score badge (if analyzed)  
       \- Target job field tag  
  4\. Actions per resume: Duplicate, Move, Rename, Delete, Download,  
     Open in Builder, Run Analysis.  
  5\. Version history within each resume — user can revert to any  
     prior version.

═══════════════════════════════════════════════════════════════  
MODULE 5 — AI JOB DISCOVERY & AUTO-APPLY ENGINE  
═══════════════════════════════════════════════════════════════

GOAL: Scrape the web for job listings that match the user's resume  
and, with the user's permission, apply on their behalf.

REQUIREMENTS:  
  1\. JOB DISCOVERY:  
       \- Scrape from: Indeed, LinkedIn Jobs, Glassdoor, ZipRecruiter  
         (use Puppeteer; respect robots.txt and rate-limit).  
       \- Match criteria derived FROM the resume: skills, experience  
         level, job titles, location preference (user sets location \+  
         radius \+ remote/hybrid/onsite preference).  
       \- Present results in a ranked list with:  
           • Job title, company, location, salary range (if available)  
           • AI-generated "Fit Score" (how well THIS resume matches  
             THIS specific job description)  
           • Key matching skills (highlighted)  
           • Key missing skills (flagged)  
  2\. AUTO-APPLY:  
       \- User selects jobs to apply to (checkbox multi-select).  
       \- For each selected job, the system:  
           a. Navigates to the application page.  
           b. Fills in standard fields (name, email, phone, etc.)  
              from the user's profile.  
           c. Uploads the resume (selects the best-matched version  
              or lets the user choose).  
           d. If a cover letter is required → AI generates a  
              tailored cover letter for that specific job.  
           e. Logs the application: status (Applied / Failed /  
              Requires Manual Action), date, link.  
       \- If the application flow is too complex or has CAPTCHA →  
         mark as "Requires Manual Action" and give the user a  
         direct link. NEVER attempt to bypass CAPTCHAs.  
  3\. APPLICATION TRACKER DASHBOARD:  
       \- Table/Kanban view of all applications.  
       \- Statuses: Queued → Applied → Interview → Offer → Rejected  
         (user manually updates post-apply statuses).  
       \- Filters: by date, status, company, fit score.

⚠️  LEGAL/ETHICAL NOTE: Include a clear disclaimer in the UI that  
auto-applying uses automation and that the user is responsible for  
reviewing applications. Add a confirmation modal before batch-applying.

═══════════════════════════════════════════════════════════════  
MODULE 6 — CAREER CHANGE ADVISOR  
═══════════════════════════════════════════════════════════════

GOAL: A user wants to transition from their current career to a  
completely different one (e.g., Accountant → Cybersecurity). Guide  
them with a full transition roadmap.

REQUIREMENTS:  
  1\. Input: User selects current field (auto-detected from resume)  
     and desired target field.  
  2\. The AI performs a GAP ANALYSIS:  
       a. TRANSFERABLE SKILLS — what carries over and how to frame it.  
       b. MISSING QUALIFICATIONS — degrees, certifications, skills  
          that are expected/required in the target field.  
       c. EXPERIENCE GAPS — types of experience they lack.  
  3\. COURSE & CERTIFICATION RECOMMENDATIONS:  
       \- For each gap identified, suggest specific courses:  
           • Free options (Coursera audit, edX, freeCodeCamp,  
             Khan Academy, YouTube playlists, MIT OCW, etc.)  
           • Paid options (Udemy, Coursera paid, bootcamps,  
             university programs, professional certs like CompTIA,  
             AWS, CPA, etc.)  
       \- Each suggestion includes:  
           • Course/program name  
           • Provider  
           • Cost (Free / $XX)  
           • Duration (estimated)  
           • Direct clickable URL/link  
           • Relevance tag (which gap it fills)  
       \- Sort by: relevance first, then by cost (free first).  
  4\. TRANSITION ROADMAP:  
       \- Generate a phased timeline:  
           Phase 1: "Quick wins" — skills/certs achievable in 1-3 months  
           Phase 2: "Core building" — 3-6 months  
           Phase 3: "Job-ready" — 6-12 months  
       \- Visual timeline component in the UI.  
  5\. RESUME REFRAMING:  
       \- Offer to generate a NEW resume version that reframes the  
         user's existing experience to emphasize transferable skills  
         for the target field. Store in vault (Module 4).

═══════════════════════════════════════════════════════════════  
CROSS-CUTTING CONCERNS  
═══════════════════════════════════════════════════════════════

  • AUTHENTICATION: Full sign-up / login / password reset flow.  
    All data is per-user and private.

  • RESPONSIVE DESIGN: Must work on desktop and tablet. Mobile is  
    nice-to-have but not required for V1.

  • ERROR HANDLING: Every API call wrapped in try/catch. User-facing  
    errors must be friendly and actionable ("We couldn't parse your  
    file. Please ensure it's a valid PDF, DOCX, or TXT file.").

  • LOADING STATES: Skeleton loaders for all async operations.  
    AI operations show a progress indicator with estimated wait time.

  • RATE LIMITING: Rate-limit AI calls per user to prevent abuse.  
    Rate-limit scraping to avoid IP bans.

  • ENVIRONMENT VARIABLES: All API keys, secrets, and config in .env  
    — never hardcoded. Provide a .env.example file.

  • DATABASE SCHEMA: Design the full Prisma schema FIRST before  
    writing any application code. Include it in your output.

  • PROJECT STRUCTURE: Monorepo with /client and /server directories.  
    Clear separation of concerns: routes → controllers → services.

═══════════════════════════════════════════════════════════════  
OUTPUT INSTRUCTIONS  
═══════════════════════════════════════════════════════════════

  1\. Start with a brief architecture overview (3-5 sentences max).  
  2\. Output the full Prisma schema.  
  3\. Build module-by-module in the order listed (1 through 6).  
  4\. For each module, output:  
       a. Backend: routes, controllers, service logic, AI prompts.  
       b. Frontend: components, pages, hooks, API integration.  
  5\. Include a complete package.json for both /client and /server.  
  6\. Include a README.md with setup instructions.  
  7\. If any single file would exceed 400 lines, split it logically  
     and state the file path for each.

Do NOT summarize or abbreviate code. Output COMPLETE, production-ready,  
copy-paste-runnable code for every file.

Begin.  

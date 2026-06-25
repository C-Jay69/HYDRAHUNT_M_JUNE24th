/**
 * HydraHunt Strike Engine — Background Worker Process
 *
 * Run this file directly with Node.js (outside of Next.js):
 *   npx tsx server/strike-worker.ts
 *
 * BullMQ bundles its own ioredis internally, so we pass a plain connection
 * options object rather than an IORedis instance to avoid version conflicts.
 */

import { Worker } from 'bullmq';
import { QueueName } from '../src/lib/strike-queue';
import { JobScraper } from '../src/services/scraper';
import { AutoApplyService } from '../src/services/auto-apply';
import { db } from '../src/lib/db';

// Plain connection options — BullMQ uses its own bundled ioredis
const connectionOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, // Required by BullMQ
};

const scraper = new JobScraper();
const autoApply = new AutoApplyService();

// ─── JOB HUNT WORKER ─────────────────────────────────────────────────────────
const jobHuntWorker = new Worker(
  QueueName.JOB_HUNT,
  async (job) => {
    const { userId, resumeId, location, query } = job.data;
    console.log(`[StrikeEngine] Hunting for "${query}" in ${location}...`);

    const resume = await db.resumeVersion.findFirst({
      where: { resumeId },
      include: { experiences: true, educations: true, skills: true },
    });

    if (!resume) throw new Error(`Resume version ${resumeId} not found`);

    const resumeData = {
      ...resume,
      title: resume.title ?? '',
      experience: resume.experiences,
      education: resume.educations,
      skills: resume.skills,
    };

    const results = await scraper.hunt(query, location, resumeData as any);
    const savedTargets = [];

    for (const res of results) {
      const target = await db.jobTarget.create({
        data: {
          title: res.job.title,
          company: res.job.company,
          location: res.job.location,
          jobUrl: res.job.jobUrl,
          matchScore: res.fitScore,
          status: 'NEW',
        },
      });
      savedTargets.push(target);
    }

    return {
      targetsFound: results.length,
      targetIds: savedTargets.map((t) => t.id),
    };
  },
  { connection: connectionOptions }
);

// ─── AUTO APPLY WORKER ───────────────────────────────────────────────────────
const autoApplyWorker = new Worker(
  QueueName.AUTO_APPLY,
  async (job) => {
    const { resumeId, jobUrl, userId } = job.data;
    console.log(`[StrikeEngine] Executing Auto-Apply to ${jobUrl}...`);

    const resume = await db.resumeVersion.findFirst({
      where: { resumeId },
      include: { experiences: true, educations: true, skills: true },
    });

    if (!resume) throw new Error(`Resume version ${resumeId} not found`);

    const resumeData = {
      ...resume,
      title: resume.title ?? '',
      experience: resume.experiences,
      education: resume.educations,
      skills: resume.skills,
    };

    const result = await autoApply.apply(resumeData as any, jobUrl);

    await db.jobStrike.create({
      data: {
        userId,
        resumeId,
        jobTitle: 'Auto-Applied Job',
        company: 'Unknown',
        location: 'Unknown',
        jobUrl,
        status: result.status === 'APPLIED' ? 'CONFIRMED' : 'PENDING',
        notes: result.message,
      },
    });

    return result;
  },
  { connection: connectionOptions }
);

// ─── Event Listeners ─────────────────────────────────────────────────────────
jobHuntWorker.on('completed', (job) =>
  console.log(`[StrikeEngine] Hunt mission ${job.id} completed`)
);
jobHuntWorker.on('failed', (job, err) =>
  console.error(`[StrikeEngine] Hunt mission ${job?.id} failed: ${err.message}`)
);
autoApplyWorker.on('completed', (job) =>
  console.log(`[StrikeEngine] Auto-Apply mission ${job.id} completed`)
);
autoApplyWorker.on('failed', (job, err) =>
  console.error(`[StrikeEngine] Auto-Apply mission ${job?.id} failed: ${err.message}`)
);

console.log('🚀 HydraHunt Strike Engine Workers Active');

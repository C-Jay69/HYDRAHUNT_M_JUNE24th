/**
 * Strike Queue — server-only (BullMQ)
 *
 * This file must NEVER be imported by client components or Next.js pages directly.
 * It is only used by API routes (server-side) and the standalone strike-worker.
 *
 * BullMQ bundles its own ioredis internally. We pass a plain connection options
 * object to avoid version conflicts with the top-level ioredis package.
 */
import { Queue } from 'bullmq';

// Plain connection options — BullMQ uses its own bundled ioredis
const connectionOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, // Required by BullMQ
};

// Define Queue Names
export enum QueueName {
  JOB_HUNT = 'job-hunt',
  AUTO_APPLY = 'auto-apply',
}

// Queue Instances
export const jobHuntQueue = new Queue(QueueName.JOB_HUNT, {
  connection: connectionOptions,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: { count: 100 },
  },
});

export const autoApplyQueue = new Queue(QueueName.AUTO_APPLY, {
  connection: connectionOptions,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 10000,
    },
    removeOnComplete: { count: 100 },
  },
});

/**
 * Utility to add a job to a specific queue
 */
export async function addStrikeMission(queue: Queue, data: any, options: any = {}) {
  return await queue.add('strike-mission', data, options);
}

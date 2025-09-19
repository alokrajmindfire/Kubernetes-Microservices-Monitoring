import { Queue, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';

const redisHost = process.env.REDIS_HOST || 'redis';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

export const redisConnection = new IORedis({
  host: redisHost,
  port: redisPort,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export const jobQueue = new Queue('job-processing', {
  connection: redisConnection,
});

export const jobQueueEvents = new QueueEvents('job-processing', {
  connection: redisConnection,
});

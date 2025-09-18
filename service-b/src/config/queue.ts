import { Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import logger from './logger';

export const redisConnection = new IORedis(
  process.env.REDIS_HOST || 'redis://redis:6379',
  {
    maxRetriesPerRequest: null,
  },
);

export function createWorker(
  queueName: string,
  processor: (jobData: any) => Promise<any>,
) {
  const worker = new Worker(
    queueName,
    async (job) => {
      logger.info(`Processing job ${job.id} of type ${job.name}`);
      return await processor(job.data);
    },
    { connection: redisConnection },
  );

  worker.on('completed', (job, result) => {
    logger.info(
      `Job ${job.id} completed with result: ${JSON.stringify(result)}`,
    );
  });

  worker.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} failed with error: ${err.message}`);
  });

  const queueEvents = new QueueEvents(queueName, {
    connection: redisConnection,
  });
  queueEvents.on('completed', ({ jobId }) => {
    logger.info(`Queue Event: Job ${jobId} completed`);
  });

  return worker;
}

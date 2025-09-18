import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import logger from './logger';

const redisHost = process.env.REDIS_HOST || 'redis';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

export const redisConnection = new IORedis({
  host: redisHost,
  port: redisPort,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redisConnection.on('connect', () => {
  logger.info('Worker connected to Redis');
});

redisConnection.on('error', (err) => {
  logger.error('Worker Redis connection error:', err);
});

export const jobProcessingQueue = new Queue('job-processing', {
  connection: redisConnection,
});

export async function initializeQueue() {
  try {
    logger.info('Redis connection is ready');
    logger.info('Job processing queue initialized');
  } catch (error) {
    logger.error('Redis initialization failed:', error);
    throw error;
  }
}

import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import logger from './logger';

export const redisConnection = new IORedis(
  process.env.REDIS_HOST || 'redis://localhost:6379',
);

export const jobProcessingQueue = new Queue('asset-processing', {
  connection: redisConnection,
});

export async function initializeQueue() {
  try {
    await redisConnection.connect();
    redisConnection.on('connect', () => {
      logger.info('Worker connected to Redis');
    });

    redisConnection.on('error', (err) => {
      logger.error('Worker Redis connection error:', err);
    });

    logger.info('Redis connected successfully');
    logger.info('Asset processing queue initialized');
  } catch (error) {
    logger.error('Redis connection failed:', error);
    throw error;
  }
}

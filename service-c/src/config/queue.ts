import { Queue, QueueEvents } from 'bullmq'
import IORedis from 'ioredis'
import logger from './logger'

const redisHost = process.env.REDIS_HOST || 'redis'
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10)

export const redisConnection = new IORedis({
  host: redisHost,
  port: redisPort,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  retryStrategy: (times) => Math.min(times * 50, 2000),
})
redisConnection.on('connect', () => {
  logger.info('Worker connected to Redis')
})

redisConnection.on('error', (err) => {
  if (err.message.includes('LOADING')) {
    logger.info('Redis still loading dataset, retrying...')
  } else {
    logger.error('Redis error:', err)
  }
})
export const jobQueue = new Queue('job-processing', {
  connection: redisConnection,
})

export const jobQueueEvents = new QueueEvents('job-processing', {
  connection: redisConnection,
})

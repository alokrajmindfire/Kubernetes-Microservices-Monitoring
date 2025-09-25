import { Worker, QueueEvents } from 'bullmq'
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
export function createWorker(
  queueName: string,
  processor: (jobData: any) => Promise<any>,
) {
  const worker = new Worker(
    queueName,
    async (job) => {
      logger.info(`Processing job ${job.id} of type ${job.name}`)
      return await processor(job.data)
    },
    { connection: redisConnection, concurrency: 20 },
  )

  worker.on('completed', (job, result) => {
    logger.info(
      `Job ${job.id} completed with result: ${JSON.stringify(result)}`,
    )
  })

  worker.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} failed with error: ${err.message}`)
  })

  const queueEvents = new QueueEvents(queueName, {
    connection: redisConnection,
  })
  queueEvents.on('completed', ({ jobId }) => {
    logger.info(`Queue Event: Job ${jobId} completed`)
  })

  return worker
}

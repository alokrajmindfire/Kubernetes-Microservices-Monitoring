import { Request, Response } from 'express';
import { jobQueue, jobQueueEvents } from '../config/queue';
import {
  totalJobsSubmitted,
  totalJobsCompleted,
  queueLengthGauge,
  register,
} from '../metrics/metrics';
import logger from '../config/logger';

jobQueueEvents.on('waiting', async () => {
  const waiting = await jobQueue.getWaitingCount();
  const active = await jobQueue.getActiveCount();
  logger.info(`Waiting: ${waiting}, Active: ${active}`);
  queueLengthGauge.set(waiting + active);
  totalJobsSubmitted.inc();
});

jobQueueEvents.on('completed', async () => {
  const waiting = await jobQueue.getWaitingCount();
  const active = await jobQueue.getActiveCount();
  logger.info(`Waiting: ${waiting}, Active: ${active}`);
  queueLengthGauge.set(waiting + active);
  totalJobsCompleted.inc();
});

const reconcileMetrics = async () => {
  try {
    const waiting = await jobQueue.getWaitingCount();
    const active = await jobQueue.getActiveCount();
    const completed = await jobQueue.getCompletedCount();
    const failed = await jobQueue.getFailedCount();
    const delayed = await jobQueue.getDelayedCount();
    logger.info(`Waiting: ${waiting}, Active: ${active}`);
    queueLengthGauge.set(waiting + active);
    totalJobsSubmitted.set(waiting + active + completed + failed + delayed);
    totalJobsCompleted.set(completed);
  } catch (err) {
    console.error('Error reconciling metrics:', err);
  }
};
if (process.env.NODE_ENV !== 'test') {
  setInterval(reconcileMetrics, 1000);
}

export const getStats = async (_req: Request, res: Response) => {
  try {
    const waiting = await jobQueue.getWaitingCount();
    const active = await jobQueue.getActiveCount();
    const completed = await jobQueue.getCompletedCount();
    const failed = await jobQueue.getFailedCount();
    const delayed = await jobQueue.getDelayedCount();

    const totalJobs = waiting + active + completed + failed + delayed;
    const avgProcessingTime = await calculateAvgTime();

    res.json({
      status: 'success',
      data: {
        totalJobsSubmitted: totalJobs,
        totalJobsCompleted: completed,
        queueLength: waiting + active,
        avgProcessingTime,
      },
    });
  } catch (err: any) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const getMetrics = async (_req: Request, res: Response) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err: any) {
    console.error('Error fetching metrics:', err);
    res.status(500).send(err.message);
  }
};

const calculateAvgTime = async (): Promise<number> => {
  const completedJobs = await jobQueue.getJobs(['completed']);
  if (!completedJobs.length) return 0;
  const totalTime = completedJobs.reduce((acc, job) => {
    if (job.processedOn && job.finishedOn) {
      return acc + (job.finishedOn - job.processedOn);
    }
    return acc;
  }, 0);
  return totalTime / completedJobs.length / 1000;
};

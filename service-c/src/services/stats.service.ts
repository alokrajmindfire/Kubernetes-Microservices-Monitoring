import { jobQueue } from '../config/queue';

export class StatsService {
  static async getQueueStats() {
    const waiting = await jobQueue.getWaitingCount();
    const active = await jobQueue.getActiveCount();
    const completed = await jobQueue.getCompletedCount();
    const failed = await jobQueue.getFailedCount();
    const delayed = await jobQueue.getDelayedCount();

    const totalJobs = waiting + active + completed + failed + delayed;
    const avgProcessingTime = await StatsService.calculateAvgTime();

    return {
      totalJobsSubmitted: totalJobs,
      totalJobsCompleted: completed,
      queueLength: waiting + active,
      avgProcessingTime,
    };
  }

  static async calculateAvgTime(): Promise<number> {
    const completedJobs = await jobQueue.getJobs(['completed']);
    if (completedJobs.length === 0) return 0;
    const totalTime = completedJobs.reduce((acc, job) => {
      if (job.finishedOn && job.processedOn) {
        return acc + (job.finishedOn - job.processedOn);
      }
      return acc;
    }, 0);
    return totalTime / completedJobs.length / 1000;
  }
}

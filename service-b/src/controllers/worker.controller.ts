import { metrics } from '../metrics/metrics';
import { WorkerService } from '../services/worker.service';
import { redisConnection } from '../config/queue';

export class WorkerController {
  private workerService: WorkerService;

  constructor() {
    this.workerService = new WorkerService();
  }

  async handleJob(jobData: any) {
    const start = Date.now();
    try {
      const job = JSON.parse(jobData);
      const result = await this.workerService.processJob(job);

      await redisConnection.set(`job:${job.id}:result`, JSON.stringify(result));

      metrics.jobsProcessed.inc();
      metrics.jobProcessingTime.observe((Date.now() - start) / 1000);

      return { status: 'success', result };
    } catch (error: any) {
      metrics.jobErrors.inc();
      return { status: 'error', message: error.message };
    }
  }
}

import { jobProcessingQueue } from '../config/queue';
import { v4 as uuidv4 } from 'uuid';

const JOB_QUEUE = 'job_queue';

export interface Job {
  id: string;
  type: string;
}

export class JobRepository {
  static async submitJob(type: string): Promise<string> {
    const jobId = uuidv4();
    const job: Job = { id: jobId, type };
    const value = await jobProcessingQueue.add(JOB_QUEUE, JSON.stringify(job));
    console.log('value', value);
    return jobId;
  }

  static async getJobStatus(jobId: string): Promise<any> {
    const job = await jobProcessingQueue.getJob(`job:${jobId}`);
    if (job) {
      const status = await job.getState();
      return JSON.parse(status);
    }
    return { status: 'pending' };
  }
}

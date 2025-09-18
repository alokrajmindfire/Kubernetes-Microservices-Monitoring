import { JobRepository } from '../repositories/job.repository';

export class JobService {
  static async submitJob(type: string) {
    if (!type) throw new Error('Job type is required');
    return JobRepository.submitJob(type);
  }

  static async getJobStatus(jobId: string) {
    return JobRepository.getJobStatus(jobId);
  }
}

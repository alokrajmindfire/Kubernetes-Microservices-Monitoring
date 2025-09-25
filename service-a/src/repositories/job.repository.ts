import logger from '../config/logger'
import { jobProcessingQueue } from '../config/queue'
import { v4 as uuidv4 } from 'uuid'

const JOB_QUEUE = 'job_queue'

export interface Job {
  id: string
  type: string
}

export class JobRepository {
  static async submitJob(type: string): Promise<string> {
    const jobId = uuidv4()
    const job: Job = { id: jobId, type }
    await jobProcessingQueue.add(JOB_QUEUE, job, { jobId })

    logger.info(`Job id: ${jobId}`)
    return jobId
  }

  static async getJobStatus(jobId: string): Promise<any> {
    const job = await jobProcessingQueue.getJob(jobId)
    if (job) {
      const status = await job.getState()
      return { status }
    }
    throw new Error('Job not found')
  }
}

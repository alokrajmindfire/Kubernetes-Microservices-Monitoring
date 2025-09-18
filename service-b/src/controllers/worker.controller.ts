import { metrics } from '../metrics/metrics';
import { WorkerService } from '../services/worker.service';
import { redisConnection } from '../config/queue';

const ALLOWED_JOB_TYPES = ['primeCalc', 'bcryptHash', 'sortArray'];
const workerService = new WorkerService();

function validateJob(jobData: any) {
  if (!jobData) throw new Error('Job data is empty');

  let job: { id: string; type: string; payload?: any };

  if (typeof jobData === 'string') {
    try {
      job = JSON.parse(jobData);
    } catch {
      throw new Error('Invalid job format: must be valid JSON');
    }
  } else if (typeof jobData === 'object' && jobData !== null) {
    job = jobData;
  } else {
    throw new Error('Invalid job data type');
  }

  if (!job.id || typeof job.id !== 'string') {
    throw new Error('Job must contain a valid string "id"');
  }
  if (!job.type || typeof job.type !== 'string') {
    throw new Error('Job must contain a valid string "type"');
  }
  if (!ALLOWED_JOB_TYPES.includes(job.type)) {
    throw new Error(`Unsupported job type: ${job.type}`);
  }
  if (Object.prototype.hasOwnProperty.call(job, '__proto__')) {
    throw new Error('Invalid job payload');
  }
  if (job.payload && JSON.stringify(job.payload).length > 1e6) {
    throw new Error('Payload too large');
  }

  return job;
}

async function saveResult(jobId: string, result: any) {
  const redisKey = `job:${encodeURIComponent(jobId)}:result`;
  await redisConnection.set(redisKey, JSON.stringify(result), 'EX', 3600);
}

export const handleJob = async (jobData: any) => {
  const start = Date.now();

  try {
    const job = validateJob(jobData);
    const result = await workerService.processJob(job);
    await saveResult(job.id, result);

    metrics.jobsProcessed.inc();
    metrics.jobProcessingTime.observe((Date.now() - start) / 1000);

    return { status: 'success', result };
  } catch (error: any) {
    metrics.jobErrors.inc();
    console.error('Job processing error:', error);

    return {
      status: 'error',
      message: error?.message || 'Job processing failed',
    };
  }
};

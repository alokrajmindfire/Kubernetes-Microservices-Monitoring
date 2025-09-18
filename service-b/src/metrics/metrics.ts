import client from 'prom-client';

const register = new client.Registry();

const jobsProcessed = new client.Counter({
  name: 'jobs_processed_total',
  help: 'Total number of jobs processed',
});

const jobProcessingTime = new client.Histogram({
  name: 'job_processing_time_seconds',
  help: 'Histogram of job processing time in seconds',
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

const jobErrors = new client.Counter({
  name: 'job_errors_total',
  help: 'Total number of job errors',
});

register.registerMetric(jobsProcessed);
register.registerMetric(jobProcessingTime);
register.registerMetric(jobErrors);
register.setDefaultLabels({ app: 'service-b-worker' });

export const metrics = {
  jobsProcessed,
  jobProcessingTime,
  jobErrors,
  register,
};

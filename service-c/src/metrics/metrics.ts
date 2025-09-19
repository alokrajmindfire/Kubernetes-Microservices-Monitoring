import client from 'prom-client';

export const register = new client.Registry();

export const totalJobsSubmitted = new client.Gauge({
  name: 'total_jobs_submitted',
  help: 'Total jobs submitted to the queue',
});

export const totalJobsCompleted = new client.Gauge({
  name: 'total_jobs_completed',
  help: 'Total jobs successfully completed',
});

export const queueLengthGauge = new client.Gauge({
  name: 'queue_length',
  help: 'Current length of the queue',
});

register.registerMetric(totalJobsSubmitted);
register.registerMetric(totalJobsCompleted);
register.registerMetric(queueLengthGauge);

client.collectDefaultMetrics({ register });

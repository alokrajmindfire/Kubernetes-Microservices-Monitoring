import { Router } from 'express';
import { getMetrics } from '../controllers/worker.controller';
import logger from '../config/logger';

const router = Router();

router.route('/').get((_, res) => {
  logger.info('Service B is up and running');
  res.send('Service B (metric) is running successfully');
});

router.route('/api/health').get((_, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: { worker: 'running' },
  });
});

router.route('/metrics').get(getMetrics);

export default router;

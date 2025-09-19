import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { limiter } from './config/rate-limit';
import { ErrorHandler } from './utils/Error';
import { CORS_CONF, HELMET_CONFIG } from './utils/constants';
import { metrics } from './metrics/metrics';
import logger from './config/logger';

const app = express();

app.use(cors(CORS_CONF));
app.use(helmet(HELMET_CONFIG));
app.use(morgan('combined'));

app.use('/api/', limiter);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.get('/', (_, res) => {
  logger.info('Service B is up and running');
  res.send('Service B (metric) is running successfully');
});

app.get('/api/health', (_, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: { worker: 'running' },
  });
});

app.get('/metrics', async (_, res) => {
  res.set('Content-Type', metrics.register.contentType);
  res.end(await metrics.register.metrics());
});

app.use((req: Request, _: Response, next: NextFunction) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  (error as any).statusCode = 404;
  (error as any).isOperational = true;
  next(error);
});

app.use(ErrorHandler);

export { app };

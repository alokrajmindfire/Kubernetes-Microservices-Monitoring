import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { limiter } from './config/rate-limit';
import { ErrorHandler } from './utils/Error';
import { CORS_CONF, HELMET_CONFIG } from './utils/constants';
import cookieParser from 'cookie-parser';
import jobRoute from './routes/job.route';
const app = express();

app.use(cors(CORS_CONF));
app.use(helmet(HELMET_CONFIG));
app.use(morgan('combined'));

app.use('/api/', limiter);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

app.get('/api/health', (_, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {},
  });
});
app.use('/api', jobRoute);

app.use((req: Request, _: Response, next: NextFunction) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  (error as any).statusCode = 404;
  (error as any).isOperational = true;
  next(error);
});
app.use(ErrorHandler);

export { app };

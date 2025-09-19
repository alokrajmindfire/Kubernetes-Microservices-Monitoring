import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { limiter } from './config/rate-limit';
import { ErrorHandler } from './utils/Error';
import { CORS_CONF, HELMET_CONFIG } from './utils/constants';
import workerRoute from './routes/worker.route';
const app = express();

app.use(cors(CORS_CONF));
app.use(helmet(HELMET_CONFIG));
app.use(morgan('combined'));

app.use('/api/', limiter);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use('/', workerRoute);
app.use((req: Request, _: Response, next: NextFunction) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  (error as any).statusCode = 404;
  (error as any).isOperational = true;
  next(error);
});

app.use(ErrorHandler);

export { app };

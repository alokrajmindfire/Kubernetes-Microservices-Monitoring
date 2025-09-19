import dotenv from 'dotenv';
import logger from './config/logger';
import { app } from './app';

dotenv.config({
  path: './.env',
});

app.listen(process.env.PORT || 3003, () => {
  logger.info(`Server is running at port : ${process.env.PORT}`);
});

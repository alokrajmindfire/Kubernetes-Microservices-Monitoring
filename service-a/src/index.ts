import dotenv from 'dotenv';
import logger from './config/logger';
import { app } from './app';

dotenv.config({
  path: './.env',
});

app.use('/', () => {
  logger.info('Started');
});
app.listen(process.env.PORT || 3001, () => {
  logger.info(`Server is running at port : ${process.env.PORT}`);
});

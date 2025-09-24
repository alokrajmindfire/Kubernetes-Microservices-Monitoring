import dotenv from 'dotenv'
import logger from './config/logger'
import { app } from './app'
import { createWorker } from './config/queue'
import { handleJob } from './controllers/worker.controller'

dotenv.config({
  path: './.env',
})
const PORT = process.env.PORT || 3002

async function main() {
  createWorker('job-processing', async (jobData) => {
    // logger.info(`Worker received job: ${JSON.stringify(jobData)}`)
    return await handleJob(jobData)
  })

  app.listen(PORT, () => {
    logger.info(`Service B listening on port ${PORT}`)
  })

  logger.info('Service B Worker started and listening for jobs...')
}

main().catch((err) => {
  logger.error('Worker initialization failed:', err)
})

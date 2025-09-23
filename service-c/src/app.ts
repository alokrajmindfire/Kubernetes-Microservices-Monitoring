import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import statsRoute from './routes/stats.routes'
import logger from './config/logger'
import { ErrorHandler } from './utils/Error'
import { CORS_CONF, HELMET_CONFIG } from './utils/constants'

const app = express()
app.use(cors(CORS_CONF))
app.use(helmet(HELMET_CONFIG))
app.use(morgan('combined'))
app.use(express.json())

app.get('/', (_, res) => {
  logger.info('Service C is up and running')
  res.send('Service C (Stats/Aggregator) is running successfully')
})

app.use('/', statsRoute)

app.use((req: Request, _: Response, next: NextFunction) => {
  const error = new Error(`Route not found - ${req.originalUrl}`)
  ;(error as any).statusCode = 404
  ;(error as any).isOperational = true
  next(error)
})

app.use(ErrorHandler)

export { app }

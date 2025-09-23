import { Request, Response } from 'express'
import logger from '../config/logger'
import { ApiResponse } from '../utils/ApiResponse'
import { asyncHandler } from '../utils/asyncHandler'

export const getRoot = asyncHandler(async (_req: Request, res: Response) => {
  logger.info('Service B is up and running')
  const response = new ApiResponse<string>(
    200,
    'Service B (metric) is running successfully',
  )
  return res.status(response.statusCode).json(response)
})

export const getHealth = asyncHandler(async (_req: Request, res: Response) => {
  const data = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: { worker: 'running' },
  }
  const response = new ApiResponse(200, data, 'Service is healthy')
  return res.status(response.statusCode).json(response)
})

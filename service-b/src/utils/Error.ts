import { Request, Response } from 'express'
import logger from '../config/logger'

interface CustomError extends Error {
  statusCode?: number
  isOperational?: boolean
  details?: any
}

export const ErrorHandler = (err: CustomError, _: Request, res: Response) => {
  logger.error('Error Caught:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    details: err.details || null,
  })

  const statusCode = err.statusCode || 500
  const response = {
    success: false,
    error: {
      message:
        err.isOperational && err.message
          ? err.message
          : 'Something went wrong. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
      }),
      details: err.details || undefined,
    },
  }

  res.status(statusCode).json(response)
}

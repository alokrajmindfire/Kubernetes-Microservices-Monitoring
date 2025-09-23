import { Request, Response, NextFunction } from 'express'

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<any>

const asyncHandler =
  (fn: AsyncFn) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next)
    } catch (err: unknown) {
      let statusCode = 500
      let message = 'Internal Server Error'
      if (err instanceof Error) {
        message = err.message
      }
      if (typeof err === 'object' && err !== null) {
        const knownErr = err as {
          statusCode?: number
          status?: number
          message?: string
        }
        statusCode = knownErr.statusCode || knownErr.status || 500
        message = knownErr.message || message
      }

      res.status(statusCode).json({
        success: false,
        message,
      })
    }
  }

export { asyncHandler }

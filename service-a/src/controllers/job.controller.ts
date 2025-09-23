import { Request, Response } from 'express'
import { JobService } from '../services/job.service'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiError } from '../utils/ApiError'
import { ApiResponse } from '../utils/ApiResponse'
import { z } from 'zod'

const submitJobSchema = z.object({
  type: z.string().nonempty('Job type is required'),
})

const submitJob = asyncHandler(async (req: Request, res: Response) => {
  const parsedBody = submitJobSchema.safeParse(req.body)

  if (!parsedBody.success) {
    const errorMessages = parsedBody.error.message
    throw new ApiError(400, errorMessages)
  }
  const { type } = parsedBody.data
  if (!type) throw new ApiError(400, 'Job type required')

  const jobId = await JobService.submitJob(type)
  return res
    .status(201)
    .json(new ApiResponse(201, { jobId }, 'Job submitted successfully'))
})

const getStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const status = await JobService.getJobStatus(id)
  return res
    .status(201)
    .json(new ApiResponse(200, status, 'Jobs status retrieved'))
})

export { submitJob, getStatus }

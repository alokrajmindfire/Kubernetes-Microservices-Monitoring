import { Request, Response } from 'express';
import { JobService } from '../services/job.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

const submitJob = asyncHandler(async (req: Request, res: Response) => {
  const { type } = req.body;
  if (!type) throw new ApiError(400, 'Job type required');

  const jobId = await JobService.submitJob(type);
  return res
    .status(201)
    .json(new ApiResponse(201, { jobId }, 'Job submitted successfully'));
});

const getStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const status = await JobService.getJobStatus(id);
  return res
    .status(201)
    .json(new ApiResponse(200, status, 'Jobs status retrieved'));
});

export { submitJob, getStatus };

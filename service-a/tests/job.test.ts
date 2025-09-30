import request from 'supertest'
import { app } from '../src/app'
import { JobService } from '../src/services/job.service'

jest.mock('../src/services/job.service');

describe('Job Routes', () => {
  describe('POST /api/submit', () => {
    it('should return 201 and jobId when job type is provided', async () => {
      (JobService.submitJob as jest.Mock).mockResolvedValue('mock-job-id');

      const res = await request(app)
        .post('/api/submit')
        .send({ type: 'primeCalc' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.jobId).toBe('mock-job-id');
      expect(res.body.message).toBe('Job submitted successfully');
    });

    it('should return 400 if job type is missing', async () => {
      const res = await request(app)
        .post('/api/submit')
        .send({});

      // console.log(res.body);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);

      const parsedErrors = JSON.parse(res.body.message);

      expect(parsedErrors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'Invalid input: expected string, received undefined',
            path: ['type'],
          }),
        ])
      );
    });


  });

  describe('GET /api/status/:id', () => {
    it('should return 200 and job status if job exists', async () => {
      (JobService.getJobStatus as jest.Mock).mockResolvedValue({ status: 'completed' });

      const res = await request(app).get('/api/status/mock-job-id');

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('completed');
      expect(res.body.message).toBe('Jobs status retrieved');
    });

    it('should return 404 if job not found', async () => {
      (JobService.getJobStatus as jest.Mock).mockRejectedValue(new Error('Job not found'));

      const res = await request(app).get('/api/status/invalid-job-id');

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Job not found');
    });
  });
});

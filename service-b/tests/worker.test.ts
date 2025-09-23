import request from 'supertest'
import {app} from '../src/app'

import { handleJob } from "../src/controllers/worker.controller";
import { WorkerService } from "../src/services/worker.service";

jest.mock("../src/services/worker.service");
const MockWorkerService = WorkerService as jest.MockedClass<typeof WorkerService>;

describe("Service B Routes", () => {
  it("GET / should return running message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Service B (metric) is running successfully");
  });

  it("GET /api/health should return OK status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: "OK",
      services: { worker: "running" },
    });
  });

  it("GET /metrics should return metrics", async () => {
    const res = await request(app).get("/metrics");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/plain");
    expect(res.text).toContain("jobs_processed");
  });
});

describe("handleJob function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should process primeCalc job successfully", async () => {
    const mockResult = [2, 3, 5];
    MockWorkerService.prototype.processJob.mockResolvedValueOnce(mockResult);

    const response = await handleJob({ id: "123", type: "primeCalc" });

    expect(response.status).toBe("success");
    expect(response.result).toEqual(mockResult);
    expect(MockWorkerService.prototype.processJob).toHaveBeenCalledWith({
      id: "123",
      type: "primeCalc",
    });
  });

  it("should return error for invalid job data", async () => {
    const response = await handleJob(null);
    expect(response.status).toBe("error");
    expect(response.message).toContain("Job data is empty");
  });

  it("should return error for unsupported job type", async () => {
    const response = await handleJob({ id: "999", type: "invalidJob" });
    expect(response.status).toBe("error");
    expect(response.message).toContain("Unsupported job type");
  });

  it("should return error if worker throws", async () => {
    MockWorkerService.prototype.processJob.mockRejectedValueOnce(
      new Error("boom")
    );

    const response = await handleJob({ id: "123", type: "primeCalc" });

    expect(response.status).toBe("error");
    expect(response.message).toBe("boom");
  });
});

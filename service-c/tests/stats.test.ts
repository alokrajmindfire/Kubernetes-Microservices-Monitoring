import request from 'supertest';
import { app } from '../src/app';
import { jobQueue } from "../src/config/queue";

describe("Service C - Stats and Metrics Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (jobQueue.close) await jobQueue.close();
  });

  it("GET /stats should return queue stats", async () => {
    const res = await request(app).get("/stats").expect(200);
    // console.log(res.body);

    expect(res.body.success).toBe(true);
    expect(res.body.statusCode).toBe(200);
    expect(res.body.message).toBe("Job stats fetched successfully");

    expect(res.body.data).toEqual({
      totalJobsSubmitted: 11,
      totalJobsCompleted: 5,
      queueLength: 5,
      avgProcessingTime: 1.5,
    });
  });


  it("GET /metrics should return prometheus metrics", async () => {
    const res = await request(app).get("/metrics").expect(200);

    expect(res.headers["content-type"]).toContain("text/plain");
    expect(res.text).toBe("mock_metrics");
  });

  it("should handle error in /stats gracefully", async () => {
    const { jobQueue } = require("../src/config/queue");
    jobQueue.getWaitingCount.mockRejectedValueOnce(new Error("Redis down"));

    const res = await request(app).get("/stats").expect(500);
    // console.log(res.body);

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Redis down");
  });


  it("should handle error in /metrics gracefully", async () => {
    const { register } = require("../src/metrics/metrics");
    register.metrics.mockRejectedValueOnce(new Error("Prometheus error"));

    const res = await request(app).get("/metrics").expect(500);
    console.log(res.body, res.text)
    const jsonResponse = JSON.parse(res.text);

    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.message).toBe("Prometheus error");
  });


});

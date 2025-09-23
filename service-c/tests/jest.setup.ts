
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});
jest.mock("../src/config/queue", () => {
  const jobMock = {
    getWaitingCount: jest.fn().mockResolvedValue(2),
    getActiveCount: jest.fn().mockResolvedValue(3),
    getCompletedCount: jest.fn().mockResolvedValue(5),
    getFailedCount: jest.fn().mockResolvedValue(1),
    getDelayedCount: jest.fn().mockResolvedValue(0),
    getJobs: jest.fn().mockResolvedValue([
      { processedOn: 1000, finishedOn: 2000 },
      { processedOn: 2000, finishedOn: 4000 },
    ]),
    close: jest.fn().mockResolvedValue(undefined),
    jobQueueEvents: { on: jest.fn() },
  };
  return { jobQueue: jobMock, jobQueueEvents: jobMock.jobQueueEvents };
});

jest.mock("../src/metrics/metrics", () => ({
  register: {
    contentType: "text/plain",
    metrics: jest.fn().mockResolvedValue("mock_metrics"),
  },
  totalJobsSubmitted: { inc: jest.fn(), set: jest.fn() },
  totalJobsCompleted: { inc: jest.fn(), set: jest.fn() },
  queueLengthGauge: { set: jest.fn() },
}));

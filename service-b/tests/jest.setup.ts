jest.mock("../src/config/queue", () => ({
  redisConnection: { set: jest.fn().mockResolvedValue("OK") },
}));
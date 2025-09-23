jest.mock('../src/config/queue', () => ({
  jobProcessingQueue: {
    add: jest.fn(),
    getJob: jest.fn(),
  },
}));

// Mock for Sentry error tracking
export const mockSentry = {
  init: jest.fn(),
  captureException: jest.fn(),
};

// Initialize the mock
jest.mock('@sentry/node', () => mockSentry);
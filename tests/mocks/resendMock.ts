// Mock for Resend email service
export const mockResend = {
  emails: {
    send: jest.fn().mockResolvedValue({
      data: { id: 'test-email-id' },
      error: null,
    }),
  },
};

// Initialize the mock
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => mockResend),
}));
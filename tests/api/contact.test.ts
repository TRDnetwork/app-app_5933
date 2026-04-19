import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { handler } from '../../api/contact';
import { type VercelRequest, type VercelResponse } from '@vercel/node';

// Mock dependencies
vi.mock('resend');
vi.mock('@upstash/redis');
vi.mock('@sentry/node');

// Create mock request and response objects
const createMockRequest = (method = 'POST', body = {}) => {
  return {
    method,
    body,
    headers: {
      'x-forwarded-for': '192.168.1.1',
    },
    socket: {
      remoteAddress: '192.168.1.1',
    },
  };
};

const createMockResponse = () => {
  const res: VercelResponse = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    setHeader: vi.fn().mockReturnThis(),
  } as unknown as VercelResponse;
  return res;
};

describe('Contact Form API', () => {
  beforeEach(() => {
    // Mock environment variables
    process.env.RESEND_API_KEY = 're_test_key';
    process.env.UPSTASH_REDIS_REST_URL = 'https://test.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'test_token';
    process.env.CONTACT_EMAIL = 'test@example.com';
    process.env.SENTRY_DSN = 'https://test@sentry.io/123';
    process.env.RESEND_FROM_EMAIL = 'hello@your-portfolio.com';

    // Mock Redis methods
    vi.mocked(Redis).mockImplementation(() => ({
      incr: vi.fn().mockResolvedValue(1),
      expire: vi.fn().mockResolvedValue('OK'),
    }));

    // Mock Resend methods
    vi.mocked(Resend).mockImplementation(() => ({
      emails: {
        send: vi.fn().mockResolvedValue({ data: { id: 'test-id' } }),
      },
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns 405 for non-POST requests', async () => {
    const req = createMockRequest('GET', {});
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });

  it('returns 400 for missing required fields', async () => {
    const req = createMockRequest('POST', { name: 'John' });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required' });
  });

  it('returns 400 for invalid email format', async () => {
    const req = createMockRequest('POST', {
      name: 'John Doe',
      email: 'invalid-email',
      message: 'Hello',
    });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email address' });
  });

  it('applies rate limiting correctly', async () => {
    const redisInstance = vi.mocked(Redis).mock.results[0].value;
    
    // Mock Redis to return 6 for the 6th request
    redisInstance.incr.mockResolvedValue(6);

    const req = createMockRequest('POST', {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message',
    });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Rate limit exceeded. Please try again in an hour.',
    });
    expect(res.setHeader).toHaveBeenCalledWith('Retry-After', '3600');
  });

  it('sends emails successfully with valid data', async () => {
    const req = createMockRequest('POST', {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message',
    });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
    
    // Check that Resend was called twice (owner and confirmation)
    const resendInstance = vi.mocked(Resend).mock.results[0].value;
    expect(resendInstance.emails.send).toHaveBeenCalledTimes(2);
    
    // Check that emails were sent with correct data
    const sendCalls = resendInstance.emails.send.mock.calls;
    expect(sendCalls[0][0].from).toBe('hello@your-portfolio.com');
    expect(sendCalls[0][0].to).toBe('test@example.com');
    expect(sendCalls[0][0].subject).toContain('New message from John Doe');
    
    expect(sendCalls[1][0].from).toBe('hello@your-portfolio.com');
    expect(sendCalls[1][0].to).toBe('john@example.com');
    expect(sendCalls[1][0].subject).toBe('Thanks for reaching out!');
  });

  it('handles honeypot spam detection', async () => {
    const req = createMockRequest('POST', {
      name: 'Bot User',
      email: 'bot@example.com',
      message: 'Spam message',
      'bot-field': 'filled',
    });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
    
    // Check that no emails were sent
    const resendInstance = vi.mocked(Resend).mock.results[0].value;
    expect(resendInstance.emails.send).not.toHaveBeenCalled();
  });

  it('handles Redis errors with fail-open strategy', async () => {
    const redisInstance = vi.mocked(Redis).mock.results[0].value;
    // Mock Redis to throw an error
    redisInstance.incr.mockRejectedValue(new Error('Redis error'));

    const req = createMockRequest('POST', {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello',
    });
    const res = createMockResponse();

    await handler(req, res);

    // Should proceed despite Redis error (fail-open)
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it('sanitizes input to prevent XSS attacks', async () => {
    const req = createMockRequest('POST', {
      name: '<script>alert("xss")</script>John',
      email: 'john@example.com',
      message: '<img src="x" onerror="alert(1)">Malicious message',
    });
    const res = createMockResponse();

    await handler(req, res);

    // Check that Resend was called with sanitized content
    const resendInstance = vi.mocked(Resend).mock.results[0].value;
    const sendCalls = resendInstance.emails.send.mock.calls;
    
    // The sanitized name should not contain script tags
    expect(sendCalls[0][0].html).not.toContain('<script>');
    expect(sendCalls[0][0].html).toContain('John');
    
    // The sanitized message should not contain onerror
    expect(sendCalls[0][0].html).not.toContain('onerror');
    expect(sendCalls[0][0].html).toContain('Malicious message');
  });

  it('returns generic error message on email sending failure', async () => {
    const resendInstance = vi.mocked(Resend).mock.results[0].value;
    // Mock Resend to throw an error
    resendInstance.emails.send.mockRejectedValue(new Error('Email sending failed'));

    const req = createMockRequest('POST', {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message',
    });
    const res = createMockResponse();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ 
      error: 'Failed to send message. Please try again later.' 
    });
  });
});
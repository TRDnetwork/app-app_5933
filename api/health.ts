import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';
import { Resend } from 'resend';
import { Ratelimit } from '@upstash/ratelimit';

// Initialize clients
const redis = Redis.fromEnv();
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize rate limiter for health checks (higher limit)
const healthRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '1 m'), // 60 requests per minute
  prefix: 'health-ratelimit',
});

const VERSION = '1.0.0';
const START_TIME = Date.now();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // API VERSIONING
  const apiVersion = req.headers['accept-version'] || 'v1';
  res.setHeader('X-API-Version', apiVersion);
  
  // Apply rate limiting to health checks to prevent abuse
  const identifier = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const { success } = await healthRatelimit.limit(identifier);
  
  if (!success) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded for health checks' 
    });
  }

  const { pathname } = req;

  switch (pathname) {
    case '/api/health':
      return handleBasicHealth(req, res);
    case '/api/health/db':
      return handleDbHealth(req, res);
    case '/api/health/deps':
      return handleDepsHealth(req, res);
    default:
      res.setHeader('Cache-Control', 'no-store');
      return res.status(404).json({ error: 'Not found' });
  }
}

async function handleBasicHealth(req: VercelRequest, res: VercelResponse) {
  // CACHING: Cache basic health check for 10 seconds to reduce load
  res.setHeader('Cache-Control', 'public, max-age=10');
  res.setHeader('X-Health-Cache', 'true');
  
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: VERSION,
    uptime: Date.now() - START_TIME,
    version: req.headers['accept-version'] || 'v1'
  });
}

async function handleDbHealth(req: VercelRequest, res: VercelResponse) {
  try {
    // Test Redis connection with a simple ping
    const result = await redis.ping();
    
    if (result === 'PONG') {
      // CACHING: Cache database health for 30 seconds
      res.setHeader('Cache-Control', 'public, max-age=30');
      return res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'Redis connection successful',
        version: req.headers['accept-version'] || 'v1'
      });
    }
    
    throw new Error('Redis ping failed');
  } catch (error: any) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Redis connection failed',
      error: 'Database service unavailable',
      version: req.headers['accept-version'] || 'v1'
    });
  }
}

async function handleDepsHealth(req: VercelRequest, res: VercelResponse) {
  const services = {
    resend: false,
    redis: false,
  };

  const results = {
    status: 'ok' as 'ok' | 'error',
    timestamp: new Date().toISOString(),
    services,
    version: req.headers['accept-version'] || 'v1'
  };

  try {
    // Test Resend connection
    await resend.domains.list();
    services.resend = true;
  } catch (error) {
    results.status = 'error';
    console.error('Resend health check failed:', error);
  }

  try {
    // Test Redis connection
    const result = await redis.ping();
    services.redis = result === 'PONG';
  } catch (error) {
    results.status = 'error';
    console.error('Redis health check failed:', error);
  }

  const status = Object.values(services).every(Boolean) ? 200 : 503;
  // CACHING: Cache dependency health for 15 seconds
  res.setHeader('Cache-Control', `public, max-age=${status === 200 ? 15 : 0}`);
  res.status(status).json(results);
}
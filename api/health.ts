import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';
import { Resend } from 'resend';

// Initialize clients
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const resend = new Resend(process.env.RESEND_API_KEY);

const VERSION = '1.0.0';
const START_TIME = Date.now();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { pathname } = req;

  // API VERSIONING
  const version = req.headers['accept-version'] || pathname.split('/')[2] || 'v1';
  res.setHeader('X-API-Version', version);
  
  if (version === 'v0') {
    res.setHeader('Deprecation', 'true');
    res.setHeader('Sunset', '2024-12-31');
    res.setHeader('Link', '</api/v1/health>; rel="successor-version"');
  }

  switch (pathname) {
    case '/api/health':
      return handleBasicHealth(req, res);
    case '/api/health/db':
      return handleDbHealth(req, res);
    case '/api/health/deps':
      return handleDepsHealth(req, res);
    default:
      return res.status(404).json({ error: 'Not found' });
  }
}

async function handleBasicHealth(req: VercelRequest, res: VercelResponse) {
  // Add cache headers for health checks
  // PERFORMANCE: Health checks can be cached briefly to reduce load
  res.setHeader('Cache-Control', 'public, max-age=10');
  
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: VERSION,
    uptime: Date.now() - START_TIME,
    api_version: version,
  });
}

async function handleDbHealth(req: VercelRequest, res: VercelResponse) {
  try {
    // Test Redis connection with a simple ping
    const result = await redis.ping();
    
    if (result === 'PONG') {
      // Add cache headers
      res.setHeader('Cache-Control', 'public, max-age=30');
      
      return res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'Redis connection successful',
        version: version,
      });
    }
    
    throw new Error('Redis ping failed');
  } catch (error: any) {
    return res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Redis connection failed',
      error: error.message,
      version: version,
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
    version: version,
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
  res.status(status).json(results);
}
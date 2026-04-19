import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';
import { Resend } from 'resend';

// Initialize clients
const redis = Redis.fromEnv();
const resend = new Resend(process.env.RESEND_API_KEY);

const VERSION = '1.0.0';
const START_TIME = Date.now();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { pathname } = req;

  // API VERSIONING: Support versioning in health check
  const requestedVersion = req.headers['accept-version'] || '1.0';

  switch (pathname) {
    case '/api/health':
      return handleBasicHealth(req, res, requestedVersion);
    case '/api/health/db':
      return handleDbHealth(req, res, requestedVersion);
    case '/api/health/deps':
      return handleDepsHealth(req, res, requestedVersion);
    default:
      return res.status(404).json({ 
        error: 'Not found',
        version: requestedVersion
      });
  }
}

async function handleBasicHealth(req: VercelRequest, res: VercelResponse, version: string) {
  // CACHING: Cache health check responses for 10 seconds to reduce load
  res.setHeader('Cache-Control', 'public, max-age=10');
  
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: version,
    uptime: Date.now() - START_TIME,
    // Include instance information for debugging
    instance: process.env.VERCEL_URL || 'localhost'
  });
}

async function handleDbHealth(req: VercelRequest, res: VercelResponse, version: string) {
  try {
    // Test Redis connection with a simple ping
    const result = await redis.ping();
    
    if (result === 'PONG') {
      // CACHING: Set cache headers for health check
      res.setHeader('Cache-Control', 'public, max-age=5');
      
      return res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: version,
        message: 'Redis connection successful',
        // Include response time for performance monitoring
        response_time: Date.now() - Number(req.headers['x-vercel-start-time'] || Date.now())
      });
    }
    
    throw new Error('Redis ping failed');
  } catch (error: any) {
    return res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      version: version,
      message: 'Redis connection failed',
      error: error.message,
      // Include error code for automated monitoring
      error_code: 'DB_CONNECTION_FAILED'
    });
  }
}

async function handleDepsHealth(req: VercelRequest, res: VercelResponse, version: string) {
  const services = {
    resend: false,
    redis: false,
  };

  const results = {
    status: 'ok' as 'ok' | 'error',
    timestamp: new Date().toISOString(),
    version: version,
    services,
    // Include response time for performance monitoring
    response_time: Date.now() - Number(req.headers['x-vercel-start-time'] || Date.now())
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
  // CACHING: Set cache headers for health check
  res.setHeader('Cache-Control', 'public, max-age=5');
  res.status(status).json(results);
}
---
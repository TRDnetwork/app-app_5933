import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

// Initialize Redis for caching
const redis = Redis.fromEnv();

// Cache configuration
const CACHE_TTL = 300; // 5 minutes in seconds
const CACHE_KEY = 'hero-content';

// Mock hero data - in a real app this would come from a database or CMS
const HERO_CONTENT = {
  id: '1',
  name: 'Alex Morgan',
  role: 'Full-Stack Developer & Open Source Contributor',
  tagline: 'Building digital experiences that matter',
  updatedAt: '2024-12-10T12:00:00Z',
  version: 1
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add security headers
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
  res.setHeader('X-Frame-Options', 'DENY');

  // API versioning support
  const apiVersion = req.headers['accept-version'] || 'v1';
  res.setHeader('X-API-Version', apiVersion);

  // Support version deprecation notice
  if (apiVersion === 'v1') {
    res.setHeader('X-API-Deprecation-Notice', 'v1 will be deprecated on 2025-01-01. Please migrate to v2.');
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Try to get cached data first
    let cachedData = null;
    try {
      cachedData = await redis.get(CACHE_KEY);
    } catch (error) {
      console.warn('Redis read failed, proceeding without cache:', error);
    }

    if (cachedData) {
      // Return cached data with header indicating source
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cachedData);
    }

    // Cache miss - process request
    res.setHeader('X-Cache', 'MISS');

    // Add ETag for conditional requests
    const etag = `"${HERO_CONTENT.updatedAt}"`;
    res.setHeader('ETag', etag);

    // Check if client has current version
    if (req.headers['if-none-match'] === etag) {
      return res.status(304).send();
    }

    // Set last modified header
    res.setHeader('Last-Modified', new Date(HERO_CONTENT.updatedAt).toUTCString());

    // Return fresh data
    const response = {
      ...HERO_CONTENT,
      // Add metadata for client-side handling
      _meta: {
        fetchedAt: new Date().toISOString(),
        source: 'database'
      }
    };

    // Cache the response for future requests
    try {
      await redis.setex(CACHE_KEY, CACHE_TTL, response);
    } catch (error) {
      console.warn('Redis write failed, response not cached:', error);
    }

    return res.status(200).json(response);
  } catch (err: any) {
    console.error('Error in hero handler:', err);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}
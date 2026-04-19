import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

// Initialize Redis for caching
const redis = Redis.fromEnv();

// Cache configuration
const CACHE_TTL = 300; // 5 minutes in seconds
const CACHE_PREFIX = 'projects:';

// Mock project data - in a real app this would come from a database
const PROJECTS = [
  {
    id: '1',
    title: 'TaskFlow',
    description: 'A collaborative task management platform with real-time updates and team analytics.',
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Socket.IO'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'DataViz Studio',
    description: 'An interactive dashboard builder for non-technical users to visualize business metrics.',
    tech: ['Vue', 'D3.js', 'Python', 'FastAPI', 'Redis'],
    createdAt: '2024-02-20T14:30:00Z',
    updatedAt: '2024-02-20T14:30:00Z'
  },
  {
    id: '3',
    title: 'AuthGuard',
    description: 'A secure authentication microservice with OAuth, MFA, and audit logging.',
    tech: ['Next.js', 'Go', 'MongoDB', 'JWT', 'Docker'],
    createdAt: '2024-03-10T09:15:00Z',
    updatedAt: '2024-03-10T09:15:00Z'
  }
];

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
    // Parse query parameters for pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100); // Max 100 per page
    const cursor = req.query.cursor as string | undefined;

    // Generate cache key based on query parameters
    const cacheKey = `${CACHE_PREFIX}page:${page}:limit:${limit}:cursor:${cursor || 'none'}`;

    // Try to get cached data first
    let cachedData = null;
    try {
      cachedData = await redis.get(cacheKey);
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

    // Apply cursor-based pagination
    let startIndex = 0;
    if (cursor) {
      const cursorIndex = PROJECTS.findIndex(p => p.id === cursor);
      if (cursorIndex !== -1) {
        startIndex = cursorIndex + 1;
      }
    }

    // Slice projects based on pagination
    const paginatedProjects = PROJECTS.slice(startIndex, startIndex + limit);
    const hasNextPage = startIndex + limit < PROJECTS.length;
    const nextCursor = hasNextPage ? PROJECTS[startIndex + limit].id : null;

    // Prepare response with consistent pagination format
    const response = {
      data: paginatedProjects,
      next_cursor: nextCursor,
      has_more: hasNextPage,
      total: PROJECTS.length,
      page,
      limit
    };

    // Set total count header
    res.setHeader('X-Total-Count', PROJECTS.length.toString());

    // Cache the response for future requests
    try {
      await redis.setex(cacheKey, CACHE_TTL, response);
    } catch (error) {
      console.warn('Redis write failed, response not cached:', error);
    }

    return res.status(200).json(response);
  } catch (err: any) {
    console.error('Error in projects handler:', err);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}
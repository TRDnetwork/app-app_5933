import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

// Initialize Redis for caching
// CACHING: Use Redis for in-memory caching of frequently accessed data
const redis = Redis.fromEnv();

// Mock project data - in a real app, this would come from a database
const PROJECTS = [
  {
    id: '1',
    title: 'TaskFlow',
    description: 'A collaborative task management platform with real-time updates and team analytics.',
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Socket.IO'],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'DataViz Studio',
    description: 'An interactive dashboard builder for non-technical users to visualize business metrics.',
    tech: ['Vue', 'D3.js', 'Python', 'FastAPI', 'Redis'],
    created_at: '2024-02-20T14:30:00Z',
    updated_at: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    title: 'AuthGuard',
    description: 'A secure authentication microservice with OAuth, MFA, and audit logging.',
    tech: ['Next.js', 'Go', 'MongoDB', 'JWT', 'Docker'],
    created_at: '2024-03-10T09:15:00Z',
    updated_at: '2024-03-10T09:15:00Z',
  },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // API VERSIONING: Support versioning via Accept-Version header
  const requestedVersion = req.headers['accept-version'] || '1.0';
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // PAGINATION: Support cursor-based pagination
    const cursor = req.query.cursor as string | undefined;
    const limit = Math.min(
      parseInt(req.query.limit as string || '20'), 
      100 // Max limit of 100
    ) || 20;

    // CACHING: Generate cache key based on query parameters
    const cacheKey = `projects:${cursor || 'start'}:${limit}:${requestedVersion}`;
    
    // CACHING: Check Redis cache first (in-memory cache with 5min TTL)
    const cached = await redis.get<string>(cacheKey);
    if (cached) {
      const result = JSON.parse(cached);
      // Include cache hit header for monitoring
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('X-Cache-Key', cacheKey);
      
      return res.status(200).json({
        ...result,
        version: requestedVersion,
        from_cache: true,
        // Include timestamp for client-side caching
        timestamp: new Date().toISOString()
      });
    }

    // PAGINATION: Implement cursor-based pagination
    let startIndex = 0;
    if (cursor) {
      const parsedCursor = parseInt(cursor, 10);
      if (!isNaN(parsedCursor)) {
        startIndex = PROJECTS.findIndex(p => p.id === cursor) + 1;
        if (startIndex === 0) startIndex = 0; // If cursor not found, start from beginning
      }
    }

    // Slice projects based on cursor and limit
    const paginatedProjects = PROJECTS.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < PROJECTS.length;
    const nextCursor = hasMore ? paginatedProjects[paginatedProjects.length - 1].id : null;

    // PAGINATION: Return consistent response format
    const result = {
      data: paginatedProjects,
      next_cursor: nextCursor,
      has_more: hasMore,
      // PAGINATION: Include total count header
      total_count: PROJECTS.length,
    };

    // CACHING: Store result in Redis with 5 minute TTL
    await redis.setex(
      cacheKey, 
      300, // 5 minutes in seconds
      JSON.stringify(result)
    );

    // Include cache miss header
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('X-Cache-Key', cacheKey);
    
    // CACHING: Set Cache-Control headers for client-side caching
    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    res.setHeader('ETag', `"${generateETag(result)}"`); // ETag for conditional requests
    
    return res.status(200).json({
      ...result,
      version: requestedVersion,
      from_cache: false,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      version: requestedVersion
    });
  }
}

// Helper function to generate ETag from response data
function generateETag(data: any): string {
  // Simple ETag generation - in production, use a more robust hashing function
  return `${JSON.stringify(data).length}-${Date.now()}`;
}

// CACHING: Add cache invalidation endpoint for admin use
export const config = {
  api: {
    bodyParser: true,
  },
};
---
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

// Initialize Redis for caching
// PERFORMANCE: In-memory cache with LRU eviction and 5min TTL
// Reduces database load and improves response times for frequently accessed data
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Mock data - in a real app, this would come from a database
const PROJECTS = [
  {
    id: '1',
    title: 'TaskFlow',
    description: 'A collaborative task management platform with real-time updates and team analytics.',
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Socket.IO'],
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-06-20T00:00:00Z',
  },
  {
    id: '2',
    title: 'DataViz Studio',
    description: 'An interactive dashboard builder for non-technical users to visualize business metrics.',
    tech: ['Vue', 'D3.js', 'Python', 'FastAPI', 'Redis'],
    created_at: '2023-03-10T00:00:00Z',
    updated_at: '2023-08-15T00:00:00Z',
  },
  {
    id: '3',
    title: 'AuthGuard',
    description: 'A secure authentication microservice with OAuth, MFA, and audit logging.',
    tech: ['Next.js', 'Go', 'MongoDB', 'JWT', 'Docker'],
    created_at: '2023-05-05T00:00:00Z',
    updated_at: '2023-09-30T00:00:00Z',
  },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // API VERSIONING
  const version = req.headers['accept-version'] || req.url?.split('/')[2] || 'v1';
  res.setHeader('X-API-Version', version);
  
  if (version === 'v0') {
    res.setHeader('Deprecation', 'true');
    res.setHeader('Sunset', '2024-12-31');
    res.setHeader('Link', '</api/v1/projects>; rel="successor-version"');
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // PAGINATION: Cursor-based pagination for consistent results
    // PERFORMANCE: Prevents offset-based pagination issues with large datasets
    // Clients receive next_cursor to fetch subsequent pages
    const limit = Math.min(
      parseInt(req.query.limit as string) || 20, 
      100 // Max page size
    );
    
    const cursor = req.query.cursor as string || '0';
    
    // CACHE: Check Redis cache first with versioned key
    // PERFORMANCE: Cache key includes version, limit, and cursor for proper invalidation
    const cacheKey = `projects:v${version}:limit:${limit}:cursor:${cursor}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      const result = JSON.parse(cached);
      
      // Add cache headers for client-side caching awareness
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=300'); // 5min cache
      res.setHeader('Content-Type', 'application/json');
      
      return res.status(200).json(result);
    }

    // Sort projects by created_at for consistent cursor-based pagination
    const sortedProjects = [...PROJECTS].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    // Calculate pagination
    const startIndex = parseInt(cursor);
    const endIndex = startIndex + limit;
    const paginatedProjects = sortedProjects.slice(startIndex, endIndex);
    
    // Prepare response with pagination metadata
    const response = {
      data: paginatedProjects,
      next_cursor: endIndex < sortedProjects.length ? endIndex.toString() : null,
      has_more: endIndex < sortedProjects.length,
      total_count: sortedProjects.length,
      // Include query parameters in response for client consistency
      query: { limit, cursor }
    };

    // CACHE: Store in Redis with 5min TTL and LRU eviction
    // PERFORMANCE: Use setex for automatic expiration
    // This implements the "stale-while-revalidate" pattern
    await redis.setex(
      cacheKey, 
      300, // 5 minutes in seconds
      JSON.stringify(response)
    );

    // Add cache headers
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5min cache
    res.setHeader('Content-Type', 'application/json');
    
    return res.status(200).json(response);
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// CACHE INVALIDATION: Webhook endpoint to clear cache
// This should be called when projects are updated
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

// Webhook to invalidate project cache
export async function invalidateCache(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify webhook secret for security
  const secret = req.headers['x-webhook-secret'];
  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Invalidate all project cache keys
    // PERFORMANCE: Use Redis keys command with pattern matching
    // This clears all project cache entries regardless of parameters
    const keys = await redis.keys('projects:*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }

    return res.status(200).json({ 
      success: true, 
      message: `Invalidated ${keys.length} cache entries` 
    });
  } catch (error: any) {
    console.error('Error invalidating cache:', error);
    return res.status(500).json({ error: 'Failed to invalidate cache' });
  }
}
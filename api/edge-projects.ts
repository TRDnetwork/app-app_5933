import type { VercelRequest, VercelResponse } from '@vercel/node';

// This is an edge function that would run at the edge network
// In Vercel, you would place this in /api/edge-projects and add the config below
// export const config = { runtime: 'edge' };

// Project data - in a real app, this would come from a database
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

// Cache for edge function - in a real edge runtime, you might use a different caching strategy
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 300000; // 5 minutes in milliseconds

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // API Versioning
  const apiVersion = req.headers['accept-version'] || 'v1';
  res.setHeader('X-API-Version', apiVersion);
  
  if (apiVersion === 'v1') {
    res.setHeader('Warning', '199 - "API v1 is deprecated. Please upgrade to v2"');
  }

  // Set cache control headers for edge caching
  // PERF: Edge caching reduces latency by serving content from nearest location
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
  res.setHeader('Vary', 'Accept-Version');
  res.setHeader('X-Edge-Cache', 'HIT'); // Will be set to MISS if cache is stale

  // Extract pagination parameters
  const { cursor, limit = '20' } = req.query;
  const limitNum = Math.min(parseInt(limit as string, 10), 100); // Max 100 items
  const cursorStr = cursor as string | undefined;

  try {
    // Try to get data from cache first
    // PERF: In-memory cache at edge reduces origin requests and improves performance
    const cacheKey = `projects:${cursorStr || 'start'}:${limitNum}:${apiVersion}`;
    const cached = cache.get(cacheKey);
    let projectsData: typeof PROJECTS;
    let isCacheHit = false;

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      projectsData = cached.data;
      isCacheHit = true;
    } else {
      // Simulate database query with sorting
      projectsData = [...PROJECTS].sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      // Cache the result
      cache.set(cacheKey, {
        data: projectsData,
        timestamp: Date.now()
      });

      // Clean up old cache entries
      if (Math.random() < 0.1) { // 10% chance
        const now = Date.now();
        for (const [key, value] of cache.entries()) {
          if (now - value.timestamp > CACHE_TTL * 2) {
            cache.delete(key);
          }
        }
      }

      res.setHeader('X-Edge-Cache', 'MISS');
    }

    // Apply cursor-based pagination
    // PERF: Cursor-based pagination is more efficient than offset-based for large datasets
    let startIndex = 0;
    if (cursorStr) {
      const cursorIndex = projectsData.findIndex(p => p.id === cursorStr);
      if (cursorIndex !== -1) {
        startIndex = cursorIndex + 1;
      }
    }

    const paginatedProjects = projectsData.slice(startIndex, startIndex + limitNum);
    const nextCursor = paginatedProjects.length === limitNum 
      ? projectsData[startIndex + limitNum]?.id 
      : null;

    // Set total count header
    res.setHeader('X-Total-Count', projectsData.length.toString());
    res.setHeader('X-Returned-Count', paginatedProjects.length.toString());

    // Return paginated response
    return res.status(200).json({
      data: paginatedProjects,
      next_cursor: nextCursor,
      has_more: nextCursor !== null,
      total_count: projectsData.length,
      cache_hit: isCacheHit,
      version: apiVersion
    });
  } catch (error) {
    console.error('Error in edge projects handler:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      version: apiVersion 
    });
  }
}

// This config would enable the edge runtime in Vercel
// export const config = { runtime: 'edge' };

// PERF: Edge functions run closer to users, reducing latency for read operations
// This is particularly beneficial for the projects endpoint which is read frequently
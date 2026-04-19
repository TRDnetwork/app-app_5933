// This file configures edge functions for latency-sensitive operations
// PERFORMANCE: Move latency-sensitive reads to edge for geolocation-based routing

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

// Initialize Redis for edge caching
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Edge function for serving static assets with geolocation hints
export async function serveStaticAsset(req: VercelRequest, res: VercelResponse) {
  const assetPath = req.query.path as string;
  const userAgent = req.headers['user-agent'];
  
  // Add geolocation-based routing hints
  // PERFORMANCE: Use client's location to serve assets from nearest edge location
  const country = req.headers['x-vercel-ip-country'];
  const region = req.headers['x-vercel-ip-country-region'];
  
  // Set appropriate cache headers for static assets
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.setHeader('Vary', 'Accept-Encoding');
  
  // Add performance hints
  res.setHeader('Server-Timing', `edge;desc="Served from ${country || 'unknown'}"`);
  
  // In a real implementation, this would serve the actual asset
  // For now, we'll just return a success response with metadata
  return res.status(200).json({
    asset: assetPath,
    servedFrom: country ? `${country}-${region}` : 'global',
    timestamp: new Date().toISOString(),
  });
}

// Edge function for health checks with reduced latency
export async function edgeHealthCheck(req: VercelRequest, res: VercelResponse) {
  // This health check runs at the edge, providing faster response times
  // PERFORMANCE: Edge health checks can detect regional outages faster
  
  // Add edge-specific headers
  res.setHeader('X-Edge-Location', req.headers['x-vercel-id']?.toString() || 'unknown');
  res.setHeader('Cache-Control', 'public, max-age=5');
  
  // Quick local check (no external dependencies)
  return res.status(200).json({
    status: 'ok',
    location: req.headers['x-vercel-id'],
    timestamp: new Date().toISOString(),
    message: 'Edge function healthy',
  });
}

// Edge function for serving cached content with stale-while-revalidate
export async function serveCachedContent(req: VercelRequest, res: VercelResponse) {
  const cacheKey = req.query.key as string;
  const forceRefresh = req.query.refresh === 'true';
  
  try {
    // Try to get fresh content
    let content = forceRefresh ? null : await redis.get(cacheKey);
    
    if (content) {
      // Add cache hit header
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=300');
      
      return res.status(200).json({
        data: JSON.parse(content),
        cached: true,
        timestamp: new Date().toISOString(),
      });
    }
    
    // Cache miss - return stale content if available while revalidating
    const staleContent = await redis.get(`${cacheKey}:stale`);
    
    if (staleContent) {
      // Serve stale content while background revalidation occurs
      res.setHeader('X-Cache', 'STALE');
      res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=86400');
      
      // Trigger background revalidation
      revalidateCache(cacheKey);
      
      return res.status(200).json({
        data: JSON.parse(staleContent),
        cached: true,
        stale: true,
        timestamp: new Date().toISOString(),
      });
    }
    
    // No content available
    res.setHeader('X-Cache', 'MISS');
    return res.status(404).json({
      error: 'Content not found',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Edge cache error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Background function to revalidate cache
async function revalidateCache(cacheKey: string) {
  try {
    // In a real implementation, this would fetch fresh data
    // and update both the main cache and stale cache
    console.log(`Revalidating cache: ${cacheKey}`);
    
    // Simulate fetching fresh data
    const freshData = { updated: new Date().toISOString() };
    
    // Update cache
    await Promise.all([
      redis.setex(cacheKey, 300, JSON.stringify(freshData)),
      redis.setex(`${cacheKey}:stale`, 86400, JSON.stringify(freshData)) // Keep stale for 24h
    ]);
    
    console.log(`Cache revalidated: ${cacheKey}`);
  } catch (error) {
    console.error(`Failed to revalidate cache ${cacheKey}:`, error);
  }
}
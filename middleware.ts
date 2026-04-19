// middleware.ts
// Enhanced middleware with security and performance optimizations
import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis for rate limiting and caching
const redis = Redis.fromEnv();

// Rate limiter configuration
const apiRatelimit = {
  // Sliding window algorithm for accurate rate limiting
  // PERF: Sliding window provides more accurate rate limiting than fixed windows
  '/api/contact': { window: '1 h', limit: 5 },    // 5 requests per hour
  '/api/projects': { window: '1 m', limit: 60 },  // 60 requests per minute
  '/api/health': { window: '1 m', limit: 300 },   // 300 requests per minute
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Skip middleware for static assets and API health checks
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/favicon.ico') || 
      pathname === '/api/health') {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  
  // Security Headers
  // PERF: Security headers protect against common web vulnerabilities
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.headers.set('X-DNS-Prefetch-Control', 'off'); // Disable DNS prefetching for privacy

  // Content Security Policy
  // PERF: CSP prevents XSS attacks by restricting resource loading
  res.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://js.stripe.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.resend.com https://*.upstash.io; " +
    "frame-ancestors 'none'; " +
    "form-action 'self'; " +
    "base-uri 'self';"
  );

  // Cache-Control for API routes
  // PERF: Cache-Control headers optimize API response caching
  if (pathname.startsWith('/api/')) {
    if (pathname === '/api/projects') {
      // Projects API can be cached
      res.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    } else {
      // Other API routes should not be cached
      res.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    res.headers.set('Vary', 'Accept-Version');
  }

  // Rate limiting for API routes
  // PERF: Rate limiting protects against abuse and DDoS attacks
  if (pathname.startsWith('/api/') && apiRatelimit[pathname as keyof typeof apiRatelimit]) {
    const config = apiRatelimit[pathname as keyof typeof apiRatelimit];
    const identifier = req.ip || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const key = `ratelimit:${pathname}:${identifier}`;
    
    try {
      // Use Redis atomic operations for rate limiting
      // PERF: Atomic operations ensure accurate rate limiting under high concurrency
      const result = await redis.eval<[string, number, number, number]>(
        `
        local key = KEYS[1]
        local limit = tonumber(ARGV[1])
        local window = tonumber(ARGV[2])
        local now = tonumber(ARGV[3])
        
        -- Remove expired entries
        redis.call('ZREMRANGEBYSCORE', key, 0, now - window)
        
        -- Get current count
        local current = tonumber(redis.call('ZCARD', key) or "0")
        
        -- Check if limit is exceeded
        if current >= limit then
          return { "0", limit, current, now + window }
        end
        
        -- Increment counter
        redis.call('ZADD', key, now, now .. "-" .. math.random(1000, 9999))
        redis.call('EXPIRE', key, window)
        
        return { "1", limit, current + 1, now + window }
        `,
        [key],
        [config.limit, getTimeWindowSeconds(config.window), Date.now()]
      );

      const [success, limit, remaining, reset] = result;
      
      // Set rate limit headers
      res.headers.set('X-RateLimit-Limit', limit.toString());
      res.headers.set('X-RateLimit-Remaining', remaining.toString());
      res.headers.set('X-RateLimit-Reset', reset.toString());
      
      if (success === '0') {
        // Rate limit exceeded
        const retryAfter = Math.ceil((reset - Date.now()) / 1000);
        res.headers.set('Retry-After', retryAfter.toString());
        return new NextResponse(
          JSON.stringify({ 
            error: 'Rate limit exceeded', 
            retryAfter,
            reset: new Date(reset).toISOString()
          }),
          { 
            status: 429, 
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    } catch (error) {
      console.warn(`Rate limiting error for ${pathname} by ${identifier}:`, error);
      // Fail open - continue request if Redis is unavailable
    }
  }

  // Geolocation-based routing hints for edge functions
  // PERF: Geolocation hints enable faster responses by routing to nearest edge
  const country = req.geo?.country || 'unknown';
  const city = req.geo?.city || 'unknown';
  res.headers.set('X-Geo-Country', country);
  res.headers.set('X-Geo-City', city);

  return res;
}

// Helper function to convert time window strings to seconds
function getTimeWindowSeconds(window: string): number {
  const value = parseInt(window.split(' ')[0], 10);
  const unit = window.split(' ')[1];
  
  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 3600;
    case 'd': return value * 86400;
    default: return value;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/health (health check)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/health).*)',
  ],
};
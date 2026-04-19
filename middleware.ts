import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis for rate limiting
// PERFORMANCE: Use connection pooling for better Redis performance
const redis = Redis.fromEnv();

// RATE LIMITING: Define rate limits for different endpoints
const rateLimits = {
  '/api/contact': {
    limit: 100, // 100 requests per 15 minutes
    window: '15 m',
    prefix: 'contact'
  },
  '/api/projects': {
    limit: 1000, // 1000 requests per 15 minutes
    window: '15 m',
    prefix: 'projects'
  },
  '/api': {
    limit: 10000, // 10,000 requests per hour for all API routes
    window: '1 h',
    prefix: 'api'
  }
};

// CACHING: Configure cache settings
const cacheSettings = {
  defaultTTL: 300, // 5 minutes
  staticTTL: 3600, // 1 hour for static assets
  htmlTTL: 60, // 1 minute for HTML pages
};

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const url = req.nextUrl.pathname;
  
  // Skip middleware for static files and API health checks
  if (url.startsWith('/_next') || 
      url.startsWith('/static') || 
      url === '/api/health' || 
      url === '/api/health/db' || 
      url === '/api/health/deps') {
    return NextResponse.next();
  }

  // API VERSIONING: Add version header to all responses
  const response = NextResponse.next();
  response.headers.set('X-API-Version', '1.0');
  response.headers.set('X-Server-Timestamp', new Date().toISOString());

  // CACHING: Set cache headers based on route
  if (url.startsWith('/api/')) {
    // API routes - cache for 5 minutes
    response.headers.set('Cache-Control', `public, max-age=${cacheSettings.defaultTTL}`);
  } else if (url.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
    // Static assets - cache for 1 hour
    response.headers.set('Cache-Control', `public, max-age=${cacheSettings.staticTTL}`);
  } else {
    // HTML pages - cache for 1 minute
    response.headers.set('Cache-Control', `public, max-age=${cacheSettings.htmlTTL}`);
  }

  // RATE LIMITING: Apply rate limiting to API routes
  if (url.startsWith('/api/')) {
    // Find the most specific rate limit configuration
    let limitConfig = rateLimits[url];
    if (!limitConfig) {
      // Use default API limit for all other API routes
      limitConfig = rateLimits['/api'];
    }

    // Create rate limiter for this endpoint
    const { Ratelimit } = await import('@upstash/ratelimit');
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limitConfig.limit, limitConfig.window),
      prefix: `ratelimit:${limitConfig.prefix}`,
    });

    // Extract client IP from headers
    const clientIP = (req.headers.get('x-forwarded-for') as string)?.split(',')[0]?.trim() || 
                     req.ip || 'unknown';
    
    // Create identifier for this client and endpoint
    const identifier = `${limitConfig.prefix}:${clientIP}`;

    // Check rate limit
    const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

    if (!success) {
      // RATE LIMITING: Return 429 with Retry-After header
      response.headers.set('Retry-After', Math.ceil((reset - Date.now()) / 1000).toString());
      response.headers.set('X-RateLimit-Limit', limit.toString());
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      response.headers.set('X-RateLimit-Reset', reset.toString());
      
      // Log rate limit exceeded events
      console.log('Rate limit exceeded', {
        endpoint: url,
        ip: clientIP,
        limit,
        remaining,
        reset: new Date(reset).toISOString()
      });

      return new Response('Too many requests', {
        status: 429,
        headers: response.headers,
      });
    }

    // Add rate limit info to response headers
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());
  }

  // EDGE FUNCTIONS: Add geolocation-based routing hints
  // This helps route requests to the nearest edge location
  const country = req.geo?.country;
  if (country) {
    response.headers.set('X-Country', country);
  }

  // PERFORMANCE: Add response time tracking
  const startTime = Date.now();
  ev.waitUntil(
    Promise.resolve().then(() => {
      const responseTime = Date.now() - startTime;
      // Log slow responses (>1s)
      if (responseTime > 1000) {
        console.warn(`Slow response: ${url} took ${responseTime}ms`, {
          country,
          userAgent: req.headers.get('user-agent'),
        });
      }
    })
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/health (health check endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/health).*)',
  ],
};
---
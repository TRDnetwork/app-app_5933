# API Documentation

## API Versioning

All API endpoints follow semantic versioning with the `/api/v{version}/` prefix. Clients can also specify the version using the `Accept-Version` header.

### Version Support
- `v1` (current): Fully supported
- `v0` (deprecated): Will be sunset on 2024-12-31

### Version Headers
When using a deprecated version, the API returns:
- `Deprecation: true`
- `Sunset: 2024-12-31` (RFC 7231)
- `Link: </api/v1/{endpoint}>; rel="successor-version"`

## Contact Form API

The contact form is handled by a Vercel serverless function that processes submissions, validates input, enforces rate limiting, and sends emails via Resend.

### `POST /api/v1/contact`

Sends a contact form submission via email to the site owner.

#### Request

**URL**: `https://app_5933.vercel.app/api/v1/contact`

**Method**: `POST`

**Headers**:
```http
Content-Type: application/json
Accept-Version: v1
```

**Body**:
```json
{
  "name": "string",
  "email": "string",
  "message": "string",
  "bot-field": "string"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Sender's full name |
| `email` | string | Yes | Sender's email address |
| `message` | string | Yes | Message content |
| `bot-field` | string | Yes | Honeypot field (should be empty) |

#### Responses

**Success (200 OK)**:
```json
{
  "success": true,
  "version": "v1"
}
```

**Validation Error (400 Bad Request)**:
```json
{
  "error": "Missing required fields"
}
```
or
```json
{
  "error": "Invalid email format"
}
```

**Method Not Allowed (405)**:
```json
{
  "error": "Method not allowed"
}
```

**Internal Server Error (500)**:
```json
{
  "error": "Internal server error"
}
```

#### Response Headers

| Header | Description |
|--------|-------------|
| `X-API-Version` | Current API version |
| `X-RateLimit-Limit` | Total requests allowed per hour |
| `X-RateLimit-Remaining` | Remaining requests in current window |
| `X-RateLimit-Reset` | Timestamp when rate limit resets |
| `Retry-After` | Seconds to wait before retrying after rate limit |

#### Example Usage

**JavaScript Fetch**:
```javascript
const response = await fetch('/api/v1/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept-Version': 'v1'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, I would like to discuss a project.',
    'bot-field': ''
  }),
});

// Check rate limit headers
const remaining = response.headers.get('X-RateLimit-Remaining');
const reset = response.headers.get('X-RateLimit-Reset');

if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After');
  console.log(`Rate limited. Retry after ${retryAfter} seconds.`);
}

const data = await response.json();
```

## Projects API

Retrieves featured projects with cursor-based pagination and caching.

### `GET /api/v1/projects`

Returns a paginated list of featured projects.

#### Request

**URL**: `https://app_5933.vercel.app/api/v1/projects?limit=20&cursor=0`

**Method**: `GET`

**Headers**:
```http
Accept-Version: v1
```

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | number | No | 20 | Number of items to return (max 100) |
| `cursor` | string | No | 0 | Cursor for pagination |

#### Response

**Success (200 OK)**:
```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "tech": ["string"],
      "created_at": "string",
      "updated_at": "string"
    }
  ],
  "next_cursor": "string",
  "has_more": true,
  "total_count": 3,
  "query": {
    "limit": 20,
    "cursor": "0"
  }
}
```

**Response Headers**:
| Header | Description |
|--------|-------------|
| `X-API-Version` | Current API version |
| `X-Cache` | Cache status (HIT, MISS, or STALE) |
| `Cache-Control` | Caching instructions (max-age=300) |

#### Example Usage

```javascript
async function getProjects(limit = 20, cursor = '0') {
  const response = await fetch(`/api/v1/projects?limit=${limit}&cursor=${cursor}`, {
    headers: {
      'Accept-Version': 'v1'
    }
  });
  
  // Check cache status
  const cacheStatus = response.headers.get('X-Cache');
  console.log(`Cache: ${cacheStatus}`);
  
  const data = await response.json();
  return data;
}

// Usage
let cursor = '0';
let allProjects = [];

do {
  const result = await getProjects(20, cursor);
  allProjects = [...allProjects, ...result.data];
  cursor = result.next_cursor;
} while (result.has_more);
```

## Health Check API

Monitors the health of the application and its dependencies.

### `GET /api/v1/health`

Basic health check endpoint.

#### Response
```json
{
  "status": "ok",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "uptime": 123456,
  "api_version": "v1"
}
```

### `GET /api/v1/health/db`

Checks Redis connection health.

### `GET /api/v1/health/deps`

Comprehensive health check for all dependencies.

#### Response
```json
{
  "status": "ok",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "services": {
    "resend": true,
    "redis": true
  },
  "version": "v1"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Endpoint**: `/api/v1/contact`
- **Limit**: 5 requests per hour per IP address
- **Algorithm**: Sliding window
- **Identification**: IP address + email domain
- **Behavior**: Fail-open (logs warnings but allows submission if Redis fails)

When rate limit is exceeded:
- Status: 429 Too Many Requests
- Header: `Retry-After: {seconds}`
- Header: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Caching Strategy

The API implements a multi-layer caching strategy:

### In-Memory Caching (Redis)
- **TTL**: 300 seconds (5 minutes)
- **Eviction**: LRU (Least Recently Used)
- **Pattern**: `projects:v{version}:limit:{limit}:cursor:{cursor}`
- **Headers**: `Cache-Control: public, max-age=300`

### Stale-While-Revalidate
- When cache expires, stale content is served while background revalidation occurs
- Header: `Cache-Control: public, max-age=300, stale-while-revalidate=86400`

### Cache Invalidation
- Manual invalidation via webhook
- Automatic invalidation on content updates
- Pattern: `projects:*` (wildcard matching)

## Edge Functions

Latency-sensitive operations are handled at the edge:

### Static Asset Serving
- Geolocation-based routing hints
- Long-term caching (1 year)
- Headers: `Cache-Control: public, max-age=31536000, immutable`

### Edge Health Checks
- Faster regional outage detection
- Lower latency responses
- Headers: `X-Edge-Location`

## Security

### Rate Limiting Headers
- `X-RateLimit-Limit`: Total allowed requests
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp
- `Retry-After`: Seconds to wait after rate limit

### Cache Headers
- `X-Cache`: HIT, MISS, or STALE
- `Cache-Control`: Caching instructions
- `Vary`: Vary by Accept-Encoding

### Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## Error Handling

| Error Type | Status Code | Response | Headers |
|------------|-------------|----------|---------|
| Missing fields | 400 | "Missing required fields" | - |
| Invalid email | 400 | "Invalid email format" | - |
| Method not POST | 405 | "Method not allowed" | - |
| Rate limit exceeded | 429 | "Too many requests" | `Retry-After` |
| Redis error | 200 (fail-open) | Success | Console warning |
| Honeypot triggered | 200 | Success (silent) | Console log |
| Unexpected error | 500 | "Internal server error" | Sentry logging |

## Deployment Configuration

```json
{
  "memory": 1024,
  "maxDuration": 10,
  "region": "auto",
  "edgeNetwork": true
}
```

- **Cold start optimized**: Minimal dependencies
- **Caching**: Configured in vercel.json
- **Security headers**: Enforced via routing rules
- **Edge functions**: Enabled for global distribution
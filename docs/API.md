# API Documentation

## Contact Form API

The contact form is handled by a Vercel serverless function that processes submissions, validates input, enforces rate limiting, and sends emails via Resend.

### `POST /api/contact`

Sends a contact form submission via email to the site owner.

#### Request

**URL**: `https://app_5933.vercel.app/api/contact`

**Method**: `POST`

**Headers**:
```http
Content-Type: application/json
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
  "id": "email_12345"
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

**Rate Limit Exceeded (Logged but not blocked)**:
The API uses a fail-open policy for rate limiting. When the limit is exceeded, the request is logged but still processed.

#### Example Usage

**cURL**:
```bash
curl -X POST https://app_5933.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello, I would like to discuss a project.",
    "bot-field": ""
  }'
```

**JavaScript Fetch**:
```javascript
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello, I would like to discuss a project.',
    'bot-field': ''
  }),
});

const data = await response.json();
if (data.success) {
  console.log('Message sent successfully');
} else {
  console.error('Error:', data.error);
}
```

#### Security Features

1. **Honeypot Protection**:
   - Hidden `bot-field` detects automated submissions
   - If filled, request is silently accepted but logged
   - Prevents spam without user friction

2. **Input Validation**:
   - All fields required
   - Email format validated with regex
   - Inputs sanitized with `isomorphic-dompurify`

3. **Rate Limiting**:
   - 5 submissions per hour per IP address
   - Uses Upstash Redis with sliding window algorithm
   - Identifier: `x-forwarded-for` header or 'anonymous'
   - Fail-open policy: logs warnings but allows submission if Redis fails

4. **Email Security**:
   - API key stored in environment variables
   - No client-side exposure of credentials
   - Verified domain recommended for better deliverability

#### Error Handling

| Error Type | Status Code | Response | Logging |
|------------|-------------|----------|---------|
| Missing fields | 400 | "Missing required fields" | No |
| Invalid email | 400 | "Invalid email format" | No |
| Method not POST | 405 | "Method not allowed" | No |
| Resend API error | 500 | "Failed to send email" | Yes (Sentry) |
| Unexpected error | 500 | "Internal server error" | Yes (Sentry) |
| Rate limit exceeded | 200 | Success (fail-open) | Yes (console.warn) |
| Honeypot triggered | 200 | Success (silent) | Yes (console.log) |

#### Email Templates

The API uses two email templates:

1. **Contact Notification** (`ContactNotificationEmail.tsx`):
   - Sent to site owner
   - Contains sender's name, email, and message
   - HTML formatted with brand styling

2. **Contact Confirmation** (Optional):
   - Can be enabled to send auto-reply to sender
   - Thanks user for their message
   - Sets expectations for response time

#### Rate Limiting Details

```typescript
const ratelimit = rateLimit({
  redis: Redis.fromEnv(),
  limiter: rateLimit.slidingWindow(5, '3600s'), // 5 requests per 3600 seconds (1 hour)
});
```

- **Storage**: Upstash Redis
- **Algorithm**: Sliding window
- **Identifier**: IP address from `x-forwarded-for` header
- **Behavior**: Fail-open (allows requests if Redis is unavailable)

#### Monitoring

All API interactions are monitored through:
- **Vercel Logs**: Function execution and errors
- **Sentry**: Detailed error tracking and performance monitoring
- **PostHog**: User flow analytics
- **Resend Dashboard**: Email delivery status
- **Upstash Console**: Rate limiting metrics

#### Deployment Configuration

The API is deployed as a Vercel serverless function with the following settings:

```json
{
  "maxDuration": 10,
  "memory": 1024,
  "region": "auto"
}
```

- **Cold start optimized**: Minimal dependencies
- **No caching**: Each request processed independently
- **Secure headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy

#### Health Check

The API includes built-in health monitoring:
- Redis connection status
- Resend API availability
- Environment variable validation
- Input sanitization integrity

Health checks are automatically performed on each deployment and can be manually triggered for debugging.
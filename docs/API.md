# 📡 API Documentation

## `/api/contact` — Contact Form Endpoint

Handles contact form submissions with spam protection, validation, and email delivery.

> **Base URL**: `https://yourportfolio.com/api/contact`  
> **Method**: `POST`  
> **Rate Limit**: 5 requests per hour per IP (via Upstash Redis)  
> **Authentication**: None (public form)  
> **Framework**: Vercel Serverless Function (Node.js)

---

### Request

#### Headers
```http
Content-Type: application/json
```

#### Body (JSON)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Full name of sender |
| `email` | string | ✅ | Valid email address |
| `message` | string | ✅ | Message content (min 10 chars) |
| `bot-field` | string | ✅ | Honeypot field — must be empty |

#### Example Request
```bash
curl -X POST https://yourportfolio.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex Morgan",
    "email": "alex@example.com",
    "message": "I love your work! Let's build something together.",
    "bot-field": ""
  }'
```

---

### Responses

#### ✅ `200 OK` — Success or Honeypot Triggered
Returned when:
- Message is successfully sent
- Honeypot field is filled (silent success to fool bots)

```json
{ "success": true }
```

> **Note**: No distinction between real success and honeypot — prevents bot fingerprinting.

---

#### ❌ `400 Bad Request` — Validation Failed
Returned when required fields are missing or invalid.

```json
{ "error": "All fields are required." }
```

```json
{ "error": "Please provide a valid email address." }
```

```json
{ "error": "Message must be at least 10 characters long." }
```

---

#### ❌ `405 Method Not Allowed`
Only `POST` is supported.

```json
{ "error": "Method not allowed" }
```

---

#### ❌ `429 Too Many Requests`
Rate limit exceeded (5/hour per IP).

```json
{ "error": "Too many requests. Please try again later." }
```

> **Rate Limit Logic**:  
> - Uses `x-forwarded-for` header for IP detection  
> - Sliding window via Upstash Redis  
> - Fail-open: if Redis is unreachable, request proceeds (logged to Sentry)

---

#### ❌ `500 Internal Server Error`
Server-side error during email delivery.

```json
{ "error": "Failed to send message. Please try again." }
```

> **Note**: Full error logged server-side (Sentry), but generic message shown to user for security.

---

### Email Delivery

Two emails are sent on successful submission:

#### 1. Notification to Site Owner
- **From**: `onboarding@resend.dev` (or verified domain)
- **To**: `CONTACT_EMAIL` (env var)
- **Subject**: `New message from {name}`
- **Template**: `src/emails/contact-notification.js`
- **Content**: Includes name, email, and sanitized message

#### 2. Confirmation to User
- **From**: `onboarding@resend.dev` (or verified domain)
- **To**: User's email
- **Subject**: `We received your message!`
- **Template**: `src/emails/contact-confirmation.js`
- **Content**: Thank you message with next steps

---

### Security Measures

| Feature | Implementation |
|--------|----------------|
| **Honeypot** | Hidden `bot-field` — if filled, return 200 silently |
| **Rate Limiting** | Upstash Redis: 5 req/hour/IP, sliding window |
| **Input Sanitization** | `isomorphic-dompurify` on all user inputs |
| **Email Validation** | Regex `/^\S+@\S+\.\S+$/` |
| **Error Handling** | Generic client errors, detailed server logs |
| **Secrets** | All API keys via `process.env` — never exposed client-side |

---

### Monitoring & Debugging

| Tool | Purpose |
|------|---------|
| **Vercel Logs** | View function execution, errors, and IP tracking |
| **Sentry** | Capture and alert on server-side exceptions |
| **PostHog** | Track form submissions and user flow |
| **Resend Dashboard** | Monitor email delivery status and open rates |
| **Upstash Console** | Inspect rate limit counters and Redis health |

---

### Testing the API

Use the provided Vitest suite:
```bash
npm run test:api
```

Or manually test with curl:
```bash
# Valid submission
curl -X POST /api/contact -H "Content-Type: application/json" -d '{
  "name": "Test User",
  "email": "test@example.com",
  "message": "Hello world",
  "bot-field": ""
}'

# Honeypot test
curl -X POST /api/contact -H "Content-Type: application/json" -d '{
  "name": "Bot",
  "email": "spam@bot.com",
  "message": "Buy pills!",
  "bot-field": "filled"
}' # Should return 200 silently

# Rate limit test (simulate same IP)
# Call 6 times within 1 hour from same IP → 429
```

---

🔐 All endpoints are protected against XSS, spam, and abuse. No authentication required.
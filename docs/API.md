# 🌐 API Documentation

This project includes a single serverless API endpoint for handling contact form submissions securely.

---

## `POST /api/contact` — Send Contact Message

Handles form submission from the frontend, validates input, applies spam protection, and sends an email via **Resend**.

### Method
`POST`

### URL
```
https://your-portfolio.vercel.app/api/contact
```

> Replace with your deployed domain.

---

### Request Headers
| Header | Value |
|-------|-------|
| `Content-Type` | `application/json` |
| `x-forwarded-for` | IP address (set automatically by Vercel) |

---

### Request Body

| Field | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | ✅ | Full name of the sender |
| `email` | string | ✅ | Valid email address |
| `message` | string | ✅ | Message content (min length enforced implicitly) |
| `bot-field` | string | 🛑 | Honeypot field — must be empty (bots often fill it) |

#### Example
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I love your work! Let's collaborate.",
  "bot-field": ""
}
```

---

### Responses

#### ✅ `200 OK` — Success
Sent when the email is successfully queued by Resend.

```json
{
  "success": true,
  "id": "email_abc123xyz"
}
```

> 💡 Even if rate-limited, the server returns `200` **if the honeypot was triggered**, to silently block bots.

---

#### ❌ `400 Bad Request` — Validation Failed
Returned when required fields are missing or email is invalid.

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

---

#### ❌ `405 Method Not Allowed`
Only `POST` is supported.

```json
{
  "error": "Method not allowed"
}
```

---

#### ❌ `429 Too Many Requests` — Rate Limited
Triggered when the same IP exceeds **5 submissions per hour**.

```json
{
  "error": "Rate limit exceeded. Please try again in an hour."
}
```

> ⚠️ The system operates in **fail-open mode**: if Redis is unreachable, the request proceeds but logs a warning.

---

#### ❌ `500 Internal Server Error`
Indicates a server-side issue (e.g., Resend outage, unexpected exception).

```json
{
  "error": "Failed to send email"
}
```

or

```json
{
  "error": "Internal server error"
}
```

> 🔍 Detailed error logs are sent to **Sentry** and **Vercel Logs** — not exposed to the client.

---

### Rate Limiting

- **Provider**: Upstash Redis
- **Strategy**: Sliding window, 5 requests per 60 minutes
- **Identifier**: IP address (`x-forwarded-for` or `socket.remoteAddress`)
- **Behavior**:
  - Blocks excessive human traffic
  - Logs warnings on Redis failure (fail-open)
  - Does not store any personal data long-term

---

### Spam Protection

1. **Honeypot Field** (`bot-field`)
   - Hidden from humans via CSS
   - If filled, request is silently accepted (`200 OK`) but no email is sent
   - Prevents bot scraping and spam

2. **Input Sanitization**
   - All fields sanitized using `isomorphic-dompurify` before email rendering
   - Prevents XSS in email HTML (e.g., `<script>` tags, `onerror`)

---

### Email Delivery

- **Service**: [Resend](https://resend.com)
- **From**: `onboarding@resend.dev` (or your verified domain)
- **To**: `process.env.CONTACT_TO_EMAIL`
- **Reply-To**: Submitted email address
- **Subject**: `New message from {name} via your portfolio`
- **HTML Template**: Server-rendered with styled `<div>` layout (see `api/contact.ts`)

---

### Example cURL Commands

#### Valid Submission
```bash
curl -X POST https://your-portfolio.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Chen",
    "email": "alice@acme.com",
    "message": "Your projects are impressive. Interested in freelance work?",
    "bot-field": ""
  }'
```

#### Spam Bot (Honeypot Triggered)
```bash
curl -X POST https://your-portfolio.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "BotSpammer",
    "email": "spam@bot.com",
    "message": "Buy cheap meds!!!",
    "bot-field": "filled"
  }'
```
> Returns `200 OK` but no email is sent.

---

### Monitoring & Debugging

| Tool | Purpose |
|------|--------|
| **Vercel Logs** | Full request/response tracing |
| **Sentry** | Error tracking and alerts |
| **PostHog** | Track submission events and user flow |
| **Resend Dashboard** | Email status (delivered, bounced, etc.) |
| **Upstash Console** | Rate limit analytics and Redis health |

---

### Security Headers (Planned Enhancement)
Currently not set — consider adding:
```ts
res.setHeader('X-Content-Type-Options', 'nosniff');
res.setHeader('X-Frame-Options', 'DENY');
res.setHeader('Content-Security-Policy', "default-src 'self'");
```

> See [Security Report](../SECURITY_REPORT.md) for details.
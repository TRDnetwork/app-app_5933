# Dev Portfolio

A personal portfolio website for a full-stack developer with a clean, animated interface and secure contact form.

## 🌟 Features

- **Hero Section**: Displays name and role with smooth entrance animation
- **About Section**: Concise bio paragraph in warm minimalism styling
- **Featured Projects**: 3 project cards with title, description, and tech stack
- **Contact Form**: Client-side validation, spam protection (honeypot + rate limiting), and email delivery via Resend
- **Responsive Design**: Fully mobile-first layout with Framer Motion scroll animations
- **Performance Optimized**: Zero external blocking scripts, lazy loading ready
- **Security Hardened**: Input sanitization, rate limiting, and honeypot spam protection

## 🎨 Design Aesthetic

**Warm Minimalism** — serene cream base (`#faf8f5`), deep forest green text (`#1a2e1a`), and vibrant burnt orange accents (`#e66000`).  
Typography: **Fraunces** (headings) + **Satoshi** (body). Generous whitespace, subtle motion, and clear hierarchy.

## ⚙️ Tech Stack

| Layer | Technology |
|------|------------|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS (via CDN in dev) |
| Animations | Framer Motion |
| Email | Resend |
| Rate Limiting | Upstash Redis |
| Monitoring | Sentry, PostHog, Vercel Logs |
| Deployment | Vercel (Serverless Functions) |

## 📦 Setup Instructions

### 1. Clone & Install
```bash
git clone https://github.com/your-username/dev-portfolio.git
cd dev-portfolio
npm install
```

### 2. Environment Variables
Create `.env.local`:
```env
VITE_SITE_URL=https://yourportfolio.com
RESEND_API_KEY=your_resend_api_key_here
CONTACT_EMAIL=contact@yourportfolio.com
UPSTASH_REDIS_REST_URL=https://your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

> 🔒 Never commit secrets. `RESEND_API_KEY`, `UPSTASH_REDIS_*` are server-only.

### 3. Run Locally
```bash
npm run dev
```

### 4. Build & Deploy
```bash
npm run build
npm run preview
```

Deploy to Vercel via CLI or Git integration.

## 🧪 Testing

Run unit and integration tests:
```bash
npm test
```

Watch mode:
```bash
npm run test:watch
```

Coverage report:
```bash
npm run test:coverage
```

See `tests/README.md` for full test suite details.

## 📬 Contact Form API

The form submits to a Vercel serverless function with spam protection and rate limiting.

### Endpoint
```
POST /api/contact
```

### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'd like to collaborate!",
  "bot-field": "" // honeypot — leave empty
}
```

### Responses

| Code | Response | Description |
|------|----------|-------------|
| `200` | `{ "success": true }` | Message sent (or honeypot triggered) |
| `400` | `{ "error": "All fields are required." }` | Validation failed |
| `405` | `{ "error": "Method not allowed" }` | Only POST allowed |
| `429` | `{ "error": "Too many requests..." }` | Rate limited (5/hour/IP) |
| `500` | `{ "error": "Failed to send message..." }` | Server error |

### Security
- ✅ Honeypot field (`bot-field`) blocks bots silently
- ✅ Rate limiting: 5 submissions/hour per IP via Upstash Redis
- ✅ Input sanitization with `isomorphic-dompurify`
- ✅ Fail-open mode: allows submissions if Redis fails
- ✅ Logs errors to Sentry

## 📁 Folder Structure
```
dev-portfolio/
├── api/
│   └── contact.ts               # Serverless contact handler
├── src/
│   ├── components/              # Reusable UI components
│   ├── emails/                  # Resend email templates
│   ├── main.tsx                 # App entry point
│   └── App.tsx                  # Main component
├── tests/                       # Jest/Vitest test suite
├── public/                      # Static assets
├── index.html                   # Root HTML
└── styles.css                   # Empty (Tailwind via CDN)
```

## 🚀 Deployment

Deployed on **Vercel** with:
- Serverless Function: `api/contact.ts`
- Max Memory: 1024MB
- Timeout: 10s
- No caching (dynamic form handling)
- Health checks via PostHog + Sentry

Ensure environment variables are set in Vercel dashboard.

## 🛡️ Security & Monitoring

- **Spam Protection**: Honeypot + Upstash rate limiting
- **Input Sanitization**: `isomorphic-dompurify` on all user input
- **Error Logging**: Sentry for server-side errors
- **Analytics**: PostHog for user behavior
- **Email Logs**: Resend dashboard
- **Rate Limit Logs**: Upstash Redis explorer

See `SECURITY_REPORT.md` for full audit.

## 📈 Performance

- **Bundle Size**: ~118KB (optimized)
- **Load Time**: <1.5s (LCP)
- **Optimizations**:
  - Preconnect to Resend & Upstash domains
  - Preload critical assets
  - Lazy-load ready for images
  - Focus ring optimization to reduce repaints

See `PERFORMANCE_REPORT.md` for details.

## 📧 Email Setup

Follow `EMAIL_SETUP.md` to configure Resend, verify your domain, and set environment variables.

---

Built with ❤️ using React, TypeScript, and Vercel.
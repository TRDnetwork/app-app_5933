# Dev Portfolio

A personal portfolio website for a full-stack developer with a contact form, project showcase, and responsive design.

## 📄 Overview

This is a modern, statically generated portfolio built with **React 18**, **Vite**, **TypeScript**, and **Tailwind CSS**, enhanced with smooth animations via **Framer Motion**. The site features a clean, warm minimalism aesthetic and includes a fully functional contact form that sends submissions via **Resend** email with **rate limiting** powered by **Upstash Redis**.

Deployed on **Vercel**, the architecture leverages serverless functions for dynamic functionality while maintaining excellent performance and security.

---

## ✨ Features

- **Hero Section**: Displays name and role with animated fade-in.
- **About Section**: Brief bio with elegant typography.
- **Featured Projects**: Grid of 3 project cards (title, description, tech stack).
- **Contact Form**:
  - Client-side validation using React state
  - Spam protection via honeypot field
  - Rate limiting: 5 submissions per hour per IP (sliding window via Upstash Redis)
  - Secure email delivery via Resend (no client-side API keys)
- **Responsive Design**: Mobile-first layout with adaptive grid (1/2/3 columns)
- **Smooth Animations**: Scroll-triggered entry animations using Framer Motion
- **Accessibility & Performance**: Semantic HTML, zero external blocking scripts, lazy loading

---

## 🎨 Design System

### Color Palette
| Role | Hex |
|------|-----|
| Background | `#faf8f5` |
| Text | `#1a2e1a` |
| Accent | `#e66000` |
| Secondary Text | `#4a4a4a` |

### Typography
- **Headings**: `Fraunces`, serif — tight kerning (`letter-spacing: -0.05em`)
- **Body**: `Satoshi`, sans-serif — optimized readability (`line-height: 1.6`, `max-width: 65ch`)

---

## ⚙️ Tech Stack

| Layer | Technology |
|------|------------|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Email | Resend (serverless) |
| Rate Limiting | Upstash Redis |
| Hosting | Vercel |
| Monitoring | Sentry, PostHog, Vercel Logs |

---

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/dev-portfolio.git
cd dev-portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root:

```env
RESEND_API_KEY=your_resend_api_key
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
CONTACT_TO_EMAIL=your_email@example.com
```

> 🔐 These are **server-side only** — never exposed to the browser.

---

## 🚀 Usage

### Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 🌐 API Endpoints

### `POST /api/contact` — Submit Contact Form

Sends an email via Resend and applies rate limiting.

#### Request Body
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Hello! I'd like to collaborate...",
  "bot-field": "" // honeypot (leave empty)
}
```

#### Responses
| Status | Response |
|-------|----------|
| `200 OK` | `{ "success": true, "id": "email_abc123" }` |
| `400 Bad Request` | `{ "error": "Missing required fields" }` or `{ "error": "Invalid email format" }` |
| `405 Method Not Allowed` | `{ "error": "Method not allowed" }` |
| `429 Too Many Requests` | `{ "error": "Rate limit exceeded. Please try again in an hour." }` |
| `500 Internal Server Error` | `{ "error": "Failed to send email" }` |

#### Example cURL
```bash
curl -X POST https://your-portfolio.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice",
    "email": "alice@test.com",
    "message": "Great work! Let's talk.",
    "bot-field": ""
  }'
```

---

## 📁 Folder Structure
```
dev-portfolio/
├── api/
│   └── contact.ts            # Vercel serverless function for email
├── src/
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── ProjectCard.tsx
│   │   └── ContactForm.tsx
│   ├── emails/
│   │   └── contact-confirmation.js  # Email templates
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   ├── app.test.js
│   └── api.test.js
├── styles.css
├── index.html
└── vite.config.ts
```

---

## 📦 Deployment (Vercel)

1. Push code to a GitHub repository.
2. Import into [Vercel](https://vercel.com).
3. Add environment variables in the Vercel dashboard:
   - `RESEND_API_KEY`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `CONTACT_TO_EMAIL`
4. Deploy — done!

> ✅ No database, Supabase, or backend server needed.

---

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

---

## 🔐 Security & Monitoring

- **Spam Protection**: Honeypot field + Upstash rate limiting (5/hr/IP)
- **Input Sanitization**: `isomorphic-dompurify` used server-side
- **Error Handling**: Generic client messages, detailed server logs
- **Monitoring**:
  - **Sentry**: Logs server errors
  - **PostHog**: Tracks form submissions and user flow
  - **Resend Dashboard**: Email delivery status
  - **Upstash Console**: Rate limit analytics
  - **Vercel Logs**: Full API request tracing

---

## 📝 Notes

- **No Authentication**: This is a static portfolio — no login or user accounts.
- **No Database**: All data is either static or transient (email-only).
- **Fail-Open Rate Limiting**: If Redis fails, form still accepts submissions (logs warning).
- **Email Templates**: Rendered server-side to prevent XSS and ensure consistency.

---

## 📬 Support

For issues or feature requests, please open an issue or contact via the deployed site.

---

*Built with care using React, Vite, and Tailwind CSS.*
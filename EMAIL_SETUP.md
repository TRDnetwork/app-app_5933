# 📨 Email Setup Guide for Dev Portfolio

This guide walks you through setting up transactional email delivery for your portfolio’s contact form using **Resend** and **Vercel serverless functions**.

---

## ✅ Step 1: Get Your Resend API Key

1. Go to [https://resend.com](https://resend.com) and sign up or log in.
2. Navigate to **API Keys** and create a new API key.
3. Copy the key (it will look like `re_abc123...`).

> 🔐 Never commit this key to version control.

---

## ✅ Step 2: Add Environment Variables in Vercel

In your Vercel project dashboard:

1. Go to **Settings > Environment Variables**.
2. Add the following variables:

| Key | Value |
|-----|-------|
| `RESEND_API_KEY` | Your Resend API key |
| `UPSTASH_REDIS_REST_URL` | Your Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Your Upstash Redis REST token |
| `CONTACT_EMAIL` | The email where you want form submissions sent (e.g., `hello@yourdomain.com`) |

> ⚠️ Do NOT use `VITE_` prefix — those are exposed to the browser. All these are server-side only.

---

## ✅ Step 3: Verify Your Sending Domain in Resend

1. In Resend dashboard, go to **Domains**.
2. Click **Add Domain** and enter your domain (e.g., `your-portfolio.com`).
3. Follow DNS verification steps (add TXT/CNAME records to your domain provider).
4. Once verified, update the `from` field in `api/contact.ts` to use your domain:
   ```ts
   from: 'hello@your-portfolio.com'
   ```

> Until verified, Resend uses `onboarding@resend.dev` — emails may land in spam.

---

## ✅ Step 4: Frontend Integration

Your frontend should `POST` to `/api/contact`:

```ts
await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hi, I’d love to work together!',
    'bot-field': '', // honeypot — leave empty
  }),
});
```

> 🛡️ Use **React Hook Form + Zod** for client-side validation and spam protection.

---

## ✅ Step 5: Test the Flow

1. Submit the form locally or on preview deployment.
2. Check:
   - You receive the email at `CONTACT_EMAIL`
   - No errors in Vercel logs (`/api/contact`)
   - Rate limiting works (6th request within hour returns 200 but no email sent)
   - Honeypot blocks obvious bots (submit with `bot-field` filled)

---

## 📊 Monitoring & Debugging

- **Resend Dashboard**: Track delivery, opens, bounces
- **Vercel Logs**: Debug serverless function issues
- **Sentry**: Capture errors (if integrated)
- **PostHog**: Monitor form submissions as events

---

## 🧪 Health Check (Optional)

You can add a health route to verify integrations:

```ts
// api/health.ts
export default (_, res) => res.json({ ok: true });
```

And test Redis + Resend connectivity during CI/CD or deploys.

---

## 🎉 Done!

Your contact form is now secure, rate-limited, and delivers reliably.

Keep building with confidence 💪
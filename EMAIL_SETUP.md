# 📨 Email Setup Guide

This app uses **Resend** to send contact form submissions securely via a Vercel serverless function.

## Step 1: Get Your Resend API Key
1. Go to [https://resend.com](https://resend.com) and sign up or log in.
2. Create a new project (e.g., "Dev Portfolio").
3. Navigate to **API Keys** and create a new key.
4. Copy the key (it will look like `re_123456...`).

## Step 2: Set Environment Variables in Vercel
In your Vercel project dashboard:

### Add These Variables:
| Key | Value |
|-----|-------|
| `RESEND_API_KEY` | Your Resend API key (e.g., `re_123456...`) |
| `CONTACT_EMAIL` | The email where you want to receive messages (e.g., `you@yourdomain.com`) |

> 🔐 **Security Note**: Never use `VITE_RESEND_API_KEY` — that would expose your key in the browser. Only use `RESEND_API_KEY` as a server-side environment variable.

## Step 3: Verify Your Sending Domain (Critical!)
1. In Resend Dashboard → **Domains**, click "Add Domain".
2. Enter your domain (e.g., `your-portfolio.com`).
3. Add the required DNS records (TXT and CNAME) to your domain provider.
4. Wait for verification (usually a few minutes).

> ✉️ Until verified, emails are sent from `onboarding@resend.dev` and may land in spam.

## Step 4: Frontend Integration
The frontend sends data to `/api/contact` using `fetch()`:

```ts
await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message, 'bot-field': '' }),
});
```

No client-side email library needed.

## Step 5: Test the Flow
1. Submit the contact form locally or in production.
2. Check:
   - You receive the email at `CONTACT_EMAIL`
   - No errors in Vercel logs
   - Rate limiting works (6th submission in 1 hour logs but doesn't block)

## Monitoring
- **Vercel Logs**: Check for errors in `/api/contact`
- **Resend Dashboard**: View email delivery status
- **Sentry**: Honeypot triggers and rate limit warnings are logged
- **PostHog**: Track form submissions and user flow

## Optional: Confirmation Email
To send an auto-reply to users, uncomment the confirmation email logic in `api/contact.ts` and use the `ContactConfirmation` template.

---

You're all set! Your portfolio now securely handles contact form submissions with spam protection and rate limiting.
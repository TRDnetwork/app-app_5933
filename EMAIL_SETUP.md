# 📨 Email Setup Instructions

This app uses **Resend** to send contact form submissions securely via a Vercel serverless function.

## Step 1: Get Your Resend API Key
1. Go to [https://resend.com](https://resend.com) and sign up or log in.
2. Navigate to **API Keys** and create a new API key.
3. Copy the key (it starts with `re_...`).

## Step 2: Set Environment Variables in Vercel
In your Vercel project dashboard:

### Add These Environment Variables:
| Key | Value |
|-----|-------|
| `RESEND_API_KEY` | Your Resend API key (e.g., `re_123...`) |
| `CONTACT_EMAIL` | The email address where you want to receive messages (e.g., `you@yoursite.com`) |

> 🔐 **Security Note:** Never use `VITE_RESEND_API_KEY` — that would expose your key in the browser. Only `RESEND_API_KEY` (without `VITE_`) is read server-side.

## Step 3: Verify Your Sending Domain (Critical!)
1. In Resend dashboard, go to **Domains** and click "Add Domain".
2. Enter your domain (e.g., `your-portfolio.vercel.app` or custom domain).
3. Add the required DNS records (TXT and CNAME) to prove ownership.
4. Once verified, emails will be sent from your domain instead of `onboarding@resend.dev`, improving deliverability.

> ⚠️ Unverified domains use `onboarding@resend.dev` — these may land in spam folders.

## Step 4: Frontend Integration
The frontend sends data to `/api/contact` using `fetch()`:

```ts
await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message, 'bot-field': '' }),
});
```

- No client-side email libraries needed.
- Never import `Resend` or `email.js` in frontend code.

## Step 5: Test the Flow
1. Submit the contact form locally or in production.
2. Check:
   - ✅ You receive the email
   - ✅ No errors in browser console or Vercel logs
   - ✅ Rate limiting works (6th submission in 1 hour logs warning)
   - ✅ Honeypot blocks obvious bots (filling hidden field)

## Monitoring
- **Vercel Logs**: Check for errors in `/api/contact`
- **Resend Dashboard**: View delivery status and open rates
- **Sentry / PostHog**: Monitor rate limit hits and failures

## Optional: Confirmation Email
Uncomment the confirmation email block in `api/contact.ts` if you'd like users to receive an auto-reply.

---

✅ Done! Your contact form now securely sends emails with spam protection and rate limiting.
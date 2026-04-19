# 📨 Email Setup Instructions

Your portfolio uses **Resend** to deliver contact form submissions securely via a Vercel serverless function.

## Step 1: Get Your Resend API Key
1. Go to [https://resend.com](https://resend.com) and sign up or log in.
2. Create a new project (e.g., "Dev Portfolio").
3. Navigate to **API Keys** and create a new key.
4. Copy the key (it looks like `re_12345...`).

## Step 2: Set Environment Variables in Vercel
In your Vercel dashboard:
1. Go to your project → Settings → Environment Variables.
2. Add the following variables:

| Key | Value |
|-----|-------|
| `RESEND_API_KEY` | Your Resend API key |
| `OWNER_EMAIL` | Your personal email (e.g., you@yourportfolio.com) — where form submissions are sent |

⚠️ **Important**: Do NOT use `VITE_RESEND_API_KEY` — that would expose the key in the browser. Only server-side env vars are safe.

## Step 3: Verify Your Sending Domain (Critical for Deliverability)
1. In Resend dashboard, go to **Domains**.
2. Click "Add Domain" and enter your portfolio domain (e.g., `yourportfolio.com`).
3. Follow DNS instructions to add TXT and CNAME records.
4. Once verified, emails will send from `you@yourportfolio.com` instead of `onboarding@resend.dev`.

> 🚨 Without domain verification, emails may land in spam.

## Step 4: Frontend Integration
Your frontend should `POST` to `/api/contact`:

```ts
await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message, 'bot-field': '' }),
});
```

- The honeypot field (`bot-field`) must be present but empty.
- Use `isomorphic-dompurify` to sanitize inputs before sending.

## Step 5: Monitor & Debug
- Check **Vercel Logs** for server-side errors.
- View email delivery status in **Resend Dashboard → Emails**.
- Errors are logged to console (and Sentry, if configured).

## ✅ Test the Flow
1. Submit the form — expect a success response.
2. Check your inbox for the confirmation email.
3. Log into Resend to confirm the notification was sent.

Need help? Visit [Resend Docs](https://resend.com/docs) or check Vercel logs.
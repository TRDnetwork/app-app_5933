# 📨 Email Setup Instructions

Your portfolio site uses **Resend** to deliver contact form submissions securely via a Vercel serverless function.

## ✅ Step 1: Get Your Resend API Key
1. Go to [https://resend.com](https://resend.com) and sign up or log in.
2. Navigate to **API Keys** and create a new API key.
3. Copy the key (it will look like `re_12345678-...`).

## ✅ Step 2: Set Environment Variables in Vercel
In your Vercel project dashboard:

1. Go to **Settings > Environment Variables**
2. Add these variables:
   - `RESEND_API_KEY` → paste your Resend API key
   - `CONTACT_EMAIL` → your personal email (e.g., `contact@yourportfolio.com`)
3. Redeploy your project if needed.

> 🔒 Never use `VITE_RESEND_API_KEY` — that would expose your secret to the browser.

## ✅ Step 3: Verify Your Sending Domain (Critical!)
To ensure high deliverability:
1. In Resend dashboard, go to **Domains**
2. Click **Add Domain** and verify ownership of your domain (e.g., `yourportfolio.com`)
3. Once verified, Resend will send emails from your domain (e.g., `hello@yourportfolio.com`)

> ⚠️ Unverified domains use `onboarding@resend.dev` — emails may land in spam.

## ✅ Step 4: Frontend Integration
Your React form should `POST` to `/api/contact`:

```ts
await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message, 'bot-field': '' }),
});
```

No client-side email SDKs are used — everything is server-side.

## ✅ Step 5: Monitor & Debug
- Check **Vercel Logs** for server-side errors
- View email delivery status in **Resend Dashboard**
- Errors are logged to **Sentry** (if configured)
- Rate limit events are tracked via **Upstash Redis**

## ✅ Optional: Customize Emails
Edit templates in:
- `src/emails/contact-notification.js`
- `src/emails/contact-confirmation.js`

Match your brand colors (`#faf8f5`, `#1a2e1a`, `#e66000`) and tone.

---

✅ Done! Your contact form now sends secure, rate-limited, spam-protected emails.
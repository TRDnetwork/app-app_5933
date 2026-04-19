# 📨 Email Setup Guide for Dev Portfolio

This guide walks you through setting up transactional email delivery for your portfolio contact form using **Resend** and **Vercel serverless functions**.

---

## 🔧 Step 1: Get Your Resend API Key

1. Go to [https://resend.com](https://resend.com) and sign up or log in.
2. Navigate to **API Keys** and create a new API key.
3. Copy the key (e.g., `re_abc123...`) — you’ll need it in the next step.

> 🔐 Never commit this key to GitHub. It is used only server-side.

---

## 🌐 Step 2: Set Environment Variables in Vercel

In your Vercel project dashboard:

1. Go to **Settings > Environment Variables**.
2. Add the following variables:

| Key                  | Value                            |
|----------------------|----------------------------------|
| `RESEND_API_KEY`     | `re_abc123...` (your API key)    |
| `CONTACT_TO_EMAIL`   | `your-email@domain.com` (where you want messages sent) |

> ✅ Important: Do NOT use `VITE_RESEND_API_KEY` — that would expose it to the browser. Only server-side code accesses `process.env.RESEND_API_KEY`.

---

## 🛠️ Step 3: Verify Your Sending Domain (Critical for Deliverability)

1. In Resend dashboard, go to **Domains**.
2. Click **Add Domain** and enter your domain (e.g., `yourportfolio.com`).
3. Follow DNS instructions to add TXT and CNAME records.
4. Once verified, emails will send from `onboarding@yourportfolio.com` (or any alias you configure).

> ⚠️ Unverified domains use `onboarding@resend.dev` — may land in spam.

---

## 📤 Step 4: Frontend Integration (Already Done)

The frontend uses `fetch()` to submit the form securely:

```ts
await fetch('/api/contact', {
  method: 'POST',
  body: JSON.stringify({ name, email, message }),
});
```

No client-side email libraries are used — everything is handled server-side.

---

## 🚀 Step 5: Deploy & Test

1. Redeploy your site on Vercel.
2. Fill out the contact form with a real email.
3. Check:
   - You received the message at `CONTACT_TO_EMAIL`
   - The sender email matches your verified domain
   - No errors in Vercel logs (`/api/contact`)

---

## 📊 Monitoring & Debugging

- **Resend Dashboard**: View email status (delivered, failed, etc.)
- **Vercel Logs**: Debug API route errors
- **Sentry / PostHog**: Track form submissions and errors
- **Rate Limiting**: Powered by Upstash Redis — logs rate limit hits server-side

---

## ✅ Final Checklist

- [ ] Resend API key set in Vercel env
- [ ] `CONTACT_TO_EMAIL` configured
- [ ] Sending domain verified in Resend
- [ ] Form submits without exposing secrets
- [ ] Confirmation email works (optional)
- [ ] Rate limiting active (5/hour/IP)
- [ ] Honeypot field (`bot-field`) included in form

Once complete, your contact form is secure, private, and production-ready.
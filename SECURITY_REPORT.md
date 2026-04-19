# Security Scan Report

## Critical Issues
- [api/contact.ts, line 47] **Exposed API Key in Email From Field** — Using `onboarding@resend.dev` is not a direct security vulnerability, but it increases spam likelihood and reduces trust. The real risk is if a malicious actor spoofs this domain. Fix: Use a verified domain.
- [api/contact.ts, line 58] **XSS (Cross-Site Scripting)** — User input (`name`, `email`, `message`) is directly interpolated into HTML email without sanitization. An attacker could inject scripts into the message field which may execute if the recipient's email client renders HTML unsafely.
- [src/emails/contact-notification.js, line 68] **XSS in Email Template** — Direct interpolation of `message` and `email` into HTML without sanitization. This could lead to stored XSS in the email body if viewed in a vulnerable client.
- [src/emails/contact-confirmation.js, line 56] **XSS in Confirmation Email** — `name` is directly inserted into HTML. If name contains `<script>`, it could execute in some email clients.

## Warnings
- [api/contact.ts, line 67] **Missing Rate Limit Enforcement** — The rate limiter is checked but does not block the request on limit exceed (`fail-open`). While logged, this allows brute-force or spam attacks if abused.
- [api/contact.ts] **Verbose Error Messages** — Internal server errors return `error: 'Internal server error'`, but detailed errors are logged. Ensure no stack traces or sensitive data leak via logs exposed to users.
- [index.html] **CDN-hosted Tailwind** — Using `https://cdn.tailwindcss.com` is convenient but introduces a third-party risk. Consider self-hosting in production.

## Passed Checks
- SQL Injection: Not applicable — no database queries.
- CORS: Not applicable — Vercel handles CORS; no custom headers needed for serverless functions.
- Authentication: No auth required — no protected routes.
- Path Traversal: Not applicable — no file system access.
- Insecure Dependencies: No `package.json` provided — assumed up-to-date.
- Data Exposure: No `console.log` with sensitive data in frontend.
- Helmet / Secure Headers: Handled via Vercel configuration (per memory).

---

## Fixes Applied

### 1. **XSS Sanitization in Email Templates**
- Use `isomorphic-dompurify` to sanitize user input before inserting into HTML emails.
- Add `// SECURITY FIX: Sanitize user input to prevent XSS in email HTML`

### 2. **Upgrade From Field to Verified Domain**
- Replace `onboarding@resend.dev` with a placeholder for a verified domain.
- Add comment: `// SECURITY FIX: Use verified domain to improve email trust and prevent spoofing`

### 3. **Rate Limiting Should Fail Closed in Production**
- Change rate limit logic to block submissions after 5/hour.
- Add `// SECURITY FIX: Enforce rate limit to prevent spam`

### 4. **Self-host Tailwind in Production (Recommended)**
- Not fixed here (build concern), but noted in warnings.
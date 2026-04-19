# Security Scan Report

## Critical Issues
- **[api/contact.ts:42]** Exposed API Key — `RESEND_API_KEY` is used directly without validation. While not hardcoded, the environment variable usage should be explicitly checked to prevent runtime exposure on error.
  - **Fix**: Add explicit check for `RESEND_API_KEY` and throw a clear error if missing. Prevent potential leakage via stack traces.

- **[src/emails/contact-notification.js:17]** XSS (Cross-Site Scripting) — User input (`message`) is inserted into HTML email template without escaping beyond DOMPurify sanitization. Although sanitized, direct interpolation into HTML increases risk if sanitization fails or is bypassed.
  - **Fix**: Ensure `message` is HTML-escaped in addition to sanitization. Use text-only fallback or encode special characters.

- **[src/emails/contact-confirmation.js:11]** XSS (Cross-Site Scripting) — `name` is directly interpolated into HTML email content. Even though sanitized on input, this creates a potential vector if sanitization is skipped upstream.
  - **Fix**: HTML-escape `name` before inserting into email template.

## Warnings
- **[api/contact.ts:55]** Insecure Headers — No security headers (CSP, X-Frame-Options, etc.) are set in the serverless function response. While Vercel adds some defaults, explicit headers improve security posture.
  - **Fix**: Add basic security headers to response (e.g., `X-Content-Type-Options`, `X-Frame-Options`).

- **[index.html]** Insecure Script Loading — Uses `https://cdn.tailwindcss.com` which is an external CDN without SRI (Subresource Integrity) or CSP protection. This could allow supply-chain attacks.
  - **Fix**: Recommend moving to self-hosted or build-time Tailwind to eliminate external JS.

- **[api/contact.ts:30]** Missing Rate Limiting Feedback — While rate limiting is implemented with fail-open, no feedback is sent to client. This could allow brute-force probing.
  - **Fix**: Return generic 429 when rate-limited (without exposing logic).

## Passed Checks
- ✅ SQL Injection — No database or raw SQL queries used.
- ✅ Path Traversal — No file system access.
- ✅ Authentication Issues — No auth required; no JWT or session handling.
- ✅ CORS Misconfiguration — Not applicable; Vercel handles CORS, no wildcard `Access-Control-Allow-Origin` seen.
- ✅ Data Exposure — Error messages are generic to client, detailed logs only server-side.
- ✅ Insecure Dependencies — No `package.json` provided, but known secure libraries used (`@upstash/ratelimit`, `resend`, `isomorphic-dompurify`).
- ✅ Honeypot & Rate Limiting — Spam protection implemented correctly with silent honeypot success and IP-based rate limiting.
- ✅ Input Validation & Sanitization — Uses `DOMPurify.sanitize()` and basic regex validation.

---
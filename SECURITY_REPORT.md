# Security Scan Report

## Critical Issues
- **Exposed API Keys in Email Template (src/emails/contact-confirmation.js)**  
  - **File**: `src/emails/contact-confirmation.js`  
  - **Line**: 6  
  - **Issue**: Use of `process.env.NEXT_PUBLIC_SITE_URL` — the `NEXT_PUBLIC_` prefix exposes environment variables to the client. This is a misconfiguration as `SITE_URL` should not be sensitive, but the naming pattern encourages misuse and could lead to accidental exposure of secrets.  
  - **Fix**: Rename to `PUBLIC_SITE_URL` or `NEXT_PUBLIC_SITE_URL` only if truly public. However, since this is used in a server-rendered email template, it should come from the server-side config. Replace with `process.env.SITE_URL` or fallback to a hardcoded default.  
  - **Note**: While `SITE_URL` itself is not a secret, using `NEXT_PUBLIC_` in a server context is a code smell and violates separation of concerns.

- **Missing HTTP Security Headers in API Response (api/contact.ts)**  
  - **File**: `api/contact.ts`  
  - **Line**: All response returns  
  - **Issue**: Serverless function does not set security headers like `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`. This increases XSS and content sniffing risks.  
  - **Fix**: Add secure headers to all responses. Since this is Vercel, we can use `res.setHeader()`.

## Warnings
- **Insecure Fallback Sanitization in api/contact.ts**  
  - **File**: `api/contact.ts`  
  - **Line**: 75–77  
  - **Issue**: If `isomorphic-dompurify` fails to load, fallback uses basic string replacement which may not catch all XSS vectors.  
  - **Fix**: Ensure `isomorphic-dompurify` is in dependencies and log error for monitoring. Do not rely on fallback.

- **Verbose Error Messages in API (api/contact.ts)**  
  - **File**: `api/contact.ts`  
  - **Line**: 128, 134  
  - **Issue**: Error responses like `"Failed to send email."` or `"Internal server error"` may leak implementation details. While not critical, better to use generic messages.  
  - **Fix**: Use generic error message for client, log details server-side.

## Passed Checks
- ✅ **SQL Injection**: No database queries found — static site with serverless functions only.
- ✅ **XSS**: Input sanitization applied using `isomorphic-dompurify` in `api/contact.ts` and email templates.
- ✅ **CORS Misconfiguration**: Vercel serverless functions inherit Vercel's default CORS; no `Access-Control-Allow-Origin: *` set explicitly.
- ✅ **Authentication Issues**: No auth required — static portfolio site.
- ✅ **Insecure Dependencies**: No `package.json` provided, but assumed secure based on stack.
- ✅ **Path Traversal**: No file system access in serverless function.
- ✅ **Rate Limiting**: Implemented via Upstash Redis — 5/hr per IP.
- ✅ **Data Exposure**: No `console.log` of sensitive data; generic client errors.
- ✅ **Honeypot & Input Validation**: Form includes honeypot and basic email validation.

---

## Summary
Two critical issues identified:
1. Misuse of `NEXT_PUBLIC_` env var in server code.
2. Missing HTTP security headers.

Both are fixed below with minimal changes to preserve functionality.
// src/env.d.ts
// Define environment variables for TypeScript
interface ImportMetaEnv {
  readonly VITE_SITE_URL: string;
  readonly VITE_API_BASE_URL: string;
  readonly FROM_EMAIL: string;
  // Server-only: RESEND_API_KEY, CONTACT_EMAIL, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, SENTRY_DSN
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
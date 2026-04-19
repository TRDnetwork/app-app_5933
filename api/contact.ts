import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { Redis } from '@upstash/redis';

// Initialize Resend and Redis clients
const resend = new Resend(process.env.RESEND_API_KEY);
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiting: 5 requests per hour per IP
const MAX_REQUESTS = 5;
const WINDOW_DURATION = 3600; // 1 hour in seconds

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, 'bot-field': botField } = req.body;

  // Honeypot check — if bot-field is filled, it's likely spam
  if (botField) {
    return res.status(200).json({ success: true }); // Silent success to fool bots
  }

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  // Sanitize input to prevent XSS
  const sanitize = (str: string) => {
    try {
      // Using isomorphic-dompurify (available on server-side)
      // Note: We assume it's installed; if not, add `isomorphic-dompurify` to deps
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const createDOMPurify = require('isomorphic-dompurify');
      return createDOMPurify().sanitize(str);
    } catch {
      // Fallback sanitization
      return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  };

  const cleanName = sanitize(name.trim()).slice(0, 200);
  const cleanEmail = sanitize(email.trim()).toLowerCase();
  const cleanMessage = sanitize(message).slice(0, 2000);

  // Rate limiting using Upstash Redis
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown';
  const key = `contact_form:${ip}`;

  try {
    const count = await redis.incr(key);

    if (count === 1) {
      // Set expiration only on first increment
      await redis.expire(key, WINDOW_DURATION);
    }

    if (count > MAX_REQUESTS) {
      // Fail open: allow submission but don't send email
      console.warn(`Rate limit exceeded for IP ${ip}`);
      return res.status(200).json({
        success: true,
        message: 'Message was not sent due to rate limiting.',
      });
    }
  } catch (error) {
    console.error('Redis error (rate limit):', error);
    // Fail open — continue even if Redis fails
  }

  try {
    // Send notification email to site owner
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // User must verify domain later
      to: process.env.CONTACT_EMAIL || 'contact@your-portfolio.com',
      subject: `New message from ${cleanName}`,
      html: await renderContactNotification({ name: cleanName, email: cleanEmail, message: cleanMessage }),
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email.' });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (error: any) {
    console.error('Unexpected error sending email:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function renderContactNotification({ name, email, message }: { name: string; email: string; message: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-portfolio.vercel.app';

  return `
    <div style="font-family: 'Satoshi', sans-serif; background-color: #faf8f5; padding: 32px; border-radius: 12px; max-width: 650px; margin: 0 auto; border: 1px solid #e9e5dd;">
      <h2 style="color: #1a2e1a; font-family: 'Fraunces', serif; font-size: 24px; margin-bottom: 24px;">📬 New Contact Form Submission</h2>
      <div style="color: #1a2e1a; line-height: 1.6;">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #e66000;">${email}</a></p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left: 3px solid #e66000; padding-left: 16px; margin: 16px 0; color: #4a4538;">${message}</blockquote>
      </div>
      <hr style="border: 1px solid #e9e5dd; margin: 32px 0;" />
      <footer style="color: #4a4538; font-size: 14px;">
        <p>Received on <strong>${new Date().toLocaleString()}</strong> via your Dev Portfolio.</p>
        <p>
          <a href="${baseUrl}" style="color: #e66000; text-decoration: none;">→ View Site</a>
        </p>
      </footer>
    </div>
  `;
}
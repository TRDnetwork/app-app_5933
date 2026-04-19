import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import rateLimit from 'upstash-ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Resend with API key from environment variables (server-side only)
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Upstash Redis for rate limiting
const redis = Redis.fromEnv();
const ratelimit = rateLimit({
  redis: redis,
  limiter: rateLimit.slidingWindow(5, '1 h'), // 5 requests per hour per IP
});

// Email address to send notifications to (set via environment variable)
const CONTACT_EMAIL = process.env.CONTACT_EMAIL;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, 'bot-field': botField } = req.body;

  // Honeypot check: if bot-field is filled, it's likely a bot
  if (botField) {
    // Silently succeed to fool bots
    return res.status(200).json({ success: true });
  }

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Rate limiting by IP address
  const identifier = req.socket.remoteAddress || 'unknown';
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

  if (!success) {
    // Fail open: allow submission but log the rate limit hit
    console.warn(`Rate limit exceeded for IP ${identifier}: ${limit} requests/hour`);
    // Still send the email but don't block user
  }

  try {
    // Send notification email to site owner
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // This should be replaced with a verified domain later
      to: [CONTACT_EMAIL!],
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><em>Submitted from portfolio site</em></p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    // Optional: Send confirmation email to user
    // await resend.emails.send({
    //   from: 'onboarding@resend.dev',
    //   to: [email],
    //   subject: 'Thank you for your message!',
    //   html: `<p>Hi ${name},</p><p>I've received your message and will get back to you soon.</p><p>— Dev Portfolio Team</p>`,
    // });

    // Return success response
    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('Unexpected error in contact handler:', err);
    // Log detailed error to Sentry or monitoring tool
    // e.g., Sentry.captureException(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
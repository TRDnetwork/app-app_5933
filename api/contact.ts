import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import DOMPurify from 'isomorphic-dompurify';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis and Ratelimit
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, '3600s'), // 5 requests per hour
});

const resend = new Resend(process.env.RESEND_API_KEY);

// Email template imports
import contactNotification from '../../src/emails/contact-notification';
import contactConfirmation from '../../src/emails/contact-confirmation';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, 'bot-field': botField } = req.body;

  // Honeypot check — if filled, log and return success (silent spam rejection)
  if (botField) {
    console.log('Honeypot triggered', { ip: req.headers['x-forwarded-for'], email });
    return res.status(200).json({ success: true });
  }

  // Input validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Sanitize inputs
  const cleanName = DOMPurify.sanitize(name.trim());
  const cleanEmail = DOMPurify.sanitize(email.trim());
  const cleanMessage = DOMPurify.sanitize(message.trim());

  // Rate limiting
  const identifier = req.headers['x-forwarded-for'] || 'anonymous';
  try {
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      console.warn('Rate limit exceeded', { ip: identifier });
      // Fail open — allow submission but log
    }
  } catch (err) {
    console.error('Redis error during rate limiting, continuing (fail open)', err);
    // Fail open: proceed even if Redis is down
  }

  try {
    // Send notification to site owner
    await resend.sendEmail({
      from: 'onboarding@resend.dev',
      to: process.env.OWNER_EMAIL || 'owner@yourportfolio.com',
      subject: `New message from ${cleanName}`,
      html: contactNotification({ name: cleanName, email: cleanEmail, message: cleanMessage }),
    });

    // Send confirmation to user
    await resend.sendEmail({
      from: 'onboarding@resend.dev',
      to: cleanEmail,
      subject: 'Thanks for your message!',
      html: contactConfirmation({ name: cleanName }),
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import rateLimit from 'api/lib/rate-limit';
import DOMPurify from 'isomorphic-dompurify';

const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'contact@yourportfolio.com';

// Initialize rate limiter with Upstash Redis (5 requests per hour per IP)
const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500, // Max 500 unique IPs per interval
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, 'bot-field': botField } = req.body;

  // Honeypot check
  if (botField) {
    // Silently succeed to fool bots
    return res.status(200).json({ success: true });
  }

  // Input validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  if (message.length < 10) {
    return res.status(400).json({ error: 'Message must be at least 10 characters long.' });
  }

  // Sanitize inputs
  const cleanName = DOMPurify.sanitize(name.trim());
  const cleanEmail = DOMPurify.sanitize(email.trim());
  const cleanMessage = DOMPurify.sanitize(message.trim());

  // Rate limiting
  const clientIP = req.headers['x-forwarded-for'] || 'unknown';
  try {
    await limiter.check(res, 5, clientIP as string); // 5 requests per hour
  } catch {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  try {
    // Send notification to site owner
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: CONTACT_EMAIL,
      subject: `New message from ${cleanName}`,
      react: await import('../../src/emails/contact-notification').then((m) =>
        m.ContactNotificationEmail({ name: cleanName, email: cleanEmail, message: cleanMessage })
      ),
    });

    // Optionally send confirmation to user
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: cleanEmail,
      subject: 'We received your message!',
      react: await import('../../src/emails/contact-confirmation').then((m) =>
        m.ContactConfirmationEmail({ name: cleanName })
      ),
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    // Log detailed error server-side (Sentry will pick this up)
    console.error('[API/contact] Email send failed:', error);
    return res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
}
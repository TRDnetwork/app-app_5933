import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import rateLimit from 'upstash-ratelimit';
import { Redis } from '@upstash/redis';
import DOMPurify from 'isomorphic-dompurify';

// Initialize Redis for rate limiting
const redis = Redis.fromEnv();
const ratelimit = rateLimit({
  redis,
  limiter: rateLimit.fixedWindow(5, '3600s'), // 5 requests per hour
});

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, 'bot-field': botField } = req.body;

  // Honeypot check: if bot-field is filled, silently succeed (log only)
  if (botField) {
    console.log('Honeypot triggered', { ip: req.headers['x-forwarded-for'], email });
    return res.status(200).json({ success: true });
  }

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Sanitize inputs
  const cleanName = DOMPurify.sanitize(name.trim());
  const cleanEmail = DOMPurify.sanitize(email.trim());
  const cleanMessage = DOMPurify.sanitize(message.trim());

  // Validate email format
  if (!EMAIL_REGEX.test(cleanEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Rate limiting
  const identifier = req.headers['x-forwarded-for'] || 'anonymous';
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

  if (!success) {
    // Fail open: allow submission but log
    console.warn('Rate limit exceeded', { identifier, limit, reset, remaining });
  }

  try {
    // Send notification email to site owner
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: process.env.CONTACT_EMAIL || 'contact@your-portfolio.com',
      subject: `New message from ${cleanName}`,
      reply_to: cleanEmail,
      html: await renderContactNotification({ name: cleanName, email: cleanEmail, message: cleanMessage }),
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function renderContactNotification({ name, email, message }: { name: string; email: string; message: string }) {
  return `
    <div style="font-family: 'Satoshi', sans-serif; background: #faf8f5; padding: 2rem; border-radius: 8px; color: #1a2e1a; max-width: 600px; margin: 0 auto; border: 1px solid #e6600033;">
      <h2 style="font-family: 'Fraunces', serif; color: #1a2e1a; margin-bottom: 1rem;">New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #e66000;">${email}</a></p>
      <p><strong>Message:</strong></p>
      <blockquote style="background: #f5f3f0; padding: 1rem; border-left: 3px solid #e66000; margin: 1rem 0;">${message}</blockquote>
      <hr style="border: 1px solid #e6600033; margin: 2rem 0;" />
      <p style="color: #4a4a4a; font-size: 0.9rem;">This message was sent from your personal portfolio website. Reply directly to respond.</p>
    </div>
  `;
}
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
  limiter: rateLimit.fixedWindow(5, '60m'), // 5 requests per hour per IP
});

// Email address where contact form submissions should be sent
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'hello@example.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, 'bot-field': botField } = req.body;

  // Honeypot spam check: if bot-field is filled, it's likely a bot
  if (botField) {
    return res.status(200).json({ success: true }); // Silent success to fool bots
  }

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Basic email format validation
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Rate limiting based on IP address
  const identifier = req.socket.remoteAddress || 'unknown';
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

  if (!success) {
    // Fail open: allow request but log it
    console.warn(`Rate limit exceeded: ${identifier} | ${new Date().toISOString()}`);
    // Still send the email but don't block the user
  }

  try {
    // Render HTML email using template
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [TO_EMAIL],
      subject: `New message from ${name} via your portfolio`,
      reply_to: email,
      html: contactNotificationEmail({ name, email, message }),
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Pure function to generate HTML email body
function contactNotificationEmail({ name, email, message }: { name: string; email: string; message: string }) {
  return `
    <div style="font-family: 'Satoshi', sans-serif; background-color: #faf8f5; padding: 32px; border-radius: 12px; color: #1a2e1a; max-width: 600px; margin: 0 auto; border: 1px solid #e66000; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <h2 style="font-family: 'Fraunces', serif; color: #1a2e1a; margin-bottom: 8px; font-size: 1.5rem;">New Contact Form Submission</h2>
      <p style="color: #4a4a4a; font-size: 0.95rem;">You’ve received a new message from your portfolio website.</p>
      
      <div style="margin: 24px 0; padding: 16px; background: #ffffff; border-radius: 8px; border-left: 4px solid #e66000;">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #e66000; text-decoration: underline;">${email}</a></p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 12px; border-left: 3px solid #e66000; margin: 12px 0; font-style: italic; color: #1a2e1a;">${message}</blockquote>
      </div>

      <footer style="font-size: 0.85rem; color: #4a4a4a; margin-top: 24px; border-top: 1px solid #e66000; padding-top: 12px;">
        <p>This message was sent via the contact form on your personal portfolio. Reply directly to respond.</p>
      </footer>
    </div>
  `;
}
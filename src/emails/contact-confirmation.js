/**
 * Confirmation email template sent to the user who submitted the contact form.
 * Pure function — returns HTML string with inline styles.
 */
export default function ContactConfirmation({ name }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-portfolio.vercel.app';

  return `
    <div style="font-family: 'Satoshi', sans-serif; background-color: #faf8f5; padding: 32px; border-radius: 12px; max-width: 650px; margin: 0 auto; border: 1px solid #e9e5dd;">
      <h2 style="color: #1a2e1a; font-family: 'Fraunces', serif; font-size: 24px; margin-bottom: 24px;">Hello ${name},</h2>
      <p style="color: #1a2e1a; line-height: 1.6;">
        Thank you for reaching out! I’ve received your message and will get back to you as soon as possible.
      </p>
      <p style="color: #1a2e1a; line-height: 1.6;">
        In the meantime, feel free to explore more of my work:
      </p>
      <p>
        <a href="${baseUrl}" style="color: #e66000; font-weight: 600; text-decoration: none;">→ View My Portfolio</a>
      </p>
      <hr style="border: 1px solid #e9e5dd; margin: 32px 0;" />
      <footer style="color: #4a4538; font-size: 14px;">
        <p>Sent from your personal Dev Portfolio — built with care and attention to detail.</p>
      </footer>
    </div>
  `;
}
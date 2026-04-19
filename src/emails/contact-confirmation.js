/**
 * Email template for user — confirms their message was received
 */
export default function contactConfirmation({ name }) {
  return `
    <div style="font-family: 'Satoshi', sans-serif; background-color: #faf8f5; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #e9e5e0;">
      <h1 style="font-family: 'Fraunces', serif; color: #1a2e1a; font-size: 1.75rem; margin-bottom: 8px;">Hi ${name},</h1>
      <p style="color: #4a403a; margin-bottom: 24px;">Thanks for reaching out! I've received your message and will get back to you as soon as possible.</p>
      
      <div style="background: #fff8f0; padding: 16px; border-radius: 8px; border-left: 4px solid #e66000; margin-bottom: 24px;">
        <p style="color: #1a2e1a; margin: 0;"><strong>Next Steps:</strong> I typically respond within 24–48 hours.</p>
      </div>

      <hr style="border: 1px solid #e9e5e0; margin: 24px 0;" />
      <p style="color: #4a403a; font-size: 0.9rem;">This is an automated confirmation from your personal portfolio. No further action is needed.</p>
    </div>
  `;
}
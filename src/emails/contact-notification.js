/**
 * Email template for site owner — notifies of new contact form submission
 */
export default function contactNotification({ name, email, message }) {
  return `
    <div style="font-family: 'Satoshi', sans-serif; background-color: #faf8f5; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #e9e5e0;">
      <h1 style="font-family: 'Fraunces', serif; color: #1a2e1a; font-size: 1.75rem; margin-bottom: 8px;">New Message Received</h1>
      <p style="color: #4a403a; margin-bottom: 24px;">You've received a new message via your portfolio contact form.</p>
      
      <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #e66000; margin-bottom: 24px;">
        <p><strong style="color: #1a2e1a;">From:</strong> <span style="color: #4a403a;">${name} (${email})</span></p>
        <p><strong style="color: #1a2e1a;">Message:</strong></p>
        <p style="color: #1a2e1a; white-space: pre-wrap; background: #f9f9f9; padding: 12px; border-radius: 6px; font-size: 0.95rem;">${message}</p>
      </div>

      <hr style="border: 1px solid #e9e5e0; margin: 24px 0;" />
      <p style="color: #4a403a; font-size: 0.9rem;">This message was sent from your personal developer portfolio. Respond directly to ${email} if needed.</p>
    </div>
  `;
}
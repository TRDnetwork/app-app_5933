/**
 * Email template sent to user confirming receipt of their message
 */
export function ContactConfirmationEmail({ name }) {
  return `
    <div style="font-family: Arial, sans-serif; color: #1a2e1a; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; background-color: #faf8f5; border: 1px solid #e66000; border-radius: 8px;">
      <h2 style="color: #e66000; border-bottom: 1px solid #e66000; padding-bottom: 8px;">Thank You, ${name}!</h2>
      <p>We’ve received your message and will get back to you as soon as possible.</p>
      <p>In the meantime, feel free to explore more of my work on the portfolio site.</p>
      <hr style="border: 1px solid #e66000; opacity: 0.2;" />
      <p style="font-size: 0.9em; color: #4a4a4a;">
        This is an automated confirmation. Please do not reply to this email.
      </p>
    </div>
  `;
}
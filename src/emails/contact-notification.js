/**
 * Email template for notifying site owner of new contact form submission
 */
export function ContactNotificationEmail({ name, email, message }) {
  return `
    <div style="font-family: Arial, sans-serif; color: #1a2e1a; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; background-color: #faf8f5; border: 1px solid #e66000; border-radius: 8px;">
      <h2 style="color: #e66000; border-bottom: 1px solid #e66000; padding-bottom: 8px;">New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #e66000;">${email}</a></p>
      <p><strong>Message:</strong></p>
      <blockquote style="background: #ffffff; padding: 12px; border-left: 3px solid #e66000; margin: 16px 0;">
        ${message}
      </blockquote>
      <hr style="border: 1px solid #e66000; opacity: 0.2;" />
      <p style="font-size: 0.9em; color: #4a4a4a;">
        This message was sent from your personal portfolio website. Please respond directly to the sender's email.
      </p>
    </div>
  `;
}
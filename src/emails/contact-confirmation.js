/**
 * Optional: Confirmation email sent to the user who submitted the form
 */
export default function ContactConfirmation({ name }) {
  return `
    <div style="font-family: 'Satoshi', sans-serif; background: #faf8f5; padding: 2rem; border-radius: 8px; color: #1a2e1a; max-width: 600px; margin: 0 auto; border: 1px solid #e6600033;">
      <h2 style="font-family: 'Fraunces', serif; color: #1a2e1a; margin-bottom: 1rem;">Thank you, ${name}!</h2>
      <p>I've received your message and will get back to you as soon as possible.</p>
      <p>In the meantime, feel free to explore more of my work on the site.</p>
      <hr style="border: 1px solid #e6600033; margin: 2rem 0;" />
      <p style="color: #4a4a4a; font-size: 0.9rem;">This is an automated confirmation. Please do not reply to this email.</p>
    </div>
  `;
}
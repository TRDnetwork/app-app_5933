/**
 * Confirmation email sent to the person who filled out the contact form.
 * Pure function — no side effects.
 */
export default function ContactConfirmationEmail({ name }: { name: string }) {
  return `
    <div style="font-family: 'Satoshi', sans-serif; background-color: #faf8f5; padding: 32px; border-radius: 12px; color: #1a2e1a; max-width: 600px; margin: 0 auto; border: 1px solid #e66000; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <h2 style="font-family: 'Fraunces', serif; color: #1a2e1a; margin-bottom: 8px; font-size: 1.5rem;">Thanks for reaching out, ${name}!</h2>
      <p style="color: #4a4a4a;">I’ve received your message and will get back to you as soon as possible.</p>
      
      <div style="margin: 24px 0; padding: 16px; background: #ffffff; border-radius: 8px; border-left: 4px solid #e66000;">
        <p>Your message is important to me. I aim to respond within 24–48 hours.</p>
      </div>

      <footer style="font-size: 0.85rem; color: #4a4a4a; margin-top: 24px; border-top: 1px solid #e66000; padding-top: 12px;">
        <p>Sent from <strong>Dev Portfolio</strong> — built with care using React, Vite, and Tailwind CSS.</p>
      </footer>
    </div>
  `;
}
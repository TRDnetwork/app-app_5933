/**
 * Email template for notifying site owner of new contact form submission
 * Pure function — no side effects
 */
export default function ContactNotificationEmail({ name, email, message }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>New Contact Form Submission</title>
        <style>
          body {
            font-family: 'Satoshi', sans-serif;
            background-color: #faf8f5;
            color: #1a2e1a;
            line-height: 1.6;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 30px;
            background-color: #fff;
            border: 1px solid #e66000;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(230, 96, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 24px;
            color: #e66000;
          }
          .header h1 {
            margin: 0;
            font-family: 'Fraunces', serif;
            font-size: 2rem;
            letter-spacing: -0.05em;
          }
          .content p {
            margin: 16px 0;
          }
          .label {
            font-weight: 600;
          }
          .footer {
            margin-top: 32px;
            text-align: center;
            font-size: 0.9rem;
            color: #4a4035;
            border-top: 1px solid #e9e5e0;
            padding-top: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Dev Portfolio</h1>
          </div>
          <div class="content">
            <p><span class="label">Name:</span> ${name}</p>
            <p><span class="label">Email:</span> <a href="mailto:${email}">${email}</a></p>
            <p><span class="label">Message:</span></p>
            <p>${message}</p>
          </div>
          <div class="footer">
            <p>Received via contact form on your personal portfolio site.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
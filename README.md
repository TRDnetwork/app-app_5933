# Dev Portfolio

A responsive personal portfolio website for a full-stack developer with featured projects and contact form.

## Features

- **Hero Section**: Displays name and role with smooth entry animation
- **About Section**: Short developer bio with styled typography
- **Featured Projects**: 3 project cards showing title, description, and tech stack
- **Contact Form**: 
  - Client-side validation using Zod
  - Spam protection via honeypot field
  - IP rate limiting (5 submissions/hour) using Upstash Redis
  - Secure email delivery via Resend
- **Responsive Design**: Mobile-first layout with smooth scroll animations
- **Performance Optimized**: Zero external blocking JavaScript, lazy loading, and optimized assets
- **Accessibility**: Full a11y support with proper labels, ARIA roles, and keyboard navigation

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS
- **Animations**: Framer Motion for scroll and hover animations
- **Styling**: Tailwind CSS with custom configuration for warm minimalism aesthetic
- **Email**: Resend for secure email delivery
- **Rate Limiting**: Upstash Redis for IP-based rate limiting
- **Deployment**: Vercel serverless functions
- **Monitoring**: Sentry, PostHog, Vercel Logs
- **Security**: Input sanitization with `isomorphic-dompurify`, honeypot spam protection

## Design System

**Aesthetic**: Warm minimalism with organic contrast  
**Colors**:
- Background: `#faf8f5` (cream)
- Text: `#1a2e1a` (dark green)
- Accent: `#e66000` (orange)
- Surface: `#f5f3f0`
- Text Dim: `#4a4a4a`

**Typography**:
- Headings: Fraunces (letter-spacing: -0.05em)
- Body: Satoshi (line-height: 1.6, max-width: 65ch)

**Layout**:
- Centered vertical flow with 1200px max-width
- Sections separated by thin orange dividers (30% opacity)
- Sticky header with minimal navigation
- Project cards in responsive 1-2-3 grid with hover lift animation

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Vercel account
- Resend account
- Upstash Redis account

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/dev-portfolio.git
cd dev-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=your_email@domain.com
```

For Vercel deployment, add these environment variables in the Vercel dashboard.

### Configuration

1. **Update personal information** in `src/App.tsx`:
   - Name and role in Hero section
   - Bio in About section
   - Project details in Projects section

2. **Customize email settings**:
   - Update `CONTACT_EMAIL` to your preferred email address
   - Verify your domain in Resend dashboard for better deliverability

## Usage

### Development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view the site.

### Build
```bash
npm run build
```
Generates static files in the `dist` directory.

### Preview
```bash
npm run preview
```
Locally preview the production build.

## API Endpoints

### `POST /api/contact`

Sends a contact form submission via email.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'd like to work together!",
  "bot-field": ""
}
```

**Success Response** (200):
```json
{
  "success": true,
  "id": "email_12345"
}
```

**Error Responses**:
- 400: Missing required fields or invalid email format
- 405: Method not allowed
- 500: Internal server error

**Rate Limiting**:
- 5 submissions per hour per IP address
- Uses Upstash Redis with sliding window algorithm
- Honeypot field silently logs and accepts spam submissions

## Folder Structure

```
dev-portfolio/
├── api/                    # Vercel serverless functions
│   └── contact.ts          # Contact form handler
├── public/                 # Static assets
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/         # React components
│   ├── emails/             # Email templates
│   ├── main.tsx            # Entry point
│   └── App.tsx             # Main application component
├── tests/                  # Test files
├── index.html              # HTML template
├── middleware.ts           # Vercel middleware
├── package.json
├── tsconfig.json
└── vercel.json             # Vercel configuration
```

## Deployment

Deployed on Vercel with the following configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/contact.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/contact",
      "dest": "/api/contact"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

## Security Features

- **Input Sanitization**: All user inputs sanitized with `isomorphic-dompurify`
- **Honeypot Protection**: Hidden form field detects bots (silent success, logs to Sentry)
- **Rate Limiting**: Upstash Redis enforces 5 submissions/hour/IP with fail-open policy
- **Secure Headers**: X-Frame-Options, X-Content-Type-Options, and Referrer-Policy
- **Environment Variables**: API keys never exposed to client-side code
- **Email Validation**: Regex validation for email format
- **Error Handling**: Generic error messages to clients, detailed logging to Sentry

## Performance Optimization

- **Zero External Blocking JS**: No third-party scripts block rendering
- **Lazy Loading**: Images and non-critical resources load on demand
- **Optimized Bundle**: Tree-shaken dependencies and code splitting
- **Font Optimization**: Preconnect to Google Fonts, font-display swap
- **Resource Hints**: Preconnect and prefetch for critical resources
- **Efficient Animations**: CSS transforms and opacity for smooth 60fps animations

## Testing

### Running Tests

```bash
npm test
```

### Test Coverage

- **Component Tests**: Verify all main sections render correctly
- **Form Validation**: Test required fields and error states
- **API Integration**: Mock rate limiting and email delivery
- **Accessibility**: Ensure proper labels and ARIA attributes

See `tests/README.md` for detailed test information.

## Email Setup

Refer to `EMAIL_SETUP.md` for complete instructions on configuring Resend email delivery, including API key setup, domain verification, and environment variables.

## Monitoring

- **Vercel Logs**: Real-time function execution logs
- **Sentry**: Error tracking and performance monitoring
- **PostHog**: User behavior analytics
- **Resend Dashboard**: Email delivery status and statistics
- **Upstash Console**: Rate limiting metrics and Redis performance

## License

This project is licensed under the MIT License - see the LICENSE file for details.
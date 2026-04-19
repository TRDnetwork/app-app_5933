import { Resend } from 'resend';

// Initialize Resend client with environment variable
// API_KEY placeholder will be replaced during deployment
const resend = new Resend(process.env.RESEND_API_KEY /* API_KEY */);

interface SendEmailParams {
  to: string | string[];
  from: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

interface SendEmailResult {
  success: boolean;
  error?: string;
  id?: string;
}

/**
 * Typed wrapper for Resend email service with error handling and retry logic
 */
export class ResendService {
  private client = resend;
  private maxRetries = 3;

  /**
   * Send email with exponential backoff retry logic
   */
  async sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
    let lastError: Error | undefined;

    for (let i = 0; i < this.maxRetries; i++) {
      try {
        const response = await this.client.emails.send({
          from: params.from,
          to: Array.isArray(params.to) ? params.to : [params.to],
          subject: params.subject,
          html: params.html,
          text: params.text,
          reply_to: params.replyTo,
        });

        if (response.error) {
          throw new Error(response.error.message);
        }

        return {
          success: true,
          id: response.data?.id,
        };
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx)
        if (error instanceof Error && error.message.includes('400')) {
          break;
        }

        // Exponential backoff: 1s, 2s, 4s
        if (i < this.maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Failed to send email after retries',
    };
  }
}

// Export singleton instance
export const resendService = new ResendService();
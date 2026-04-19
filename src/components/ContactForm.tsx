import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Email is invalid'),
  message: z.string().min(1, 'Message is required'),
  // Honeypot field
  'bot-field': z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const ContactForm = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: FormValues) => {
    // If honeypot is filled, silently succeed (spam)
    if (data['bot-field']) {
      setIsSubmitted(true);
      reset();
      return;
    }

    setSubmitError(null);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setIsSubmitted(true);
      reset();
    } catch (error) {
      setSubmitError('Something went wrong. Please try again later.');
    }
  };

  return (
    <section 
      id="contact" 
      className="section px-4 py-16 scroll-mt-20"
      role="region" 
      aria-labelledby="contact-heading"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 
            id="contact-heading" 
            className="text-3xl font-display font-bold mb-8 text-center text-dark-green"
          >
            Get In Touch
          </h2>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-6 bg-green-50 text-green-800 rounded-lg border border-green-200"
              role="alert"
              aria-live="polite"
            >
              <p className="text-lg font-semibold mb-2">Message sent successfully!</p>
              <p>Thank you for reaching out. I'll get back to you soon.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Honeypot field - hidden from humans */}
              <div className="hidden">
                <label htmlFor="bot-field">Don't fill this out</label>
                <input 
                  id="bot-field" 
                  {...register('bot-field')} 
                  tabIndex={-1} 
                  autoComplete="off" 
                />
              </div>

              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-text-dim mb-2"
                >
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={`w-full px-4 py-3 border border-surface rounded-lg focus:ring-2 focus:ring-accent focus:ring-opacity-50 focus:border-transparent transition-colors ${
                    errors.name ? 'border-red-300' : 'border-surface'
                  }`}
                  {...register('name')}
                />
                {errors.name && (
                  <p 
                    id="name-error" 
                    className="mt-1 text-sm text-red-600" 
                    role="alert"
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-text-dim mb-2"
                >
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={`w-full px-4 py-3 border border-surface rounded-lg focus:ring-2 focus:ring-accent focus:ring-opacity-50 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-300' : 'border-surface'
                  }`}
                  {...register('email')}
                />
                {errors.email && (
                  <p 
                    id="email-error" 
                    className="mt-1 text-sm text-red-600" 
                    role="alert"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label 
                  htmlFor="message" 
                  className="block text-sm font-medium text-text-dim mb-2"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={`w-full px-4 py-3 border border-surface rounded-lg focus:ring-2 focus:ring-accent focus:ring-opacity-50 focus:border-transparent transition-colors ${
                    errors.message ? 'border-red-300' : 'border-surface'
                  }`}
                  {...register('message')}
                />
                {errors.message && (
                  <p 
                    id="message-error" 
                    className="mt-1 text-sm text-red-600" 
                    role="alert"
                  >
                    {errors.message.message}
                  </p>
                )}
              </div>

              {submitError && (
                <div 
                  className="p-3 bg-red-50 text-red-700 rounded border border-red-200 text-sm"
                  role="alert"
                >
                  {submitError}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-white py-3 px-6 rounded-lg font-semibold hover:bg-accent-alt transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 tap-target"
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};
---
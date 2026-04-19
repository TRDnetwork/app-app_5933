import { useState } from 'react';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { sanitize } from 'isomorphic-dompurify';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Email is invalid'),
  message: z.string().min(1, 'Message is required'),
  // Honeypot field
  website: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    website: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check honeypot
    if (formData.website) {
      console.log('Honeypot triggered - possible spam');
      setSubmitStatus('success'); // Silent success to fool bots
      setTimeout(() => setSubmitStatus('idle'), 4000);
      return;
    }

    const result = formSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as keyof FormData] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const sanitizedData = {
        name: sanitize(formData.name),
        email: sanitize(formData.email),
        message: sanitize(formData.message),
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData),
      });

      if (response.ok) {
        setFormData({ name: '', email: '', message: '', website: '' });
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      className="section py-20 px-6"
      role="region" 
      aria-labelledby="contact-heading"
    >
      <div className="max-w-2xl mx-auto">
        <motion.h2 
          id="contact-heading"
          className="text-3xl md:text-4xl font-bold mb-12 text-center text-text"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          Get In Touch
        </motion.h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Honeypot field - hidden from humans, visible to bots */}
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="website">Don't fill this out</label>
            <input
              id="website"
              name="website"
              type="text"
              value={formData.website}
              onChange={handleChange}
              tabIndex={-1}
            />
          </div>

          <div className="space-y-6">
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-text mb-2"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors min-h-11 ${
                  errors.name ? 'border-red-500' : 'border-surface focus:border-accent'
                }`}
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p 
                  id="name-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-text mb-2"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors min-h-11 ${
                  errors.email ? 'border-red-500' : 'border-surface focus:border-accent'
                }`}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p 
                  id="email-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label 
                htmlFor="message" 
                className="block text-sm font-medium text-text mb-2"
              >
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors min-h-11 ${
                  errors.message ? 'border-red-500' : 'border-surface focus:border-accent'
                }`}
                aria-invalid={errors.message ? 'true' : 'false'}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <p 
                  id="message-error"
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {errors.message}
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:bg-accent-alt focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed min-h-11"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </motion.button>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-50 text-green-800 rounded-lg text-center border border-green-200"
              role="status"
              aria-live="polite"
            >
              Message sent successfully! I'll get back to you soon.
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-50 text-red-800 rounded-lg text-center border border-red-200"
              role="alert"
              aria-live="assertive"
            >
              Something went wrong. Please try again later.
            </motion.div>
          )}
        </form>
      </div>
    </section>
  );
};
---
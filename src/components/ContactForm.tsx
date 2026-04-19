import React, { useState } from 'react';
// Lazy load Framer Motion for performance
const { motion } = await import('framer-motion');

interface FormData {
  name: string;
  email: string;
  message: string;
}

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.message) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, 'bot-field': '' }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setIsSuccess(false), 4000);
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="py-24 px-6"
      id="contact"
      role="region"
      aria-labelledby="contact-title"
    >
      <div className="container mx-auto max-w-4xl">
        <h2
          id="contact-title"
          className="text-3xl sm:text-4xl font-bold text-center mb-12"
          style={{ fontFamily: 'Fraunces, serif', color: '#1a2e1a' }}
        >
          Get In Touch
        </h2>
        {isSuccess && (
          <div
            className="toast animate-fade-in mb-6"
            role="alert"
            aria-live="polite"
          >
            Message sent successfully!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="form-control">
            <label htmlFor="name-input" className="sr-only">Name</label>
            <input
              type="text"
              id="name-input"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              className="input w-full"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div className="form-control">
            <label htmlFor="email-input" className="sr-only">Email</label>
            <input
              type="email"
              id="email-input"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className="input w-full"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-control">
            <label htmlFor="message-input" className="sr-only">Message</label>
            <textarea
              id="message-input"
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              disabled={isSubmitting}
              rows={5}
              className="input w-full"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            {errors.message && (
              <p id="message-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.message}
              </p>
            )}
          </div>

          {/* Honeypot field (hidden from humans) */}
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="bot-field">Don't fill this out</label>
            <input
              type="text"
              id="bot-field"
              name="bot-field"
              tabIndex={-1}
            />
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="btn w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </motion.button>
        </form>
      </div>
    </motion.section>
  );
};
---
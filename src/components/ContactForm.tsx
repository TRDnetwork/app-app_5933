import React, { useState } from 'react';
// PERF: Lazy load heavy animation library
// Framer Motion is only needed when form is in viewport
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
    else if (formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on edit
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
      viewport={{ once: true }}
      className="section pt-20 pb-20 px-4 md:px-6"
      id="contact"
      role="region"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-4xl mx-auto">
        <h2 id="contact-heading" className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ fontFamily: 'Fraunces, serif', color: '#1a2e1a' }}>
          Get In Touch
        </h2>
        {isSuccess && (
          <div className="toast animate-fade-in mb-6">Thanks for your message!</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              className="form-input w-full p-4 text-base"
              aria-invalid={errors.name ? 'true' : 'false'}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="form-control">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className="form-input w-full p-4 text-base"
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="form-control">
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              disabled={isSubmitting}
              rows={5}
              className="form-input w-full p-4 text-base resize-none"
              aria-invalid={errors.message ? 'true' : 'false'}
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>

          {/* Honeypot field (hidden from humans) */}
          <div className="absolute -left-full -top-full">
            <input
              type="text"
              name="bot-field"
              placeholder="Address"
              className="h-px w-px overflow-hidden absolute"
              aria-label="Please leave this field empty"
            />
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full py-4 text-base"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </motion.button>
        </form>
      </div>
    </motion.section>
  );
};
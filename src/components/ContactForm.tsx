import { useState } from 'react';
import { useForm } from 'react-hook-form';
import DOMPurify from 'isomorphic-dompurify';
import { motion } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  message: string;
  'bot-field': string;
}

export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    // a11y fix: sanitize input to prevent XSS
    const cleanData = {
      name: DOMPurify.sanitize(data.name),
      email: DOMPurify.sanitize(data.email),
      message: DOMPurify.sanitize(data.message),
    };

    if (data['bot-field']) {
      // Honeypot triggered — likely spam
      setSubmitStatus('success'); // Lie to bots
      setTimeout(() => setSubmitStatus('idle'), 4000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      className="section py-20"
      aria-labelledby="contact-heading"
      role="region"
    >
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            id="contact-heading"
            className="text-3xl md:text-4xl font-bold mb-4 text-[#1a2e1a] text-center"
          >
            Get In Touch
          </h2>
          <div className="divider mx-auto mb-8" /> {/* a11y fix: visual divider with sufficient contrast */}
          
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Honeypot field - hidden from humans, visible to bots */}
            <div className="absolute left-[-9999px]">
              <label htmlFor="bot-field">Don't fill this out</label>
              <input 
                id="bot-field" 
                type="text" 
                {...register('bot-field')} 
                autoComplete="off"
              />
            </div>

            <div className="mb-6">
              <label 
                htmlFor="name" 
                className="block mb-2 font-medium text-[#1a2e1a]"
              >
                Your Name
              </label>
              <input
                id="name"
                type="text"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-4 transition-all duration-300 ${
                  errors.name
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-200 focus:ring-[#e66000]/20'
                }`}
                placeholder="John Doe"
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'name-error' : undefined}
                {...register('name', { 
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                })}
              />
              {errors.name && (
                <p 
                  id="name-error"
                  role="alert"
                  className="mt-2 text-red-600 text-sm"
                >
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label 
                htmlFor="email" 
                className="block mb-2 font-medium text-[#1a2e1a]"
              >
                Your Email
              </label>
              <input
                id="email"
                type="email"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-4 transition-all duration-300 ${
                  errors.email
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-200 focus:ring-[#e66000]/20'
                }`}
                placeholder="john@example.com"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Email is invalid'
                  }
                })}
              />
              {errors.email && (
                <p 
                  id="email-error"
                  role="alert"
                  className="mt-2 text-red-600 text-sm"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label 
                htmlFor="message" 
                className="block mb-2 font-medium text-[#1a2e1a]"
              >
                Your Message
              </label>
              <textarea
                id="message"
                rows={5}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-4 transition-all duration-300 ${
                  errors.message
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-200 focus:ring-[#e66000]/20'
                }`}
                placeholder="Tell me about your project..."
                aria-invalid={errors.message ? 'true' : 'false'}
                aria-describedby={errors.message ? 'message-error' : undefined}
                {...register('message', { 
                  required: 'Message is required',
                  minLength: {
                    value: 10,
                    message: 'Message must be at least 10 characters'
                  }
                })}
              />
              {errors.message && (
                <p 
                  id="message-error"
                  role="alert"
                  className="mt-2 text-red-600 text-sm"
                >
                  {errors.message.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-3 bg-[#e66000] text-white rounded-lg font-medium transition-all duration-300 hover:bg-[#ff8c42] focus:outline-none focus:ring-4 focus:ring-[#e66000]/50 disabled:opacity-70 disabled:cursor-not-allowed min-h-11"
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          {/* Success message */}
          {submitStatus === 'success' && (
            <motion.div
              className="mt-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              aria-live="polite"
            >
              Message sent successfully! I'll get back to you soon.
            </motion.div>
          )}

          {/* Error message */}
          {submitStatus === 'error' && (
            <motion.div
              className="mt-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              aria-live="assertive"
            >
              Something went wrong. Please try again later.
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
---
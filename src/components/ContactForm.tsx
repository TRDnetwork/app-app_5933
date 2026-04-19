import { useState } from 'react';
import { useForm } from 'react-hook-form';
import DOMPurify from 'isomorphic-dompurify';
import { motion } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const sanitizedData = {
        name: DOMPurify.sanitize(data.name.trim()),
        email: DOMPurify.sanitize(data.email.trim()),
        message: DOMPurify.sanitize(data.message.trim()),
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
      } else {
        const result = await response.json();
        console.error('Form submission error:', result.error);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Network error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 bg-[#e9e5dd]" aria-labelledby="contact-heading" role="region">
      <div className="container mx-auto max-w-3xl">
        <motion.h2
          id="contact-heading"
          className="text-3xl md:text-4xl font-display font-semibold text-[#1a2e1a] mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Get In Touch
        </motion.h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#1a2e1a] mb-1"
            >
              Name <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`w-full px-4 py-3 border ${
                errors.name
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-[#e9e5dd] focus:ring-[#e66000] focus:border-[#e66000]'
              } rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 transition duration-200 text-base`}
              style={{ minHeight: '44px' }}
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600" id="name-error" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#1a2e1a] mb-1"
            >
              Email <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full px-4 py-3 border ${
                errors.email
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-[#e9e5dd] focus:ring-[#e66000] focus:border-[#e66000]'
              } rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 transition duration-200 text-base`}
              style={{ minHeight: '44px' }}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Please enter a valid email address',
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600" id="email-error" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-[#1a2e1a] mb-1"
            >
              Message <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <textarea
              id="message"
              rows={5}
              aria-invalid={errors.message ? 'true' : 'false'}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={`w-full px-4 py-3 border ${
                errors.message
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-[#e9e5dd] focus:ring-[#e66000] focus:border-[#e66000]'
              } rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 transition duration-200 text-base`}
              style={{ minHeight: '110px' }}
              {...register('message', {
                required: 'Message is required',
                minLength: {
                  value: 10,
                  message: 'Message must be at least 10 characters',
                },
              })}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600" id="message-error" role="alert">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Honeypot field */}
          <div className="absolute -left-full -top-full" aria-hidden="true">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              autoComplete="address-line1"
              type="text"
              tabIndex={-1}
            />
          </div>

          <div>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#e66000] hover:bg-[#e66000]/90 disabled:bg-[#e66000]/70 text-white font-medium py-3 px-6 rounded-lg shadow transition duration-200 flex items-center justify-center text-base"
              style={{ minHeight: '44px' }}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </motion.button>
          </div>
        </form>

        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-center"
            role="alert"
            aria-live="polite"
          >
            Thanks for your message! I'll get back to you soon.
          </motion.div>
        )}

        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-center"
            role="alert"
            aria-live="polite"
          >
            Sorry, something went wrong. Please try again later.
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ContactForm;
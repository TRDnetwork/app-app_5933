import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#faf8f5',
        'green-darker': '#1a2e1a',
        'green-dim': '#7a7060',
        orange: '#e66000',
        'orange-alt': '#ff8c42',
        'orange-light': '#ffe0c0',
        surface: '#ffffff',
        'surface-hover': '#f8f7f5',
        'surface-active': '#f0eee9',
        success: '#10b981',
        'success-light': '#d1fae5',
        warning: '#f59e0b',
        'warning-light': '#fef3c7',
        error: '#ef4444',
        'error-light': '#fee2e2',
        info: '#3b82f6',
        'info-light': '#dbeafe',
        'gray-50': '#f9fafb',
        'gray-100': '#f3f4f6',
        'gray-200': '#e5e7eb',
        'gray-300': '#d1d5db',
        'gray-400': '#9ca3af',
        'gray-500': '#6b7280',
        'gray-600': '#4b5563',
        'gray-700': '#374151',
        'gray-800': '#1f2937',
        'gray-900': '#111827',
        'orange/10': 'rgba(230, 96, 0, 0.1)',
        'orange/20': 'rgba(230, 96, 0, 0.2)',
        'orange/50': 'rgba(230, 96, 0, 0.5)',
        'green-darker/10': 'rgba(26, 46, 26, 0.1)',
        'green-darker/20': 'rgba(26, 46, 26, 0.2)',
        'green-darker/50': 'rgba(26, 46, 26, 0.5)',
        'green-dim/30': 'rgba(122, 112, 96, 0.3)',
        'green-dim/50': 'rgba(122, 112, 96, 0.5)',
        'green-dim/80': 'rgba(122, 112, 96, 0.8)',
        'surface/80': 'rgba(255, 255, 255, 0.8)',
        'surface/90': 'rgba(255, 255, 255, 0.9)',
        'black/50': 'rgba(0, 0, 0, 0.5)',
        'black/80': 'rgba(0, 0, 0, 0.8)',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Satoshi', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '2rem',
        screens: {
          '2xl': '1200px',
        },
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            color: theme('colors.green-darker'),
            maxWidth: '65ch',
            a: {
              color: theme('colors.orange'),
              '&:hover': {
                color: theme('colors.orange-alt'),
              },
            },
            h1: { color: theme('colors.green-darker') },
            h2: { color: theme('colors.green-darker') },
            h3: { color: theme('colors.green-darker') },
            h4: { color: theme('colors.green-darker') },
            strong: { color: theme('colors.green-darker') },
          },
        },
      }),
      // PERFORMANCE: Add animation optimizations
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // PERFORMANCE: Enable important selector for component styling
    function ({ addBase }: any) {
      addBase({
        '*, *::before, *::after': {
          borderColor: 'rgba(var(--tw-border-color, 0.1), 0.3)',
          transitionProperty: 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDuration: '200ms',
        }
      })
    }
  ],
};

export default config;
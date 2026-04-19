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
        surface: '#e9e5dd',
        // Add colors for rate limit indicators
        'rate-limit-warning': '#f59e0b',
        'rate-limit-error': '#ef4444',
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
      // Add animation for rate limit warning
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      animation: {
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // Add plugin to generate cache-related classes
    function({ addUtilities }: any) {
      const newUtilities = {
        '.cache-hit': {
          '@apply border-l-4 border-green-500 bg-green-50': {},
        },
        '.cache-miss': {
          '@apply border-l-4 border-orange bg-orange/10': {},
        },
        '.rate-limited': {
          '@apply animate-pulse-slow border-l-4 border-rate-limit-error bg-red-50': {},
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config;
---
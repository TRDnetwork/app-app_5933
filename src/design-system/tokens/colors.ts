/**
 * Color tokens for TRD Network design system
 * Based on warm minimalism palette: cream, dark green, burnt orange
 */
export const colors = {
  // Core palette
  cream: '#faf8f5',
  'dark-green': '#1a2e1a',
  'burnt-orange': '#e66000',
  'orange-alt': '#ff8c42',
  
  // Surface colors
  surface: '#e9e5e0',
  'surface-hover': '#e0ddd8',
  
  // Text colors
  'text-primary': '#1a2e1a',
  'text-secondary': '#4a403a',
  'text-disabled': '#8c8279',
  
  // Semantic colors
  success: '#2e7d32',
  warning: '#e66000',
  error: '#c62828',
  info: '#1565c0',
  
  // Border colors
  border: '#e9e5e0',
  'border-hover': '#d4cdc5',
  
  // Focus states
  focus: '#e66000',
  'focus-opacity': 0.5,
} as const;

export type ColorKey = keyof typeof colors;
---
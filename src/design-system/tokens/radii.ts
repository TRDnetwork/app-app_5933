/**
 * Border radius tokens for TRD Network design system
 * Rounded but not overly soft to maintain authority
 */
export const radii = {
  // No radius
  'rounded-none': '0',
  
  // Small radii
  'rounded-sm': '0.125rem',
  'rounded': '0.25rem',
  'rounded-md': '0.375rem',
  
  // Standard radii
  'rounded-lg': '0.5rem',
  'rounded-xl': '0.75rem',
  'rounded-2xl': '1rem',
  
  // Large radii
  'rounded-3xl': '1.5rem',
  'rounded-full': '9999px',
  
  // Component-specific radii
  'button-radius': '0.375rem',
  'card-radius': '0.5rem',
  'input-radius': '0.375rem',
  'badge-radius': '9999px',
} as const;

export type RadiusKey = keyof typeof radii;
---
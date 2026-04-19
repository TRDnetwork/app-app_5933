/**
 * Shadow tokens for TRD Network design system
 * Subtle shadows that complement the warm minimalism aesthetic
 */
export const shadows = {
  // No shadow
  'shadow-none': 'none',
  
  // Subtle shadows
  'shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
  'shadow': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  'shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  'shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  'shadow-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  'shadow-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Focus shadows
  'shadow-focus': '0 0 0 3px rgba(230, 96, 0, 0.1)',
  'shadow-focus-strong': '0 0 0 4px rgba(230, 96, 0, 0.25)',
  
  // Card-specific shadows
  'card-shadow': '0 4px 6px -1px rgba(26, 46, 26, 0.1), 0 2px 4px -1px rgba(26, 46, 26, 0.06)',
  'card-shadow-hover': '0 10px 15px -3px rgba(26, 46, 26, 0.1), 0 4px 6px -2px rgba(26, 46, 26, 0.06)',
  
  // Header shadow
  'header-shadow': '0 1px 3px rgba(0, 0, 0, 0.1)',
} as const;

export type ShadowKey = keyof typeof shadows;
---
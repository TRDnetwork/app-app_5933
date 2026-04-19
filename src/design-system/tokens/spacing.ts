/**
 * Spacing tokens for TRD Network design system
 * 4px base scale (0.25rem)
 */
export const spacing = {
  // Base scale (4px increments)
  'space-0': '0',
  'space-1': '0.25rem', // 4px
  'space-2': '0.5rem',  // 8px
  'space-3': '0.75rem', // 12px
  'space-4': '1rem',    // 16px
  'space-6': '1.5rem',  // 24px
  'space-8': '2rem',    // 32px
  'space-12': '3rem',   // 48px
  'space-16': '4rem',   // 64px
  'space-20': '5rem',   // 80px
  'space-24': '6rem',   // 96px
  'space-32': '8rem',   // 128px
  'space-40': '10rem',  // 160px
  'space-48': '12rem',  // 192px
  'space-56': '14rem',  // 224px
  'space-64': '16rem',  // 256px
  
  // Common layout spacings
  'section-padding-y': '5rem',
  'section-padding-x': '1.5rem',
  'container-padding': '1.5rem',
  'grid-gap': '2rem',
  'card-padding': '1.5rem',
  'form-spacing': '1rem',
  
  // Responsive adjustments
  'section-padding-y-mobile': '3rem',
  'section-padding-x-mobile': '1rem',
} as const;

export type SpacingKey = keyof typeof spacing;
---
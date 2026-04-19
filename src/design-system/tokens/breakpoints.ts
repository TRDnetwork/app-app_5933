/**
 * Breakpoint tokens for TRD Network design system
 * Mobile-first responsive design
 */
export const breakpoints = {
  // Mobile first
  'screen-xs': '480px',
  'screen-sm': '640px',
  'screen-md': '768px',
  'screen-lg': '1024px',
  'screen-xl': '1280px',
  'screen-2xl': '1536px',
  
  // Common breakpoint aliases
  'mobile': '640px',
  'tablet': '768px',
  'desktop': '1024px',
  'wide': '1280px',
  
  // Container widths
  'container-sm': '640px',
  'container-md': '768px',
  'container-lg': '1024px',
  'container-xl': '1200px',
  'container-2xl': '1536px',
} as const;

export type BreakpointKey = keyof typeof breakpoints;
---
export const colors = {
  // Base colors
  cream: '#faf8f5',
  'green-darker': '#1a2e1a',
  'green-dim': '#7a7060',
  orange: '#e66000',
  'orange-alt': '#ff8c42',
  'orange-light': '#ffe0c0',
  
  // Surface colors
  surface: '#ffffff',
  'surface-hover': '#f8f7f5',
  'surface-active': '#f0eee9',
  
  // Semantic colors
  success: '#10b981',
  'success-light': '#d1fae5',
  warning: '#f59e0b',
  'warning-light': '#fef3c7',
  error: '#ef4444',
  'error-light': '#fee2e2',
  info: '#3b82f6',
  'info-light': '#dbeafe',
  
  // Neutral colors
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
  
  // Transparent variants
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
} as const;

// Type for color keys
export type ColorKey = keyof typeof colors;
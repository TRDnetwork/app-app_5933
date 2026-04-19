import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Badge variants
const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-surface text-text-primary',
        primary: 'bg-burnt-orange text-white',
        secondary: 'bg-dark-green text-cream',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
        outline: 'bg-transparent border border-border text-text-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode;
  className?: string;
}

/**
 * Reusable Badge component for displaying status or categories
 */
const Badge = ({ children, variant, className }: BadgeProps) => {
  return (
    <span className={badgeVariants({ variant, className })} role="status">
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';

export default Badge;
---
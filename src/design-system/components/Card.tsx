import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';

// Card variants
const cardVariants = cva('bg-white rounded-lg shadow-sm border border-border', {
  variants: {
    variant: {
      default: '',
      elevated: 'shadow-md hover:shadow-lg transition-shadow duration-300',
      outlined: 'border-2 border-surface bg-cream',
    },
    padding: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
});

export interface CardProps extends VariantProps<typeof cardVariants> {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  animate?: boolean;
  onClick?: () => void;
}

/**
 * Reusable Card component with header, body, and footer slots
 * Supports different variants and animations
 */
const Card = ({
  children,
  header,
  footer,
  variant,
  padding,
  className,
  animate = true,
  onClick,
}: CardProps) => {
  const cardContent = (
    <div
      className={cardVariants({ variant, padding, className })}
      onClick={onClick}
    >
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );

  // Wrap with motion if animate is true
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

Card.displayName = 'Card';

export default Card;
---
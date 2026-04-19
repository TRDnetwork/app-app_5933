import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';

// Button variants using class-variance-authority
const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200',
  {
    variants: {
      variant: {
        primary: 'bg-burnt-orange text-white hover:bg-orange-alt focus:ring-burnt-orange',
        secondary: 'bg-dark-green text-cream hover:bg-green-800 focus:ring-dark-green',
        outline: 'border border-burnt-orange text-burnt-orange bg-transparent hover:bg-burnt-orange hover:text-cream focus:ring-burnt-orange',
        ghost: 'text-dark-green hover:bg-surface focus:ring-burnt-orange',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

// Props interface with variants
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  asChild?: boolean;
  animate?: boolean;
}

/**
 * Reusable Button component with multiple variants
 * Supports loading states, icons, and Framer Motion animations
 */
const Button = ({
  children,
  variant,
  size,
  fullWidth,
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  animate = true,
  ...props
}: ButtonProps) => {
  const buttonContent = (
    <>
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {isLoading ? 'Loading...' : children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </>
  );

  const button = (
    <button
      className={buttonVariants({ variant, size, fullWidth, className })}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {buttonContent}
    </button>
  );

  // Wrap with motion if animate is true
  if (animate) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-block"
      >
        {button}
      </motion.div>
    );
  }

  return button;
};

Button.displayName = 'Button';

export default Button;
---
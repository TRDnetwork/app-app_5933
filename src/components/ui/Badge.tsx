import React from 'react';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses = {
  default: 'bg-surface text-green-dim',
  primary: 'bg-orange/10 text-orange',
  secondary: 'bg-green-darker/10 text-green-darker',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    children, 
    variant = 'default', 
    size = 'md', 
    leftIcon, 
    rightIcon, 
    className = '', 
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center font-medium rounded-full';
    const variantClass = variantClasses[variant];
    const sizeClass = sizeClasses[size];
    
    const classes = [
      baseClasses,
      variantClass,
      sizeClass,
      className
    ].filter(Boolean).join(' ');

    return (
      <span
        ref={ref}
        className={classes}
        {...props}
      >
        {leftIcon && <span className="mr-1">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-1">{rightIcon}</span>}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
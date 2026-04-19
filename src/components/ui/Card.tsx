import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    children, 
    header, 
    footer, 
    variant = 'default', 
    className = '', 
    ...props 
  }, ref) => {
    const baseClasses = 'bg-white rounded-lg shadow-sm transition-all duration-300';
    const variantClasses = {
      default: 'border border-surface',
      elevated: 'shadow-md hover:shadow-lg',
      bordered: 'border-2 border-orange/20',
    };
    
    const classes = [
      baseClasses,
      variantClasses[variant],
      className
    ].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={classes}
        {...props}
      >
        {header && (
          <div className="p-6 border-b border-surface">
            {header}
          </div>
        )}
        <div className={header ? 'p-6' : 'p-6'}>
          {children}
        </div>
        {footer && (
          <div className="p-6 border-t border-surface">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
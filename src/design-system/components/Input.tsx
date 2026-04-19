import { ReactNode, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Input variants
const inputVariants = cva(
  'w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:outline-none transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'border-border focus:ring-burnt-orange focus:border-burnt-orange',
        error: 'border-red-300 focus:ring-red-500 focus:border-red-500',
        success: 'border-green-300 focus:ring-green-500 focus:border-green-500',
      },
      size: {
        sm: 'text-sm py-1.5',
        md: 'text-base py-2',
        lg: 'text-lg py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// Label variants
const labelVariants = cva('block text-sm font-medium text-text-primary mb-1', {
  variants: {
    required: {
      true: 'after:content-["_*"] after:text-red-500',
      false: '',
    },
  },
});

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helpText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  required?: boolean;
}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

/**
 * Reusable Input component with label, error states, and icons
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helpText,
      leftIcon,
      rightIcon,
      required = false,
      variant = error ? 'error' : 'default',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={props.id}
            className={labelVariants({ required })}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-secondary">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={inputVariants({ variant, className })}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${props.id}-error` : helpText ? `${props.id}-help` : undefined
            }
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-secondary">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${props.id}-error`}
            className="text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
        {!error && helpText && (
          <p id={`${props.id}-help`} className="text-sm text-text-secondary">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * Reusable Textarea component with label and error states
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helpText,
      required = false,
      variant = error ? 'error' : 'default',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={props.id}
            className={labelVariants({ required })}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={inputVariants({ variant, className })}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${props.id}-error` : helpText ? `${props.id}-help` : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={`${props.id}-error`}
            className="text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
        {!error && helpText && (
          <p id={`${props.id}-help`} className="text-sm text-text-secondary">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Input, Textarea };
---
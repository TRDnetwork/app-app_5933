import React from 'react';

export type InputType = 'text' | 'email' | 'password' | 'tel' | 'number' | 'url' | 'search';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  type?: InputType;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    type = 'text', 
    leftIcon, 
    rightIcon, 
    className = '', 
    ...props 
  }, ref) => {
    const id = props.id || props.name || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    const baseClasses = 'w-full px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-200';
    const errorClasses = error 
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
      : 'border-green-dim/30 focus:ring-orange focus:border-orange';
    const disabledClasses = props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';
    
    const inputClasses = [
      baseClasses,
      errorClasses,
      disabledClasses,
      className
    ].filter(Boolean).join(' ');

    return (
      <div className="form-control">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-green-darker mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-green-dim/60">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            id={id}
            className={inputClasses}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${id}-error`} role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="mt-1 text-sm text-green-dim" id={`${id}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;